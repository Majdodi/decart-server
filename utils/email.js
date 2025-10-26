const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // مع Gmail لازم يكون true مع port 465
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendPasswordResetEmail(to, link) {
  return transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Reset your password</h2>
        <p>We received a request to reset your password. This link will expire in <b>1 hour</b>.</p>
        <p><a href="${link}" style="background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Reset Password</a></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p style="color:#888">Link: <br>${link}</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
