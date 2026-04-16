import React from "react";
import { useTranslation } from "react-i18next";

export default function TermsOfService() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");
  const dir = isArabic ? "rtl" : "ltr";

  const order = ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12"];

  const bulletsAfter = {
    s5: "p2",
    s6: "p3",
    s7: "p1",
    s9: "p1",
    s10: "p1",
  };

  const formatDate = () => {
    try {
      return new Date().toLocaleDateString(isArabic ? "ar-PS" : "en-GB");
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-siteBg text-siteText pb-24">
      {/* Title */}
      <div className="text-center pt-16 md:pt-20 pb-8 md:pb-12 px-4">
        <h1
          className="text-5xl md:text-7xl font-light leading-tight"
          style={{ fontFamily: `"Times New Roman", "Georgia", serif` }}
        >
          {t("terms.title")}
        </h1>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 md:px-8">
       

        {order.map((key, idx) => {
          const title = t(`terms.sections.${key}.title`);
          const paragraphs = ["p1","p2","p3","p4","p5"].map(
            (pk) => t(`terms.sections.${key}.${pk}`, { defaultValue: "" })
          );
          const bullets = t(`terms.sections.${key}.bullets`, { returnObjects: true });
          const email = t(`terms.sections.${key}.email`, { defaultValue: "" });
          const insertAfter = bulletsAfter[key] || null;

          return (
            <section
              key={key}
              className={`pb-8 mb-8 ${idx < order.length - 1 ? "border-b border-siteBorder/40" : ""}`}
            >
              <h2
                className="text-sm font-bold uppercase tracking-widest mb-5"
                style={{ letterSpacing: "2.5px" }}
              >
                {title}
              </h2>

              {paragraphs.map((text, pi) => {
                if (!text) return null;
                const pKey = `p${pi + 1}`;
                return (
                  <React.Fragment key={pKey}>
                    <p className="leading-relaxed mb-3 text-[15px]">{text}</p>
                    {insertAfter === pKey && Array.isArray(bullets) && bullets.length > 0 && (
                      <ul className="my-3 space-y-2" style={{ paddingInlineStart: "22px" }}>
                        {bullets.map((item, bi) => (
                          <li
                            key={bi}
                            className="text-[15px] leading-relaxed list-disc"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </React.Fragment>
                );
              })}

              {Array.isArray(bullets) && bullets.length > 0 && !insertAfter && (
                <ul className="my-3 space-y-2" style={{ paddingInlineStart: "22px" }}>
                  {bullets.map((item, bi) => (
                    <li key={bi} className="text-[15px] leading-relaxed list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {email && (
                <p className="mt-4">
                  <a
                    href={`mailto:${email}`}
                    className="text-siteText underline hover:opacity-80 transition"
                  >
                    {email}
                  </a>
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
