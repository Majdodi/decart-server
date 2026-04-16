// ===========================
//  FIX SINGLE IMAGE
// ===========================
export default function fixImage(img) {
  if (!img) {
    return "/images/fallback.png";
  }

  let fixed = String(img).trim();

  // 1) Fix https:/ → https://
  if (fixed.startsWith("https:/") && !fixed.startsWith("https://")) {
    fixed = fixed.replace("https:/", "https://");
  }

  if (fixed.startsWith("http:/") && !fixed.startsWith("http://")) {
    fixed = fixed.replace("http:/", "http://");
  }

  // 2) Fix /images/images/
  if (fixed.includes("/images/images/")) {
    fixed = fixed.replace(/\/images\/images\//g, "/images/");
  }

  // 3) Supabase URLs
  if (fixed.startsWith("http") && fixed.includes("supabase.co")) {
    return fixed;
  }

  // 4) Full external URL
  if (fixed.startsWith("http://") || fixed.startsWith("https://")) {
    return fixed;
  }

  // 5) Uploads
  if (fixed.startsWith("/uploads/")) {
    const final = "https://decart-server.onrender.com" + fixed;
    return final;
  }

  // 6) Public images folder
  if (fixed.startsWith("/images/")) {
    return fixed;
  }

  // 7) Raw filename
  const final = "/images/" + fixed.replace(/^\/+/, "");

  return final;
}



// ===========================
//  GET PRODUCT IMAGE
// ===========================
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
