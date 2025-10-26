// server/routes/admin/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../../models/orders/Order');
const { verifyToken, verifyAdmin } = require('../../middleware/verifyToken');

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

module.exports = router;
