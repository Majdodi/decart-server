// server/routes/auth.reset.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");

// =======================
// ✅ POST /api/auth/reset-password
// =======================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body || {};

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required.",
      });
    }

    // 🔐 نحول التوكن اللي جاي من الفرونت إلى هاش بنفس طريقة التخزين
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // 🔍 نبحث عن التوكن في قاعدة البيانات
    const record = await PasswordResetToken.findOne({ tokenHash });

    if (!record) {
      return res.status(400).json({
        success: false,
        error: "Password reset token is invalid or has expired.",
      });
    }

    // ⏰ التأكد إنه مش منتهي
    if (record.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({ _id: record._id });

      return res.status(400).json({
        success: false,
        error: "Password reset token is invalid or has expired.",
      });
    }

    // 👤 نجيب المستخدم
    const user = await User.findById(record.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found.",
      });
    }

    // 🔑 تحديث كلمة المرور
    // إذا عندك pre-save hook بيعمل hash تلقائي، يكفي:
    user.password = password;
    // لو ما في hook، استخدم:
    // user.password = await bcrypt.hash(password, 10);

    await user.save();

    // 🧹 نحذف كل التوكنات السابقة لهذا المستخدم
    await PasswordResetToken.deleteMany({ userId: user._id });

    return res.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
});

module.exports = router;
