const express = require("express");
const router = express.Router();
const Order = require("../models/orders/Order");
const Discount = require("../models/Discount");
const Product = require("../models/Product");

// 🟢 إنشاء طلب (Checkout)
router.post("/checkout", async (req, res) => {
  try {
    const { form, cartItems, discountCode, shippingFee, userId } = req.body;

    // تجهيز عناصر الطلب
    const items = cartItems.map((item) => ({
      productId: item._id || item.id || null,
      name: item.name,
      price: parseFloat(item.price.toString().replace("$", "")),
      quantity: item.qty,
      image: item.image || null,
    }));

    // حساب الإجمالي
    let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let totalAmount = subtotal + (shippingFee || 0);

    // تطبيق كود الخصم
    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode });
      if (discount) {
        if (discount.type === "percentage") {
          totalAmount = totalAmount * (1 - discount.value / 100);
        } else if (discount.type === "fixed") {
          totalAmount = totalAmount - discount.value;
        }
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
