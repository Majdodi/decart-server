// server/routes/auth.js ✅ FINAL VERSION (SendGrid Integrated)
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// ✅ استدعاء دالة إرسال الإيميل من utils/email.js
const { sendPasswordResetEmail } = require("../utils/email");

// =============================
// ✅ Register
// =============================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
role: user.role || "user"
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});




// =============================
// ✅ Login
// =============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

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
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// =============================
// ✅ Forgot Password (SendGrid) + Debug Logs
// =============================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // 🧩 نرسل نفس الرد حتى لو الإيميل غير موجود (privacy)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    // 🗑️ حذف أي رموز قديمة
    await PasswordResetToken.deleteMany({ userId: user._id });

    // 🎲 إنشاء رمز جديد
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const savedToken = await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    // 🔗 إنشاء الرابط
    const appBase = process.env.APP_BASE_URL;
const resetLink = `${appBase}/reset-password/${rawToken}`;

   // const resetLink = `https://decart.ps/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetLink);
    } catch (mailErr) {
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
});


module.exports = router;
