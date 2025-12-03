// server/routes/admin/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../../models/Message'); // أنشئ موديل Message بسيط (see below)
const { verifyToken, verifyAdmin } = require('../../middleware/verifyToken');

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs);
});

router.put('/:id/archive', verifyToken, verifyAdmin, async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { archived: true });
  res.json({ success: true });
});

module.exports = router;
