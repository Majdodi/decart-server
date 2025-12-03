//server/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },

    // ⭐ الصور (جاهزة – فقط تأكيد)
    images: {
      type: [String],
      default: ["/images/fallback.png"], // ⭐ fallback ضروري للمنتجات بدون صور
    },

    // ⭐ Notes fields
    topNote: { type: String, default: "" },
    heartNote: { type: String, default: "" },
    baseNote: { type: String, default: "" },

    category: { type: String },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

