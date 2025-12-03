// src/Profile.jsx
import React from "react";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  // إذا لم يكن المستخدم مسجّلاً دخولاً
  if (!user) {
    return (
      <p className="text-center mt-12">
        {t("mustBeLoggedIn")}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 text-center">
      {/* عنوان الترحيب مع اسم المستخدم */}
      <h2 className="text-3xl font-bold mb-6">
        {t("welcome", { name: user.name })}
      </h2>

      {/* عرض الاسم الكامل والإيميل */}
      <p className="text-lg mb-2">
        <strong>{t("fullName")}:</strong> {user.name}
      </p>
      <p className="text-lg mb-6">
        <strong>{t("email")}:</strong> {user.email}
      </p>

      {/* قائمة اختيار اللغة */}
      <div className="mb-8">
        <label className="block mb-2 font-semibold">
          {t("languagePreference")}
        </label>
        <select
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="en">{t("english")}</option>
          <option value="ar">{t("arabic")}</option>
        </select>
      </div>

      {/* زر تسجيل الخروج */}
<button
  onClick={logout}
  className="px-6 py-3 bg-siteText text-siteBg rounded-lg font-semibold hover:bg-siteText/90 transition"
>
  {t("logout")}
</button>




    </div>
  );
}
