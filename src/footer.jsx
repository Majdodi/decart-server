import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
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
