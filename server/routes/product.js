// server/routes/product.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken');

// ⭐ استدعاء upload من السيرفر
const { upload, supabase } = require("../server");

// ============================================
// ⭐ FIX IMAGES ROUTE (ONLY ONE VERSION)
// ============================================
router.get("/fix-images", async (req, res) => {
  try {
    console.log("🔥 FIX-IMAGES route HIT!");

    const products = await Product.find();

    for (const p of products) {
      console.log("📌 Product:", p._id);
      console.log("   👉 Old images:", p.images);

      if (!Array.isArray(p.images)) continue;

      p.images = p.images.map(img => {
        if (!img) return "/images/fallback.png";

        if (img.startsWith("https://") && img.includes("supabase")) {
          return img;
        }

        if (img.startsWith("/uploads/")) {
          return "/images/fallback.png";
        }

        if (img.startsWith("/images/")) {
          return img;
        }

        return "/images/" + img.replace(/^\/+/, "");
      });

      console.log("   ✅ New images:", p.images);

      await p.save();
    }

    res.json({ message: "All product images normalized!" });
  } catch (err) {
    console.log("❌ ERROR in fix-images:", err);
    res.status(500).json({ error: err.message });
  }
});



function cleanImagePath(img) {
    console.log("🔍 cleanImagePath input:", img);

  if (!img) return "/images/fallback.png";

  let fixed = img;

  // شيل تكرار images/
  fixed = fixed.replace(/(images\/)+/g, "images/");

  // شيل /// زيادة
  fixed = fixed.replace(/\/+/g, "/");

  // لو صورة من uploads
  if (fixed.startsWith("/uploads/")) {
    return fixed;
  }

  // لو رابط كامل
  if (fixed.startsWith("http")) {
    return fixed;
  }

  // لو من images
  if (!fixed.startsWith("/images/")) {
    fixed = "/images/" + fixed.replace(/^\/+/, "");
  }

  return fixed;
  console.log("   ↳ output:", fixed);

}


// ==========================
//  ⭐ UPLOAD IMAGE ROUTE
// ==========================
// ==========================
//     ⭐ UPLOAD to SUPABASE
// ==========================
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const fileName = Date.now() + "-" + file.originalname;

    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) return res.status(500).json({ error });

    const publicUrl =
      process.env.SUPABASE_URL +
      "/storage/v1/object/public/products/" +
      fileName;

    return res.json({
      success: true,
      url: publicUrl,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



// ==========================
//     ⭐ PRODUCT IMAGES FIX
// ==========================
function normalizeImages(body) {
  let imgs = [];

  if (typeof body.images === "string") {
    imgs = body.images
      .split(",")
      .map(i => i.trim())
      .filter(i => i.length > 2);
  } else if (Array.isArray(body.images)) {
    imgs = body.images.map(i => i.trim());
  }

  if (imgs.length === 0) {
    imgs = ["/images/fallback.png"];
  }

  delete body.image;

  body.images = imgs;
  return body;
}






// =============================
//      GET ALL PRODUCTS
// =============================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    products.forEach(p => {
      p.images = p.images.map(cleanImagePath);
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// =============================
//      GET PRODUCT BY ID
// =============================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });

    product.images = product.images.map(cleanImagePath);

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// =============================
//      ADD PRODUCT  ⭐⭐
// =============================
router.post('/', verifyToken, verifyAdmin, upload.single("image"), async (req, res) => {
  console.log("📤 File Upload:", req.file);

  try {
    let images = [];

    // إذا تم رفع صورة
    if (req.file) {
if (req.file) {
  const file = req.file;
  const fileName = Date.now() + "-" + file.originalname;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    return res.status(500).json({ error: "Image upload failed", details: error });
  }

  const publicUrl =
    process.env.SUPABASE_URL +
    "/storage/v1/object/public/products/" +
    fileName;

  images.push(publicUrl);
}
    }

    // إذا كان في صور نصية (comma separated)
if (req.body.images) {
  let list = [];

  if (typeof req.body.images === "string") {
    list = req.body.images
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  } else if (Array.isArray(req.body.images)) {
    list = req.body.images.map(x => x.trim());
  }

  list = list.map(x => {
    if (x.startsWith("/uploads/")) return x;
    if (x.startsWith("http")) return x;
    return "/images/" + x.replace(/^\/+/, "");
  });

  images.push(...list);
}


    if (images.length === 0) {
      images = ["/images/fallback.png"];
    }

    const product = new Product({
      ...req.body,
      images,
    });

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =============================
//      UPDATE PRODUCT ⭐⭐
// =============================
router.put("/:id", verifyToken, verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    let images = [];

    // صورة جديدة؟
    if (req.file) {
if (req.file) {
  const file = req.file;
  const fileName = Date.now() + "-" + file.originalname;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    return res.status(500).json({ error: "Image upload failed", details: error });
  }

  const publicUrl =
    process.env.SUPABASE_URL +
    "/storage/v1/object/public/products/" +
    fileName;

  images.push(publicUrl);
}
    }

    // صور نصية (إذا ما في ملف)
  if (req.body.images) {
  let list = [];

  if (typeof req.body.images === "string") {
    list = req.body.images
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  } else if (Array.isArray(req.body.images)) {
    list = req.body.images.map(x => x.trim());
  }

  list = list.map(x => {
    if (x.startsWith("/uploads/")) return x;
    if (x.startsWith("http")) return x;
    return "/images/" + x.replace(/^\/+/, "");
  });

  images.push(...list);
}


    if (images.length === 0) images = ["/images/fallback.png"];

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =============================
//      DELETE PRODUCT
// =============================
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =============================
//      CHECKOUT
// =============================
router.post('/checkout', verifyToken, async (req, res) => {
  console.log("🛒 CHECKOUT BODY:", req.body);
    console.log("🛒 CHECKOUT USER:", req.user);
  try {
    const { form, cartItems } = req.body;

    res.status(200).json({
      message: 'Checkout successful.',
      order: { form, cartItems },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;
