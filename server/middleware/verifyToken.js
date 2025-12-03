// server/middleware/verifyToken.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";

  console.log("🧩 Incoming request to protected route");
  console.log("🪪 Authorization header:", authHeader);

  if (!authHeader.startsWith("Bearer ")) {
    console.log("❌ الهيدر لا يحتوي على Bearer");
    return res.status(401).json({ message: "يجب تسجيل الدخول لإتمام الطلب" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Token extracted:", token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id || payload._id,
      email: payload.email,
      role: payload.role,
    };
    console.log("✅ Token verified successfully:", req.user);
    next();
  } catch (err) {
    console.error("❌ خطأ في التحقق من التوكن:", err.message);
    return res.status(401).json({ message: "الجلسة انتهت أو غير صالحة، يرجى تسجيل الدخول" });
  }
}

function verifyAdmin(req, res, next) {
  console.log("👤 الدور الحالي:", req.user?.role);
  if (!req.user || req.user.role !== "admin") {
    console.log("⛔ المستخدم ليس أدمن");
    return res.status(403).json({ message: "صلاحيات غير كافية (Admin فقط)" });
  }
  console.log("✅ المستخدم أدمن، السماح بالوصول");
  next();
}

module.exports = { verifyToken, verifyAdmin };
