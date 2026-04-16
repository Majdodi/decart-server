const express = require("express");
const router = express.Router();
const Discount = require("../../models/Discount");
const { verifyToken, verifyAdmin } = require("../../middleware/verifyToken");

// -----------------------------
// CREATE NEW DISCOUNT
// -----------------------------
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.json({ success: true, discount });
  } catch (err) {
    res.status(500).json({ error: "Error creating discount" });
  }
});

// -----------------------------
// GET ALL DISCOUNTS
// -----------------------------
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching discounts" });
  }
});

// -----------------------------
// VALIDATE DISCOUNT
// -----------------------------
router.post("/validate", async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const discount = await Discount.findOne({ code, isActive: true });

    if (!discount)
      return res.status(400).json({ error: "This discount code does not exist." });

    if (discount.expiryDate && discount.expiryDate < new Date())
      return res.status(400).json({ error: "This discount code has expired." });

    if (discount.usedCount >= discount.usageLimit)
      return res.status(400).json({ error: "This discount code has reached its usage limit." });

    if (totalAmount < discount.minOrderAmount)
      return res.status(400).json({
        error: `Minimum order amount is ${discount.minOrderAmount} ILS.`,
      });

    return res.json({ success: true, discount });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// UPDATE DISCOUNT
// -----------------------------
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
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
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error deleting discount" });
  }
});

module.exports = router;
