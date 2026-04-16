// server/fixImages.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/commerce";

async function fixImages() {
  await mongoose.connect(MONGO_URI);

  const products = await Product.find();

  let fixedCount = 0;
  for (const p of products) {
    let changed = false;

    // ✅ إذا كانت الصور نص (string)
    if (typeof p.image === "string") {
      p.images = p.image.split(",").map((i) => i.trim());
      p.image = undefined;
      changed = true;
    }

    // ✅ إذا كانت الصور مصفوفة لكنها داخلها نص واحد يحتوي على فواصل
    else if (Array.isArray(p.images) && p.images.length === 1 && p.images[0].includes(",")) {
      p.images = p.images[0].split(",").map((i) => i.trim());
      changed = true;
    }

    if (changed) {
      await p.save();
      fixedCount++;
    }
  }

  process.exit(0);
}

fixImages().catch(() => process.exit(1));
