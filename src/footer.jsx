import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useCookieConsent } from "./contexts/CookieConsentContext.jsx";

export default function Footer() {
  const { t } = useTranslation();
  const { openPreferences } = useCookieConsent();
  return (
    <footer className="bg-brandDark text-center py-10 mt-16">
      {/* اسم الموقع */}
      <div className="text-xl font-semibold mb-4">
        <span
          className="text-2xl font-serif font-semibold tracking-wide"
          style={{ color: "", letterSpacing: "1px" }}
        >
          DECÀRT
        </span>
      </div>

      {/* رقم الهاتف */}
      <div className="text-sm mb-1" style={{ color: "" }}>
        +9725666741272
      </div>

      {/* الإيميل كرابط */}
      <div className="text-sm mb-4">
        <a
          href="mailto:decartps@outlook.com"
          style={{ color: "" }}
          className="hover:underline"
        >
          decartps@outlook.com
        </a>
      </div>

      {/* الأيقونات */}
      <div className="flex justify-center space-x-4 mb-4" style={{ color: "" }}>
        <a
          href="https://www.facebook.com/profile.php?id=61580610342923&mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-xl hover:opacity-70 transition" />
        </a>
        <a
          href="https://www.instagram.com/decart.ps"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="text-xl hover:opacity-70 transition" />
        </a>
        <a
          href="https://wa.me/972566741272"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="text-xl hover:opacity-70 transition" />
        </a>
      </div>

      {/* سياسة الخصوصية وتفضيلات الكوكيز */}
      <div className="text-sm mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1" style={{ color: "" }}>
        <Link to="/privacy-policy" className="hover:underline">
          {t("privacyPolicy.title")}
        </Link>
        <button type="button" onClick={openPreferences} className="hover:underline">
          {t("cookie.managePreferences")}
        </button>
      </div>
<Link to="/terms" className="text-sm hover:underline">
  Terms of Service
</Link>

      {/* النصوص السفلية */}
      <div className="text-sm" style={{ color: "" }}>
        Powered by majd odeh
      </div>
      <div className="text-sm" style={{ color: "" }}>
        Copyright © 2025, Decart. All Rights Reserved.
      </div>
    </footer>
  );
}
