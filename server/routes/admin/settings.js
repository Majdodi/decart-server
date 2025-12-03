// server/routes/admin/settings.js
const express = require("express");
const router = express.Router();
const Settings = require("../../models/Settings");
const { verifyToken, verifyAdmin } = require("../../middleware/verifyToken");

// استدعاء supabase + multer من server.js
const { supabase, upload } = require("../../server");

// يرفع الهيرو على SUPABASE
router.post(
  "/hero-image",
  verifyToken,
  verifyAdmin,
  upload.single("heroImage"), // <-- memory storage!
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No image uploaded" });

      // الاسم النهائي
      const fileName = `hero_${Date.now()}.jpg`;

      // رفع إلى Supabase
      const { data, error } = await supabase.storage
        .from("products") // <-- نفس الباكت الذي تستخدمه لصور المنتجات
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error("❌ Supabase Upload Error:", error);
        return res.status(500).json({ error: "Supabase upload failed" });
      }

      // جلب رابط الصورة النهائي
      const { data: publicData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      const heroURL = publicData.publicUrl;

      // خزنه في DB
      let s = await Settings.findOne();
      if (!s) s = new Settings();
      s.heroImage = heroURL;
      await s.save();

      res.json({
        success: true,
        heroImage: heroURL,
      });
    } catch (err) {
      console.error("❌ Hero upload error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// جلب الإعدادات
router.get("/", async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) {
      s = await Settings.create({
        siteName: "Decart",
        contactEmail: "",
        themeColor: "#5E4F4A",
      });
    }
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

// تحديث الإعدادات
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = new Settings(req.body);
    else Object.assign(s, req.body);

    await s.save();
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
