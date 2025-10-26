// server/routes/admin/settings.js
const express = require('express');
const router = express.Router();
const Settings = require('../../models/Settings'); // صحّح الاسم
const { verifyToken, verifyAdmin } = require('../../middleware/verifyToken');

router.get('/', async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) {
      s = await Settings.create({ siteName: "Decart", contactEmail: "", themeColor: "#5E4F4A" });
    }
    res.json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = new Settings(req.body);
    else Object.assign(s, req.body);
    await s.save();
    res.json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
