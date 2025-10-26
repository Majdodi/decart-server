// server/routes/product.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken');

// ✅ جلب جميع المنتجات
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ جلب منتج واحد بالتفاصيل
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ إضافة منتج
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  console.log('📩 طلب إضافة منتج:', req.body);
  try {
    const product = new Product(req.body);
    await product.save();
    console.log('✅ تم حفظ المنتج:', product);
    res.status(201).json(product);
  } catch (err) {
    console.error('❌ خطأ عند إضافة المنتج:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ✅ تعديل منتج
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  console.log('✏️ طلب تعديل المنتج ID:', req.params.id, 'ببيانات:', req.body);
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('✅ المنتج بعد التعديل:', updated);
    res.json(updated);
  } catch (err) {
    console.error('❌ خطأ عند تعديل المنتج:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ✅ حذف منتج
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  console.log('🗑️ طلب حذف المنتج ID:', req.params.id);
  try {
    await Product.findByIdAndDelete(req.params.id);
    console.log('✅ تم حذف المنتج');
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ خطأ عند الحذف:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Checkout
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { form, cartItems } = req.body;
    console.log('📦 بيانات الطلب المستلمة:', { form, cartItems });

    res.status(200).json({
      message: 'Checkout successful. Order details received.',
      order: { form, cartItems },
    });
  } catch (err) {
    console.error('❌ خطأ في معالجة الطلب:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
