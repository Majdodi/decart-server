import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  // تحميل الترجمات من الملفات
  .use(HttpApi)
  // كشف لغة المتصفح
  .use(LanguageDetector)
  // تفعيل i18next مع React
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ar"], // اللغات المدعومة
    fallbackLng: "en", // اللغة الافتراضية
    debug: false,
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage", "cookie"]
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json" // مكان ملفات الترجمة
    }
  });

export default i18n;
