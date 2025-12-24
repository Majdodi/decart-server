// migrateProducts.js
const path = require("path");
require("dotenv").config();


const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Connected to MongoDB"))
  .catch((err) => console.error("❌ Error:", err));

async function migrate() {
  try {
    const products = await Product.find();
    let updated = 0;

    console.log(`📦 Found ${products.length} products`);

    for (let p of products) {
      
      // إجبار إضافة الحقول ولا نضع undefined أبداً
      p.name_en        = p.name_en        || p.name        || "";
      p.name_ar        = p.name_ar        || p.name        || "";

      p.description_en = p.description_en || p.description || "";
      p.description_ar = p.description_ar || p.description || "";

      p.topNote_en     = p.topNote_en     || p.topNote     || "";
      p.topNote_ar     = p.topNote_ar     || p.topNote     || "";

      p.heartNote_en   = p.heartNote_en   || p.heartNote   || "";
      p.heartNote_ar   = p.heartNote_ar   || p.heartNote   || "";

      p.baseNote_en    = p.baseNote_en    || p.baseNote    || "";
      p.baseNote_ar    = p.baseNote_ar    || p.baseNote    || "";

      await p.save();
      updated++;
    }

    console.log(`✅ DONE — Updated all ${updated} products.`);
    process.exit(0);

  } catch (e) {
    console.error("❌ Migration Error:", e);
    process.exit(1);
  }
}

migrate();
