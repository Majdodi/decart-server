// server/routes/admin/users.js
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { verifyToken, verifyAdmin } = require('../../middleware/verifyToken');

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.put('/:id/role', verifyToken, verifyAdmin, async (req, res) => {
  const { role } = req.body;
  const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  res.json(u);
});

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
