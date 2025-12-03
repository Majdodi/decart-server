//server/routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/orders/Order");
const Discount = require("../models/Discount");
const Product = require("../models/Product");

router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Get Orders Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 إنشاء طلب (Checkout)
router.post("/checkout", async (req, res) => {
  try {
    const { form, cartItems, discountCode, shippingFee, userId } = req.body;

    // تجهيز عناصر الطلب
    // 🟢 تجهيز عناصر الطلب بشكل آمن ومتوافق مع React
const items = cartItems.map((item) => ({
  productId: item.productId || item._id || item.id || null,
  name: item.name || "Unknown",
  price: Number(item.price) || 0,
  quantity: Number(item.qty ?? item.quantity ?? 1),
  image: item.image ?? item.images?.[0] ?? null,
}));


    // حساب الإجمالي
    let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let totalAmount = subtotal + (shippingFee || 0);

    // تطبيق كود الخصم
if (discountCode) {
  const discount = await Discount.findOne({ code: discountCode, isActive: true });

  if (discount) {
    if (discount.expiryDate && discount.expiryDate < new Date()) {
      return res.status(400).json({ error: "انتهت صلاحية كود الخصم" });
    }

    if (discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({ error: "تم استخدام الكود الحد الأقصى" });
    }

    if (subtotal < discount.minOrderAmount) {
      return res.status(400).json({
        error: `الحد الأدنى للطلب هو ${discount.minOrderAmount}`,
      });
    }

    if (discount.type === "percentage") {
      totalAmount = totalAmount * (1 - discount.value / 100);
    } else {
      totalAmount = totalAmount - discount.value;
    }

    discount.usedCount += 1;
    await discount.save();
  }
}


    if (totalAmount < 0) totalAmount = 0;

    // 🟢 تحديث المخزون (stock) لكل منتج
    for (const item of items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({ error: `❌ المنتج ${item.name} غير موجود` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `❌ الكمية المطلوبة من ${item.name} غير متوفرة` });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

    // إنشاء الطلب
    const newOrder = new Order({
      orderNumber: `ORD-${Date.now()}`,
      customerInfo: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        country: form.country,
        postalCode: form.postcode || "",
      },
      items,
      totalAmount,
      shippingFee: shippingFee || 0,
      paymentMethod: form.paymentMethod === "cod" ? "cash_on_delivery" : form.paymentMethod,
      user: userId || null,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "✅ تم إنشاء الطلب بنجاح وتحديث المخزون",
      order: newOrder,
    });
  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ error: "خطأ أثناء إنشاء الطلب" });
  }
});

module.exports = router;
