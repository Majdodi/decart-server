// server/routes/fixImages.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/fix-all-images", async (req, res) => {
  try {
    const products = await Product.find();
    let fixedCount = 0;

    for (const p of products) {
      if (!Array.isArray(p.images)) {
        continue;
      }

      const cleaned = p.images.map(img => {
        if (!img) return "/images/fallback.png";

        let fixed = img.trim();
        const original = fixed;

        // 1️⃣ Fix https:/ → https://
        if (fixed.startsWith("https:/") && !fixed.startsWith("https://")) {
          fixed = fixed.replace("https:/", "https://");
        }

        // 2️⃣ Fix http:/ → http://
        if (fixed.startsWith("http:/") && !fixed.startsWith("http://")) {
          fixed = fixed.replace("http:/", "http://");
        }

        // 3️⃣ Remove /images/images/ duplication
        if (fixed.includes("/images/images/")) {
          fixed = fixed.replace(/(\/images\/)+/g, "/images/");
        }

        return fixed;
      });

      // Save to database
      p.images = cleaned;
      await p.save();
      fixedCount++;
    }

    res.json({
      success: true,
      message: "🔥 تم إصلاح جميع الصور بنجاح",
      fixedProducts: fixedCount,
      totalProducts: products.length
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;