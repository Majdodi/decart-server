const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * @desc Forgot Password - generate reset token and save to DB
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    await PasswordResetToken.deleteMany({ userId: user._id });

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    console.log(`🔗 Reset link: http://localhost:5000/reset-password?token=${resetToken}`);
    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("❌ forgotPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Reset Password - verify token and update password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const tokenRecord = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(tokenRecord.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    await PasswordResetToken.deleteMany({ userId: user._id });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("❌ resetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ابحث عن المستخدم في قاعدة البيانات
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // تحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ تسجيل دخول ناجح:", user.email, "| الدور:", user.role);

    // أعد البيانات مع التوكن
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("❌ login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
