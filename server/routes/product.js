// server/routes/product.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

// جايين من server.js
const upload = require("../upload");
const supabase = require("../supabase");
const bucket = process.env.SUPABASE_BUCKET;


// =====================================
//  📌 UPLOAD IMAGE → SUPABASE
// =====================================
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file;
    const fileName = Date.now() + "-" + file.originalname;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) return res.status(500).json({ error });

    // ⭐ URL الصحيح
    const publicUrl =
      `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;

    return res.json({ success: true, url: publicUrl });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// =====================================
//  📌 GET ALL PRODUCTS
// =====================================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    console.log("📤 SENDING PRODUCT TO FRONT:", products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================
//  📌 GET PRODUCT BY ID
// =====================================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("📤 SINGLE PRODUCT:", product);

    if (!product) return res.status(404).json({ error: "Not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================
//  📌 ADD PRODUCT
// =====================================
router.post(
  
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("🟢 BACKEND → req.body:", req.body);

      let images = [];

      // ⭐ رفع صورة لسوبابيز
      if (req.file) {
        const file = req.file;
        const fileName = Date.now() + "-" + file.originalname;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
          });

        if (!error) {
          const publicUrl =
            `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;

          images.push(publicUrl);
        }
      }

      // ⭐ صور نصية من الإدخال
      if (req.body.images) {
        let list = [];

        if (typeof req.body.images === "string") {
          list = req.body.images.split(",").map((x) => x.trim());
        } else if (Array.isArray(req.body.images)) {
          list = req.body.images.map((x) => x.trim());
        }

        images.push(...list);
      }

      if (images.length === 0) images = ["/images/fallback.png"];

   const product = new Product({
  name_en: req.body.name_en,
  name_ar: req.body.name_ar,

  description_en: req.body.description_en,
  description_ar: req.body.description_ar,

  topNote_en: req.body.topNote_en,
  topNote_ar: req.body.topNote_ar,

  heartNote_en: req.body.heartNote_en,
  heartNote_ar: req.body.heartNote_ar,

  baseNote_en: req.body.baseNote_en,
  baseNote_ar: req.body.baseNote_ar,

  price: req.body.price,
  category: req.body.category,
  stock: req.body.stock,

  images,
});


      await product.save();
      res.status(201).json(product);

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);



// =====================================
//  📌 UPDATE PRODUCT
// =====================================
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),

  async (req, res) => {
    try {
      console.log("🟢 BACKEND → req.body:", req.body);

      let images = [];

      // 🖼️ Image upload (Supabase)
      if (req.file) {
        const fileName = Date.now() + "-" + req.file.originalname;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
          });

        if (!error) {
          images.push(
            `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`
          );
        }
      }

      // 🖼️ Existing images
      if (req.body.images) {
        let list = [];

        if (typeof req.body.images === "string") {
          list = req.body.images.split(",").map(x => x.trim());
        } else if (Array.isArray(req.body.images)) {
          list = req.body.images.map(x => x.trim());
        }

        images.push(...list);
      }

      if (images.length === 0) images = ["/images/fallback.png"];

      // ✅ هنا الحل الحقيقي
    const updateData = {};

// 🔤 Strings
[
  "name_en",
  "name_ar",
  "description_en",
  "description_ar",
  "topNote_en",
  "topNote_ar",
  "heartNote_en",
  "heartNote_ar",
  "baseNote_en",
  "baseNote_ar",
  "category",
].forEach((field) => {
  if (req.body[field] && req.body[field].trim() !== "") {
    updateData[field] = req.body[field];
  }
});

// 💰 Numbers
if (req.body.price !== undefined) updateData.price = req.body.price;
if (req.body.stock !== undefined) updateData.stock = req.body.stock;

// 🖼️ Images
if (images.length) updateData.images = images;

// 🚻 Gender (array)
if (req.body.gender) {
  updateData.gender = Array.isArray(req.body.gender)
    ? req.body.gender
    : [req.body.gender];
}

console.log("🟣 FINAL UPDATE DATA:", updateData);

const updated = await Product.findByIdAndUpdate(
  req.params.id,
  { $set: updateData },
  { new: true }
);


      console.log("✅ SAVED GENDER:", updated.gender);

      res.json(updated);

    } catch (err) {
      console.error("❌ UPDATE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);


// =====================================
//  📌 DELETE PRODUCT
// =====================================
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =====================================
//  📌 CHECKOUT
// =====================================
router.post("/checkout", verifyToken, async (req, res) => {
  try {
    const { form, cartItems } = req.body;

    res.status(200).json({
      message: "Checkout successful.",
      order: { form, cartItems },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
