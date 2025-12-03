export default function fixImage(img) {
  console.log("🔵 fixImage INPUT =", img);

  if (!img) {
    console.log("❌ EMPTY IMAGE → fallback");
    return "/images/fallback.png";
  }

  // تحويل لـ string إذا مش string
  let fixed = String(img).trim();

  // ===========================================
  // 🛠️ 1) إصلاح https:/  → https://
  // ===========================================
  if (fixed.startsWith("https:/") && !fixed.startsWith("https://")) {
    console.log("⚠️ FIXING BROKEN HTTPS URL:", fixed);
    fixed = fixed.replace("https:/", "https://");
  }

  if (fixed.startsWith("http:/") && !fixed.startsWith("http://")) {
    console.log("⚠️ FIXING BROKEN HTTP URL:", fixed);
    fixed = fixed.replace("http:/", "http://");
  }

  // ===========================================
  // 🛠️ 2) إذا الرابط Supabase كامل
  // ===========================================
  if (fixed.startsWith("http") && fixed.includes("supabase.co")) {
    console.log("🟢 SUPABASE URL → OK:", fixed);
    return fixed;
  }

  // ===========================================
  // 🛠️ 3) إذا الرابط خارجي كامل
  // ===========================================
  if (fixed.startsWith("http://") || fixed.startsWith("https://")) {
    console.log("🟢 FULL URL → OK:", fixed);
    return fixed;
  }

  // ===========================================
  // 🛠️ 4) صور مرفوعة في السيرفر /uploads/
  // ===========================================
  if (fixed.startsWith("/uploads/")) {
    const final = "https://decart-server.onrender.com" + fixed;
    console.log("🟢 UPLOAD → FINAL =", final);
    return final;
  }

  // ===========================================
  // 🛠️ 5) إزالة تكرار /images/images/ ⭐ هاي المهمة
  // ===========================================
  if (fixed.includes("/images/images/")) {
    console.log("⚠️ REMOVING DUPLICATE /images/images/");
    fixed = fixed.replace(/(\/images\/)+/g, "/images/");
  }

  // ===========================================
  // 🛠️ 6) صور موجودة داخل /images/
  // ===========================================
  if (fixed.startsWith("/images/")) {
    console.log("🟢 PUBLIC FOLDER =", fixed);
    return fixed;
  }

  // ===========================================
  // 🛠️ 7) إذا فقط اسم ملف → ضيف /images/
  // ===========================================
  const final = "/images/" + fixed.replace(/^\/+/, "");
  console.log("🟢 RAW FILENAME → FIXED =", final);

  return final;
}