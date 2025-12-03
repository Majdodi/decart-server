// server/fixImages.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/commerce";

async function fixImages() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const products = await Product.find();

  let fixedCount = 0;
  for (const p of products) {
    let changed = false;

    // ✅ إذا كانت الصور نص (string)
    if (typeof p.image === "string") {
      p.images = p.image.split(",").map((i) => i.trim());
      p.image = undefined;
      changed = true;
      console.log(`🧩 Fixed string image in: ${p.name} →`, p.images);
    }

    // ✅ إذا كانت الصور مصفوفة لكنها داخلها نص واحد يحتوي على فواصل
    else if (Array.isArray(p.images) && p.images.length === 1 && p.images[0].includes(",")) {
      p.images = p.images[0].split(",").map((i) => i.trim());
      changed = true;
      console.log(`🧩 Fixed comma-separated array in: ${p.name} →`, p.images);
    }

    if (changed) {
      await p.save();
      fixedCount++;
    }
  }

  console.log(`🎯 Fixed ${fixedCount} products in total.`);
  process.exit(0);
}

fixImages().catch((err) => console.error("❌ Error:", err));
