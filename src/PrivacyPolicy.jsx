import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PRIVACY_CONTENT = {
  ar: {
    intro:
      "تحترم ديكارت خصوصيتك وتلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدام متجرنا الإلكتروني.",
    section1Title: "البيانات التي نجمعها",
    section1:
      "نجمع البيانات التي تقدمها عند التسجيل أو إتمام الطلب: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان، ومعلومات الدفع عند الضرورة. نستخدم أيضاً ملفات تعريف الارتباط (كوكيز) وتحليلات لتحسين تجربة التصفح وتشغيل الموقع.",
    section2Title: "كيف نستخدم بياناتك",
    section2:
      "نستخدم بياناتك لمعالجة الطلبات، التواصل معك بخصوص طلباتك، إرسال عروض أو أخبار (بموافقتك)، تحسين خدماتنا، والامتثال للالتزامات القانونية. لا نبيع بياناتك الشخصية لأطراف ثالثة.",
    section3Title: "حماية البيانات",
    section3:
      "نطبق إجراءات أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الفقدان. نقل البيانات الحساسة يتم بتشفير، ونقيد الوصول إلى البيانات الشخصية للمُصرح لهم فقط.",
    section4Title: "حقوقك",
    section4:
      "لديك الحق في الاطلاع على بياناتك وتصحيحها أو طلب حذفها، والاعتراض على معالجة معينة أو سحب موافقتك. للاستفسارات أو ممارسة حقوقك، تواصل معنا عبر البريد الإلكتروني أو نموذج الاتصال.",
    section5Title: "التحديثات",
    section5:
      "قد نحدّث سياسة الخصوصية من وقت لآخر. سننشر أي تغيير على هذه الصفحة مع تاريخ آخر تحديث. ننصحك بمراجعة هذه الصفحة دورياً.",
    lastUpdate: "آخر تحديث:",
  },
  en: {
    intro:
      "Decart respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and protect your information when you use our online store.",
    section1Title: "Data we collect",
    section1:
      "We collect data you provide when registering or completing an order: name, email, phone number, address, and payment details when necessary. We also use cookies and analytics to improve your browsing experience and operate the site.",
    section2Title: "How we use your data",
    section2:
      "We use your data to process orders, communicate with you about your orders, send offers or news (with your consent), improve our services, and comply with legal obligations. We do not sell your personal data to third parties.",
    section3Title: "Data protection",
    section3:
      "We apply appropriate security measures to protect your data from unauthorized access, modification, or loss. Sensitive data is transmitted with encryption, and access to personal data is restricted to authorized personnel only.",
    section4Title: "Your rights",
    section4:
      "You have the right to access your data, request correction or deletion, object to certain processing, or withdraw consent. For inquiries or to exercise your rights, contact us via email or the contact form.",
    section5Title: "Updates",
    section5:
      "We may update this privacy policy from time to time. We will post any changes on this page with the last updated date. We advise you to review this page periodically.",
    lastUpdate: "Last updated:",
  },
};

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const c = PRIVACY_CONTENT[lang];
  const isRtl = lang === "ar";

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-12 text-siteText"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {t("privacyPolicy.title")}
      </h1>

      <p className="mb-8 leading-relaxed">{c.intro}</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{c.section1Title}</h2>
        <p className="leading-relaxed">{c.section1}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{c.section2Title}</h2>
        <p className="leading-relaxed">{c.section2}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{c.section3Title}</h2>
        <p className="leading-relaxed">{c.section3}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{c.section4Title}</h2>
        <p className="leading-relaxed">{c.section4}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{c.section5Title}</h2>
        <p className="leading-relaxed">{c.section5}</p>
      </section>

      <div className="pt-6 border-t border-sitePrice/20">
        <Link
          to="/"
          className="text-sitePrice hover:underline font-medium"
        >
          {t("privacyPolicy.backHome")}
        </Link>
      </div>
    </div>
  );
}
