import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fixImage from "./utils/fixImage";

export default function CollectionSection({ products = [] }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  if (products.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-siteBg">
      {/* Header */}
      <div className="text-center mb-16">
        <p
          className="text-xs tracking-[4px] uppercase mb-3 opacity-70"
          style={{ letterSpacing: "4px" }}
        >
          {t("collection.subtitle")}
        </p>
        <h2
          className="text-2xl md:text-4xl font-bold uppercase tracking-wide"
          style={{ letterSpacing: "2px" }}
        >
          {t("collection.title")}
        </h2>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto space-y-0">
        {products.map((product, idx) => {
          const name = isAr ? product.name_ar : product.name_en;
          const desc = isAr
            ? (product.collectionText_ar || product.description_ar)
            : (product.collectionText_en || product.description_en);
          const imageUrl = Array.isArray(product.images) && product.images.length > 0
            ? fixImage(product.images[0])
            : "/images/fallback.png";
          const isEven = idx % 2 === 0;

          return (
            <div
              key={product._id}
              className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              {/* Image */}
              <div className="md:w-1/2 w-full">
                <div className="aspect-square md:aspect-auto md:h-[600px] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text */}
              <div
                className="md:w-1/2 w-full flex flex-col justify-center px-6 md:px-14 py-10 md:py-16"
                dir={isAr ? "rtl" : "ltr"}
              >
                <span
                  className="inline-block text-[11px] tracking-[2px] uppercase border border-siteText rounded-full px-4 py-1.5 mb-5 self-start opacity-80"
                  style={{ letterSpacing: "2px" }}
                >
                  {t("collection.badge")}
                </span>

                <h3
                  className="text-xl md:text-2xl font-bold uppercase tracking-wide mb-5"
                  style={{ letterSpacing: "1.5px" }}
                >
                  {name}
                </h3>

                {desc && (
                  <p className="text-[15px] leading-relaxed mb-8 opacity-90 max-w-md">
                    {desc}
                  </p>
                )}

                <Link
                  to={`/product/${product._id}`}
                  className="inline-block self-start bg-siteText text-siteBg text-xs tracking-[2px] uppercase font-semibold px-7 py-3.5 rounded-sm hover:opacity-85 transition"
                  style={{ letterSpacing: "2px" }}
                >
                  {t("collection.explore")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
