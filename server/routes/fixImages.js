// server/routes/fixImages.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/fix-all-images", async (req, res) => {
  try {
    console.log("🔧 ==================== STARTING FIX ====================");
    
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products in database`);
    
    let fixedCount = 0;

    for (const p of products) {
      if (!Array.isArray(p.images)) {
        console.log(`⚠️ Product "${p.name}" has invalid images field`);
        continue;
      }

      console.log(`\n🔍 Processing: ${p.name}`);
      console.log(`   📥 OLD IMAGES:`, p.images);

      const cleaned = p.images.map(img => {
        if (!img) return "/images/fallback.png";

        let fixed = img.trim();
        const original = fixed;

        // 1️⃣ Fix https:/ → https://
        if (fixed.startsWith("https:/") && !fixed.startsWith("https://")) {
          fixed = fixed.replace("https:/", "https://");
          console.log(`   ✅ Fixed: https:/ → https://`);
        }

        // 2️⃣ Fix http:/ → http://
        if (fixed.startsWith("http:/") && !fixed.startsWith("http://")) {
          fixed = fixed.replace("http:/", "http://");
          console.log(`   ✅ Fixed: http:/ → http://`);
        }

        // 3️⃣ Remove /images/images/ duplication
        if (fixed.includes("/images/images/")) {
          fixed = fixed.replace(/(\/images\/)+/g, "/images/");
          console.log(`   ✅ Removed duplicate /images/`);
        }

        // Log if changed
        if (fixed !== original) {
          console.log(`   🔄 "${original}" → "${fixed}"`);
        }

        return fixed;
      });

      console.log(`   📤 NEW IMAGES:`, cleaned);

      // Save to database
      p.images = cleaned;
      await p.save();
      fixedCount++;
      
      console.log(`   ✅ Saved!`);
    }

    console.log(`\n🎉 ==================== FIX COMPLETE ====================`);
    console.log(`✅ Updated ${fixedCount} products out of ${products.length} total`);

    res.json({
      success: true,
      message: "🔥 تم إصلاح جميع الصور بنجاح",
      fixedProducts: fixedCount,
      totalProducts: products.length
    });

  } catch (err) {
    console.error("❌ ==================== ERROR ====================");
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;