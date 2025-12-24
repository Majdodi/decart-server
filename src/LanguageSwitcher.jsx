import { useState } from "react";
import i18n from "./i18n";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  return (
<div className="relative">
      {/* زر اللغة */}
   <button
  onClick={() => setOpen(!open)}
  className="flex items-center gap-1 text-sm font-medium text-[#594539] hover:opacity-80"
>
  {i18n.language === "ar" ? "AR" : "EN"}
  <span className="text-xs">▾</span>
</button>


      {/* القائمة المنسدلة */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border z-50">
  <button
    onClick={() => { i18n.changeLanguage("ar"); setOpen(false); }}
    className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-100"
  >
    العربية
  </button>

  <button
    onClick={() => { i18n.changeLanguage("en"); setOpen(false); }}
    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
  >
    English
  </button>
</div>

      )}
    </div>
  );
}
