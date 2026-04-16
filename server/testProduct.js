import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

await mongoose.connect(process.env.MONGO_URI);

// Fetch all products
const products = await Product.find();

for (const p of products) {
  const hasImagesArray = Array.isArray(p.images) && p.images.length > 0;

  // تنظيف قيمة image لأن فيها \\ من قاعدة البيانات
  let cleanImage = null;
  if (typeof p.image === "string") {
    cleanImage = p.image.replace(/\\/g, "").trim();
  }

  const hasSingleImage =
    typeof cleanImage === "string" &&
    cleanImage.length > 0 &&
    cleanImage !== "undefined" &&
    cleanImage !== "";

  if (hasImagesArray) {
    continue;
  }

  if (!hasSingleImage) {
    continue;
  }

  p.images = [cleanImage];
  p.image = undefined;

  await p.save();
}

await mongoose.disconnect();
