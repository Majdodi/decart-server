const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ✅ تحميل المتغيرات
dotenv.config();

const app = express();

// ✅ إعدادات عامة
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ إعداد CORS للسماح للفرونت إند بالتواصل
app.use(
  cors({
    origin: ["https://decart.ps", "http://localhost:5173"],
    credentials: true,
  })
);

// ✅ استدعاء المسارات
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const resetRoutes = require("./routes/auth.reset");

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", resetRoutes);

// ✅ استدعاء مسارات الأدمن
app.use("/api/admin/stats", require("./routes/admin/stats"));
app.use("/api/admin/orders", require("./routes/admin/orders"));
app.use("/api/admin/user", require("./routes/admin/user"));
app.use("/api/admin/messages", require("./routes/admin/messages"));
app.use("/api/admin/settings", require("./routes/admin/settings"));

// ✅ الاتصال بقاعدة البيانات
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // ⏱ يمنع انتظار طويل إذا ما قدر يتصل
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err);
  });


// ✅ مسار افتراضي للفحص
app.get("/", (req, res) => {
  res.send("✅ Decart backend is running successfully!");
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
