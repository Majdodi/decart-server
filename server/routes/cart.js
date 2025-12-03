// ✅ server/routes/cart.js (FINAL VERSION)
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");




// ==========================
//   FIX IMAGE PATH FUNCTION
// ==========================
function cleanImagePath(img) {
  if (!img) return "/images/fallback.png";

  let fixed = img;

  // إزالة التكرار مثل images/images/images
  fixed = fixed.replace(/(images\/)+/g, "images/");

  // إزالة ///// الزوائد
  fixed = fixed.replace(/\/+/g, "/");

  // صور uploads
  if (fixed.startsWith("/uploads/")) {
    return fixed;
  }

  // روابط كاملة https://
  if (fixed.startsWith("http")) {
    return fixed;
  }

  // غير هيك خليها /images/xxx
  if (!fixed.startsWith("/images/")) {
    fixed = "/images/" + fixed.replace(/^\/+/, "");
  }

  return fixed;
}

// ✅ جلب السلة كاملة مع بيانات المنتجات
router.get("/:userId", async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId }).lean();

    if (!cart) {
      return res.json({ user: req.params.userId, items: [] });
    }

    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId).lean();
        if (!product) return null;
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
images: (product.images || []).map(img => cleanImagePath(img)),
          qty: item.qty,
        };
      })
    );

    res.json({ items: items.filter(Boolean) });
  } catch (err) {
    console.error("❌ CART GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/add", async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing userId or productId" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ productId, qty }],
      });
    } else {
      const item = cart.items.find(i => i.productId.toString() === productId);
      if (item) {
        item.qty += qty;
      } else {
        cart.items.push({ productId, qty });
      }
    }

    await cart.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ CART ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ تعديل الكمية
router.put("/update", async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing userId or productId" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ items: [] });

    const item = cart.items.find(i => i.productId.toString() === productId);

    if (item) {
      item.qty = qty;
      await cart.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ حذف العنصر من السلة
router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ success: true });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ REMOVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ مسح السلة بالكامل بعد checkout
router.delete("/clear/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.params.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
