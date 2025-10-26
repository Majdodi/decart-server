// server/scripts/seedDiscounts.js
require('dotenv').config();
const mongoose = require('mongoose');
const Discount = require('../models/Discount');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const docs = [
      {
        code: 'SAVE10',
        discountType: 'percentage',
        amount: 10,
        minOrderTotal: 0,
        startsAt: new Date(),
        expiryDate: new Date('2025-12-31T23:59:59Z'),
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
      },
      {
        code: 'FLAT20',
        discountType: 'fixed',
        amount: 20,
        minOrderTotal: 100,
        startsAt: new Date(),
        expiryDate: new Date('2025-10-31T23:59:59Z'),
        usageLimit: 50,
        usedCount: 0,
        isActive: true,
      },
    ];

    await Discount.deleteMany({});
    await Discount.insertMany(docs);
    console.log('🌱 Seeded discounts');
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
