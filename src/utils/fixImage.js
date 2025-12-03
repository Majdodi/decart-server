export default function fixImage(img) {
  console.log("🔵 fixImage INPUT =", img);

  if (!img) {
    console.log("❌ EMPTY IMAGE → fallback");
    return "/images/fallback.png";
  }

  // ===========================================
  // 🛠️ 1) إصلاح https:/  → https://
  // ===========================================
  if (img.startsWith("https:/") && !img.startsWith("https://")) {
    console.log("⚠️ FIXING BROKEN HTTPS URL:", img);
    img = img.replace("https:/", "https://");
  }

  if (img.startsWith("http:/") && !img.startsWith("http://")) {
    console.log("⚠️ FIXING BROKEN HTTP URL:", img);
    img = img.replace("http:/", "http://");
  }

  // ===========================================
  // 🛠️ 2) إذا الرابط Supabase كامل
  // ===========================================
  if (img.startsWith("http") && img.includes("supabase.co")) {
    console.log("🟢 SUPABASE URL → OK:", img);
    return img;
  }

  // ===========================================
  // 🛠️ 3) إذا الرابط خارجي كامل
  // ===========================================
  if (img.startsWith("http://") || img.startsWith("https://")) {
    console.log("🟢 FULL URL → OK:", img);
    return img;
  }

  // ===========================================
  // 🛠️ 4) صور مرفوعة في السيرفر /uploads/
  // ===========================================
  if (img.startsWith("/uploads/")) {
    const final = "https://decart-server.onrender.com" + img;
    console.log("🟢 UPLOAD → FINAL =", final);
    return final;
  }

  // ===========================================
  // 🛠️ 5) صور موجودة داخل /images/
  // ===========================================
  if (img.startsWith("/images/")) {
    console.log("🟢 PUBLIC FOLDER =", img);
    return img;
  }

  // ===========================================
  // 🛠️ 6) إذا فقط اسم ملف → ضيف /images/
  // ===========================================
  const final = "/images/" + img.replace(/^\/+/, "");
  console.log("🟢 RAW FILENAME → FIXED =", final);

  return final;
}
