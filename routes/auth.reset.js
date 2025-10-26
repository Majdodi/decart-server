//console.log("✅ auth.reset.js loaded");

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// ✅ استدعاء الموديلات
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const { sendPasswordResetEmail } = require("../utils/email");

const genericMsg =
  "If an account with that email exists, you will receive a password reset email shortly.";

// =======================
// ✅ POST /api/auth/forgot-password
// =======================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required" });

    const normalized = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalized });

  /*  console.log(
      "📩 [forgot-password] incoming email:",
      normalized,
      "| user found?",
      !!user
    );*/

    if (!user) return res.json({ message: genericMsg });

    // 🗑️ احذف أي tokens قديمة
    const deleted = await PasswordResetToken.deleteMany({ userId: user._id });
   /* console.log(
      `🗑️ [forgot-password] old tokens deleted: ${deleted.deletedCount}`
    );*/

    // 🎲 أنشئ token جديد
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ساعة

    // Debug قبل الإنشاء
  /*  console.log("🛠️ [forgot-password] about to create token with:", {
      userId: user._id,
      tokenHash,
      expiresAt,
    });*/

    try {
      const record = await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
      });

      if (!record) {
        console.error("❌ [forgot-password] لم يتم إنشاء token!");
      } else {
        console.log("✅ [forgot-password] Token record created:", record);
      }
    } catch (dbErr) {
      console.error("🔥 [forgot-password] DB error أثناء إنشاء token:", dbErr);
    }

    const appBase = process.env.APP_BASE_URL || "http://localhost:5173";
    const link = `${appBase}/reset-password/${token}`;
 //   console.log("🔗 [forgot-password] reset link generated:", link);

    try {
      await sendPasswordResetEmail(user.email, link);
      console.log("📧 [forgot-password] email sent to:", user.email);
    } catch (mailErr) {
    /*  console.error(
        "❌ [forgot-password] email send failed:",
        mailErr?.message || mailErr
      );*/
    }

    return res.json({ message: genericMsg });
  } catch (err) {
  //  console.error("🔥 [forgot-password] error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// =======================
// ✅ POST /api/auth/reset-password
// =======================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

  //  console.log("📥 [reset-password] incoming token (raw):", token);

    const cleanToken = String(token).trim();
    const tokenHash = crypto.createHash("sha256").update(cleanToken).digest("hex");

  //  console.log("🔑 [reset-password] clean token:", cleanToken);
    //console.log("🔑 [reset-password] tokenHash:", tokenHash);

    // اطبع كل السجلات Debug
    const allRecords = await PasswordResetToken.find({});
    console.log("🗂️ [reset-password] all token records in DB:", allRecords);

    // ابحث عن السجل المطلوب
    const record = await PasswordResetToken.findOne({
      tokenHash,
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });

    console.log("🔍 [reset-password] matching token found?", !!record);

    if (!record) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // تحديث الباسورد
    const user = await User.findById(record.userId);
    if (!user) {
      console.error("❌ [reset-password] user not found for record:", record);
      return res.status(400).json({ error: "User not found" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    record.usedAt = new Date();
    await record.save();

    // نظّف أي tokens قديمة
    const cleanup = await PasswordResetToken.deleteMany({
      userId: user._id,
      _id: { $ne: record._id },
    });

    //console.log(`✅ [reset-password] password updated for user ${user._id}`);
  //  console.log(`🗑️ [reset-password] old tokens cleaned: ${cleanup.deletedCount}`);

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("🔥 [reset-password] error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
