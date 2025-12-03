//server/controllers/authController.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const { sendPasswordResetEmail } = require("../utils/email"); // ✅ استدعاء وظيفة الإرسال

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * @desc Forgot Password - generate reset token and send email
 */
const { sendPasswordResetEmail } = require("../utils/email");

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

    const resetLink = `https://decart-server.onrender.com/reset-password?token=${resetToken}`;
    console.log("🔗 Reset link generated:", resetLink);

    console.log("📤 Calling sendPasswordResetEmail() ...");
    console.log("📧 Current mail creds:", process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);

    // ✅ استدعاء الدالة الفعلية لإرسال الإيميل
    await sendPasswordResetEmail(user.email, resetLink);

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
      return res.status(400).json({ success: false, message: "Token and password are required" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const tokenRecord = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await User.findById(tokenRecord.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    await PasswordResetToken.deleteMany({ userId: user._id });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ resetPassword error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

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

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("❌ login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
