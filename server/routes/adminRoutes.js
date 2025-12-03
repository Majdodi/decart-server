//routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken');
const User = require("../models/User");
const Order = require("../models/orders/Order");
const Product = require("../models/Product");

// 📊 Dashboard stats
router.get("/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const topProduct = await Product.findOne().sort({ sold: -1 }).limit(1);

    res.json({
      totalUsers,
      totalOrders,
      revenue: totalRevenue[0]?.total || 0,
      topProduct: topProduct?.name || "—",
      recentOrders: await Order.find().sort({ createdAt: -1 }).limit(5),
      topProducts: await Product.find().sort({ sold: -1 }).limit(5),
    });
  } catch (error) {
    console.error("❌ Error in /stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👥 Users list
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.json(users);
  } catch (error) {
    console.error("❌ Error in /users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧾 Orders list
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error in /orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
