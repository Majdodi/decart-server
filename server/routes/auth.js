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
  console.log("📩 REGISTER HIT");
  console.log("📌 BODY:", req.body);

  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    console.log("🔍 Email exists?", exists ? "YES" : "NO");

    if (exists) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const user = new User({ name, email, password });
    await user.save();

    console.log("✅ USER SAVED:", user);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("🎫 GENERATED TOKEN:", token);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
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

    console.log("✅ Login:", user.email, "| role:", user.role);

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
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// =============================
// ✅ Forgot Password (SendGrid) + Debug Logs
// =============================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  console.log("=======================================");
  console.log("📩 FORGOT PASSWORD REQUEST RECEIVED");
  console.log("👉 Incoming email:", email);
  console.log("=======================================");

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    console.log("🔍 Checking user in DB...");
    console.log("   → User found?", user ? "YES ✔" : "NO ❌");

    // 🧩 نرسل نفس الرد حتى لو الإيميل غير موجود (privacy)
    if (!user) {
      console.log("⚠ No user found. Sending generic success response.");
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    // 🗑️ حذف أي رموز قديمة
    console.log("🗑 Deleting old tokens for user:", user._id);
    await PasswordResetToken.deleteMany({ userId: user._id });

    // 🎲 إنشاء رمز جديد
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    console.log("🔐 RAW TOKEN:", rawToken);
    console.log("🔐 HASHED TOKEN:", tokenHash);
    console.log("⏳ Expires At:", expiresAt);

    const savedToken = await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    console.log("💾 Saved token record in DB:");
    console.log(savedToken);

    // 🔗 إنشاء الرابط
    const appBase = process.env.APP_BASE_URL;
const resetLink = `${appBase}/reset-password/${rawToken}`;

   // const resetLink = `https://decart.ps/reset-password/${rawToken}`;
    console.log("🔗 Reset Password Link:", resetLink);

    // 📧 إرسال الإيميل عبر SendGrid
    console.log("📨 Sending reset email via SendGrid to:", user.email);

    try {
      await sendPasswordResetEmail(user.email, resetLink);
      console.log("✅ Email successfully sent!");
    } catch (mailErr) {
      console.error("❌ SENDGRID ERROR:");
      console.error(mailErr);
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully.",
    });

  } catch (error) {
    console.error("🔥 FATAL ERROR in forgot-password:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
});


module.exports = router;
