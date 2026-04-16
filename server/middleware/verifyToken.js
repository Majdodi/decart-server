// server/middleware/verifyToken.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id || payload._id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
}

function verifyAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to access this page." });
  }
  next();
}

module.exports = { verifyToken, verifyAdmin };
