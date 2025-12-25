const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// =====================================================
//  📌 EXPRESS APP
// =====================================================
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://decart.ps",
      "https://www.decart.ps",
    ],
    credentials: true,
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static("uploads"));

// =====================================================
//  📌 ROUTES
// =====================================================
app.use("/api/products", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/auth.reset"));
app.use("/api/admin/stats", require("./routes/admin/stats"));
app.use("/api/admin/orders", require("./routes/admin/orders"));
app.use("/api/admin/user", require("./routes/admin/user"));
app.use("/api/admin/messages", require("./routes/admin/messages"));
app.use("/api/admin/settings", require("./routes/admin/settings"));
app.use("/api/admin/discounts", require("./routes/admin/discounts"));

// =====================================================
//  📌 DATABASE
// =====================================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

// =====================================================
//  📌 SERVER START
// =====================================================
app.get("/", (req, res) => res.send("Decart backend running ✔"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
