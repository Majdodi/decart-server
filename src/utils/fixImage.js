// ==========================================================
//  ✅ GLOBAL IMAGE FIXER – UNIVERSAL (LOCAL + CPANEL + SUPABASE)
// ==========================================================
import { API_BASE_URL } from "../api";

const BACKEND_ORIGIN = API_BASE_URL.replace("/api", "");
const IS_LOCAL = window.location.hostname === "localhost";

/**
 * 🌍 دالة لمعالجة جميع أنواع الصور بشكل موحّد
 */
export default function fixImage(imgData, index = 0) {
  
  // 1️⃣ Empty / invalid
  if (!imgData) return "/images/fallback.png";

  let img = "";

  // 2️⃣ Array
  if (Array.isArray(imgData)) {
    img = imgData[index] || imgData[0] || "/images/fallback.png";
  }

  // 3️⃣ Object (product)
  else if (typeof imgData === "object") {
    img = imgData.images || imgData.image || imgData.src || "";
    if (Array.isArray(img)) img = img[index] || img[0] || "";
  }

  // 4️⃣ String
  else if (typeof imgData === "string") {
    img = imgData;
  }

  // STILL EMPTY?
  if (!img) return "/images/fallback.png";

  img = String(img).trim();

  // =========================================
  //      🔵 1) SUPABASE FULL URL
  // =========================================
  if (img.startsWith("https://") && img.includes("supabase.co")) {
    return img;
  }

  // =========================================
  //      🔵 2) FULL HTTP URL
  // =========================================
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  // =========================================
  //      🔵 3) LOCAL UPLOADS (LOCALHOST ONLY)
  // =========================================
  if (img.startsWith("/uploads/")) {
    return IS_LOCAL ? BACKEND_ORIGIN + img : "/images/fallback.png";
  }

  // =========================================
  //      🔵 4) PUBLIC /images/ (CPANEL)
  // =========================================
  if (img.startsWith("/images/")) {
    return img;
  }

  // =========================================
  //      🔵 5) RAW FILENAMES
  // =========================================
  return "/images/" + img.replace(/^\/+/, "");
}


// ==========================================================
//  🔧 getProductImage – USED IN CART, CHECKOUT, PRODUCT LIST
// ==========================================================
export function getProductImage(product) {
  if (!product) return "/images/fallback.png";

  const img = product.images || product.image || "/images/fallback.png";

  return fixImage(img, 0);
}


// ==========================================================
//  🎯 IMAGE VALIDATOR
// ==========================================================
export async function isValidImage(imgUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imgUrl;
  });
}
