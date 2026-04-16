const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // 🔥 Multi-language names
name_en: { type: String, default: "" },
name_ar: { type: String, default: "" },

description_en: { type: String, default: "" },
description_ar: { type: String, default: "" },


    // 🔥 Multi-language Notes
    topNote_en: { type: String, default: "" },
    topNote_ar: { type: String, default: "" },

    heartNote_en: { type: String, default: "" },
    heartNote_ar: { type: String, default: "" },

    baseNote_en: { type: String, default: "" },
    baseNote_ar: { type: String, default: "" },

    // السعر
    price: { type: Number, required: true },

    // الصور
    images: {
      type: [String],
      default: ["/images/fallback.png"],
    },

    // فئة المنتج
    category: { type: String },

// Gender (Men / Women / Unisex)
gender: {
  type: [String],
  enum: ["men", "women", "unisex"],
  default: [],
},



    collectionText_en: { type: String, default: "" },
    collectionText_ar: { type: String, default: "" },
    featured: { type: Boolean, default: false },

    // المخزون
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
