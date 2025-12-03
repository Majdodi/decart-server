// fixAdminImage.js
import { API_BASE_URL } from "../api";

const BACKEND = API_BASE_URL.replace("/api", "");

export default function fixAdminImage(img) {
  if (!img) return "/images/fallback.png";

  img = String(img).trim();
  img = img.replace(/\/+/g, "/"); // تنظيف //////

  // 1️⃣ لو رابط كامل (http / https) → رجعه كما هو
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  // 2️⃣ صور ملفات مرفوعة من Multer
  if (img.startsWith("/uploads/")) {
    return BACKEND + img;
  }

  // 3️⃣ صور uploads بدون / بالبداية
  if (img.startsWith("uploads/")) {
    return BACKEND + "/" + img;
  }

  // 4️⃣ صور المجلد المحلي /images
  if (img.startsWith("/images/")) {
    return img;
  }

  // 5️⃣ اسم صورة بدون /images/
  return "/images/" + img.replace(/^\/+/, "");
}
