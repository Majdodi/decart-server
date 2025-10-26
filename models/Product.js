// server/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    stock: { type: Number, required: true, default: 0 }, // 🟢 عدد القطع المتوفرة
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
