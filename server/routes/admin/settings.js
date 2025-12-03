// server/routes/admin/settings.js
const express = require('express');
const router = express.Router();
const Settings = require('../../models/Settings'); // صحّح الاسم
const { verifyToken, verifyAdmin } = require('../../middleware/verifyToken');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + "." + ext);
  }
});

const upload = multer({ storage });

router.post('/hero-image', verifyToken, verifyAdmin, upload.single("heroImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    let s = await Settings.findOne();
    if (!s) s = new Settings();

    s.heroImage = "/uploads/" + req.file.filename;
    await s.save();

    res.json({ success: true, heroImage: s.heroImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

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
