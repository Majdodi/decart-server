// server/routes/product.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

// جايين من server.js
const { upload, supabase } = require("../server");


// =====================================
//  📌 UPLOAD IMAGE → SUPABASE
// =====================================
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file;
    const fileName = Date.now() + "-" + file.originalname;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) return res.status(500).json({ error });

    const publicUrl =
      process.env.SUPABASE_URL +
      "/storage/v1/object/public/products/" +
      fileName;

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

    res.json(products); // ما نعدل الصور هنا
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

    res.json(product); // نفس الشي بدون تعديل صور
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
      let images = [];

      // صورة مرفوعة → Supabase
      if (req.file) {
        const file = req.file;
        const fileName = Date.now() + "-" + file.originalname;

        const { error } = await supabase.storage
          .from("products")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
          });

        if (!error) {
          const publicUrl =
            process.env.SUPABASE_URL +
            "/storage/v1/object/public/products/" +
            fileName;

          images.push(publicUrl);
        }
      }

      // صور نصية (قديمة أو يدويّة)
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
        ...req.body,
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
      let images = [];

      if (req.file) {
        const file = req.file;
        const fileName = Date.now() + "-" + file.originalname;

        const { error } = await supabase.storage
          .from("products")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
          });

        if (!error) {
          const publicUrl =
            process.env.SUPABASE_URL +
            "/storage/v1/object/public/products/" +
            fileName;

          images.push(publicUrl);
        }
      }

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

      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, images },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
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
