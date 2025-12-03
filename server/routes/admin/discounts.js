const express = require("express");
const router = express.Router();
const Discount = require("../../models/Discount");
const { verifyToken, verifyAdmin } = require("../../middleware/verifyToken");

console.log("🔥 Discounts Router Loaded");

// Middle debug
router.use((req, res, next) => {
  console.log(`📥 Incoming → /api/admin/discounts${req.url} [${req.method}]`);
  next();
});

// -----------------------------
// CREATE NEW DISCOUNT
// -----------------------------
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  console.log("➡️ CREATE DISCOUNT HIT");
  console.log("📦 BODY RECEIVED:", req.body);

  try {
    const discount = await Discount.create(req.body);
    console.log("✅ CREATED:", discount);
    res.json({ success: true, discount });
  } catch (err) {
    console.error("❌ Error Creating:", err);
    res.status(500).json({ error: "Error creating discount" });
  }
});

// -----------------------------
// GET ALL DISCOUNTS
// -----------------------------
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  console.log("➡️ GET ALL DISCOUNTS HIT");

  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    console.error("❌ Error Getting:", err);
    res.status(500).json({ error: "Error fetching discounts" });
  }
});

// -----------------------------
// VALIDATE DISCOUNT
// -----------------------------
router.post("/validate", async (req, res) => {
  console.log("➡️ VALIDATE DISCOUNT HIT");
  console.log("📦 BODY:", req.body);

  try {
    const { code, totalAmount } = req.body;

    const discount = await Discount.findOne({ code, isActive: true });

    console.log("🔍 FOUND:", discount);

    if (!discount)
      return res.status(400).json({ error: "كود الخصم غير موجود" });

    if (discount.expiryDate && discount.expiryDate < new Date())
      return res.status(400).json({ error: "انتهت صلاحية الكود" });

    if (discount.usedCount >= discount.usageLimit)
      return res.status(400).json({ error: "وصل الحد الأقصى للاستخدام" });

    if (totalAmount < discount.minOrderAmount)
      return res.status(400).json({
        error: `يجب أن يكون الحد الأدنى ${discount.minOrderAmount} شيكل`,
      });

    console.log("✅ VALID DISCOUNT");
    return res.json({ success: true, discount });
  } catch (err) {
    console.error("❌ VALIDATION SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// UPDATE DISCOUNT
// -----------------------------
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  console.log("➡️ UPDATE DISCOUNT:", req.params.id);

  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ error: "Error updating discount" });
  }
});

// -----------------------------
// DELETE DISCOUNT
// -----------------------------
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  console.log("➡️ DELETE DISCOUNT:", req.params.id);

  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error deleting discount" });
  }
});

module.exports = router;
