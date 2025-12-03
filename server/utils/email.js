// server/utils/email.js
const sgMail = require("@sendgrid/mail");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.development") });

// ✅ تفعيل مفتاح API من env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendPasswordResetEmail(to, link) {
  try {
    const msg = {
      to,
      from: {
        email: "shop@decart.ps", // عنوان المرسل الرسمي
        name: "DECART Shop",
      },
      replyTo: "decartps@outlook.com", // الإيميل اللي تصله الردود
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Reset</h2>
          <p>Click below to reset your password. The link expires in 1 hour:</p>
          <a href="${link}" style="background:#000;color:#fff;padding:10px 16px;text-decoration:none;border-radius:5px;">
            Reset Password
          </a>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ Password reset email sent successfully to:", to);
  } catch (err) {
    console.error("❌ SendGrid error:", err.response?.body || err.message);
    throw err;
  }
}

module.exports = { sendPasswordResetEmail };
