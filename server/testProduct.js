import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config({ path: "./.env.development" });

console.log("📡 Connecting to:", process.env.MONGO_URI);
await mongoose.connect(process.env.MONGO_URI);

console.log("📡 Connected to MongoDB");

// Fetch all products
const products = await Product.find();
console.log(`🔍 Found ${products.length} products\n`);

for (const p of products) {
  console.log("===============================");
  console.log(`🟦 المنتج: ${p.name}`);

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
    console.log("✔ images موجودة وصحيحة");
    continue;
  }

  if (!hasSingleImage) {
    console.log("❌ لا يوجد صور – لم يتم التعديل");
    continue;
  }

  console.log("🔧 تحويل الصورة المفردة إلى مصفوفة images[]");

  p.images = [cleanImage];
  p.image = undefined;

  await p.save();

  console.log("✅ تم التعديل بنجاح → images =", p.images);
}

await mongoose.disconnect();
console.log("\n🎯 تم إصلاح جميع المنتجات بالكامل!");
