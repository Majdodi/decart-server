// ✅ src/Home.jsx (Final Stable Version)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatButton from "./ChatButton";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ProductImageHover from "./ProductImageHover";
import ProductCardSlider from "./ProductCardSlider";
import api from "./api";
import { useAuth } from "./AuthContext"; 

const fmt = (v) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(v);

export default function Home() {
  const { t } = useTranslation();
  const { token } = useAuth();   // ⬅️ السطر الناقص فقط
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);

useEffect(() => {
  api.get("/admin/settings")
    .then(res => setHero(res.data.heroImage))
    .catch(console.error);
}, []);


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        console.log("📦 Products from backend:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("❌ Error fetching products:", err));
  }, []);

  return (
    <div className="bg-[]">
      {/* Hero Section */}
      <div
        className="relative h-[130vh] flex items-end justify-center text-center bg-cover bg-center bg-no-repeat"
        style={{
backgroundImage: `url(${hero || "/images/perfume.jpg"})`,

          imageRendering: "auto",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute bottom-[35vh] left-1/2 -translate-x-1/2 z-10 text-white text-center select-none">
          <p className="text-xl mb-6">{t("heroSubtitle")}</p>
          <Link to="/shop">
            <button className="border border-white text-white bg-transparent hover:bg-white/20 px-6 py-3 rounded-full text-lg font-semibold transition">
              {t("shopNow")}
            </button>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-[]">
          {t("You May Also Like")}
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 w-max">
            {products.map((product) => {
              let imgs = [];

              if (Array.isArray(product.images) && product.images.length > 0) {
                imgs = product.images.map(i => i.trim());
              }
              else if (typeof product.images === "string") {
                imgs = product.images
                  .split(",")
                  .map(i => i.trim())
                  .filter(i => i.length > 2);
              }

              if (imgs.length === 0) {
                imgs = ["/images/fallback.png"];
              }

              return (
                <div
                  key={product._id}
                  className="text-center transition-transform hover:-translate-y-2 duration-300 shrink-0 w-72"
                >
                  {/* ✅ السلايدر خارج الـ Link */}
                  <div
                    className="mb-2 overflow-hidden rounded-2xl cursor-pointer"
                    onClick={(e) => {
                      if (!e.target.closest("button")) {
                        window.location.href = `/product/${product._id}`;
                      }
                    }}
                  >
                    <ProductCardSlider
                      images={imgs}
                      name={product.name}
                      productId={product._id}
                    />
                  </div>

                  {/* الاسم والسعر */}
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-medium leading-tight text-[] hover:underline cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-[] mt-1">{fmt(product.price)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* See All */}
        <div className="mt-6 flex justify-start px-2">
          <Link
            to="/shop"
            className="inline-flex items-center text-[] hover:text-[] font-medium"
          >
            {t("seeAll")}
            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" />
            </svg>
          </Link>
        </div>
      </div>

      <ChatButton />
    </div>
  );
}
