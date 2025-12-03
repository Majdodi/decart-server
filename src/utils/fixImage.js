export default function fixImage(img) {
  console.log("🔵 fixImage INPUT =", img);

  if (!img) {
    console.log("❌ EMPTY IMAGE → fallback");
    return "/images/fallback.png";
  }

  let fixed = String(img).trim();

  // ===========================================
  // 1) Fix https:/  → https://
  // ===========================================
  if (fixed.startsWith("https:/") && !fixed.startsWith("https://")) {
    console.log("⚠️ FIXING BROKEN HTTPS:", fixed);
    fixed = fixed.replace("https:/", "https://");
  }

  if (fixed.startsWith("http:/") && !fixed.startsWith("http://")) {
    console.log("⚠️ FIXING BROKEN HTTP:", fixed);
    fixed = fixed.replace("http:/", "http://");
  }

  // ===========================================
  // ⭐ 2) REMOVE DUPLICATE /images/images/ FIRST!
  // ===========================================
  if (fixed.includes("/images/images/")) {
    console.log("⚠️ REMOVING DUPLICATE /images/images/");
    fixed = fixed.replace(/\/images\/images\//g, "/images/");
  }

  // ===========================================
  // 3) Supabase full URL
  // ===========================================
  if (fixed.startsWith("http") && fixed.includes("supabase.co")) {
    console.log("🟢 SUPABASE URL:", fixed);
    return fixed;
  }

  // ===========================================
  // 4) Full external URL
  // ===========================================
  if (fixed.startsWith("http://") || fixed.startsWith("https://")) {
    console.log("🟢 FULL URL:", fixed);
    return fixed;
  }

  // ===========================================
  // 5) Uploads folder (/uploads/)
  // ===========================================
  if (fixed.startsWith("/uploads/")) {
    const final = "https://decart-server.onrender.com" + fixed;
    console.log("🟢 UPLOAD →", final);
    return final;
  }

  // ===========================================
  // 6) Public images folder
  // ===========================================
  if (fixed.startsWith("/images/")) {
    console.log("🟢 PUBLIC IMAGE =", fixed);
    return fixed;
  }

  // ===========================================
  // 7) Raw filename (b.jpg)
  // ===========================================
  const final = "/images/" + fixed.replace(/^\/+/, "");
  console.log("🟢 RAW FILENAME →", final);
  
  return final;
}
export function getProductImage(product) {
  if (!product) return "/images/fallback.png";

  let img = null;

  // Array of images
  if (Array.isArray(product.images) && product.images.length > 0) {
    img = product.images[0];
  }
  // Single image
  else if (product.image) {
    img = product.image;
  }
  // No image
  else {
    return "/images/fallback.png";
  }

  return fixImage(img);
}
