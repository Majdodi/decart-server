//server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ——————————————————————————
//  التسجيل (Sign Up)
// ——————————————————————————
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ success: true, message: 'User created' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// ——————————————————————————
//  تسجيل الدخول (Login)
// ——————————————————————————
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// ——————————————————————————
//  نسيت كلمة المرور (Forgot Password)
// ——————————————————————————
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a password reset link has been sent.'
      });
    }

    // امسح أي توكن قديم
    await PasswordResetToken.deleteMany({ userId: user._id });

    // أنشئ توكن جديد
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ساعة

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    // رابط إعادة التعيين (اللي يفتح واجهة React أو موقعك الأمامي)
    const resetLink = `http://localhost:5173/reset-password/${rawToken}`;

    // إعداد SMTP عبر Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // الرسالة اللي توصل للمستخدم
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: 'Password Reset',
      html: `
        <h2>Password Reset</h2>
        <p>You have requested to reset your password.</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for 1 hour.</p>
      `,
    };

    // ✨ الإرسال الفعلي للإيميل
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'If that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});



// ——————————————————————————
//  إعادة تعيين كلمة المرور (Reset Password)
// ——————————————————————————
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenDoc = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
      usedAt: null
    });

    if (!tokenDoc) {
      return res.status(400).json({ success: false, error: 'Password reset token is invalid or has expired.' });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found.' });
    }

    // ⚡ فقط خزّن الباسورد الجديد، والـ pre-save hook في User.js بيعمل الهاش
    user.password = password;
    await user.save();

    tokenDoc.usedAt = new Date();
    await tokenDoc.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: 'An error occurred while resetting the password.' });
  }
});

module.exports = router;
