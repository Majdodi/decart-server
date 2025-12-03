//server/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const multer = require("multer"); // ⭐ تمت إضافته هنا

// =========================
//    SUPABASE UPLOAD
// =========================
const { createClient } = require("@supabase/supabase-js");

// Multer → حفظ في الذاكرة بدل الهارد
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports.upload = upload;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports.supabase = supabase;


// ⭐ نمرره للراوتر ليستعمله
module.exports.upload = upload;
// =========================



// ENV
const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV || "development"}`);
dotenv.config({ path: envPath });
console.log("✅ Loaded env file:", envPath);

const app = express();

// General settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://decart.ps",
      "https://www.decart.ps",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ⭐ (هذا موجود عندك — خليته)
app.use("/images", express.static(path.join(__dirname, "images")));

// ============================
// 🔍 Global Request Logger
// ============================
app.use((req, res, next) => {
  console.log("➡️ NEW REQUEST");
  console.log("📌 URL:", req.method, req.originalUrl);
  console.log("📌 Headers:", req.headers);
  console.log("📌 Body:", req.body);
  next();
});


// Routes
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const resetRoutes = require("./routes/auth.reset");

app.use("/api/orders", orderRoutes);
console.log("🟦 Loading PRODUCT routes from:", require.resolve("./routes/product"));

app.use("/api/products", productRoutes);
app.use("/api/cart", require("./routes/cart"));
app.use("/api/auth", authRoutes);
app.use("/api/auth", resetRoutes);

app.use("/api/admin/stats", require("./routes/admin/stats"));
app.use("/api/admin/orders", require("./routes/admin/orders"));
app.use("/api/admin/user", require("./routes/admin/user"));
app.use("/api/admin/messages", require("./routes/admin/messages"));
app.use("/api/admin/settings", require("./routes/admin/settings"));
app.use("/uploads", express.static("uploads"));
console.log("📌 REGISTER ROUTE /api/admin/discounts");
app.use("/api/admin/discounts", require("./routes/admin/discounts"));

console.log("🔵 SERVER IS STARTING...");

console.log("📌 REGISTER ROUTE /api/admin/discounts");
app.use("/api/admin/discounts", (req, res, next) => {
  console.log("➡️ REQUEST HIT /api/admin/discounts :", req.method, req.url);
  next();
}, require("./routes/admin/discounts"));


// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(err);
  });

// Test route
app.get("/", (req, res) => {
  res.send("✅ Decart backend is running successfully!");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`)
);

