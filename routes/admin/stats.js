// server/routes/admin/stats.js
const express = require('express');
const router = express.Router();
const Order = require('../../models/orders/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');
const { verifyToken, verifyAdmin } = require('../../middleware/verifyToken'); // عدل على حسب مسارك

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments();
    const revenue30dAgg = await Order.aggregate([
      { $match: { createdAt: { $gt: new Date(Date.now() - 30*24*60*60*1000) } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const revenue30d = revenue30dAgg[0]?.total || 0;

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", name: { $first: "$items.name" }, sales: { $sum: "$items.quantity" } } },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      usersCount,
      ordersCount,
      revenue30d,
      topProducts,
      recentOrders,
      topProduct: topProducts[0] || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// بدل التصدير كـ كائن، نصدر دالة تُعيد الـ router (هكذا الملف يصبح "دالة" كما يريد loader)
module.exports = router;
