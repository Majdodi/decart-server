// server/middleware/authMiddleware.js
/*
const jwt = require('jsonwebtoken');

// ✅ التحقق من التوكن
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('🔑 التوكن المستلم:', token);

  if (!token) {
    console.log('❌ لا يوجد توكن بالهيدر');
    console.log("🧩 Incoming request to protected route");
console.log("🪪 Authorization header:", req.headers.authorization);

    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // إضافة بيانات المستخدم للطلب
    console.log('✅ المستخدم بعد التحقق من JWT:', req.user);
    next();
  } catch (err) {
    console.error('❌ خطأ في التحقق من التوكن:', err.message);
    console.log("🧩 Incoming request to protected route");
console.log("🪪 Authorization header:", req.headers.authorization);

    res.status(400).json({ error: 'Invalid token' });
  }
};

// ✅ التحقق من أن المستخدم أدمن
const verifyAdmin = (req, res, next) => {
  console.log('👤 دور المستخدم (role):', req.user?.role);
  if (req.user?.role !== 'admin') {
    console.log('⛔ المستخدم ليس أدمن');
    console.log("🧩 Incoming request to protected route");
console.log("🪪 Authorization header:", req.headers.authorization);

    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  console.log('✅ المستخدم أدمن');
  next();
};

module.exports = { verifyToken, verifyAdmin };
/*