// src/Shop.jsx
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "./api";
import ProductCardSlider from "./ProductCardSlider";

const fmt = (v) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(v);

export default function Shop() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  // ⭐ Scroll Drag Reference
  const scrollRef = useRef(null);

  // ⭐ Mouse Drag State
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("❌ Error loading products:", err));
  }, []);

  // ============================
  // ⭐ Mouse Drag Handlers
  // ============================
  const onMouseDown = (e) => {
    const slider = scrollRef.current;
    if (!slider) return;
    isDown.current = true;
    startX.current = e.pageX - slider.offsetLeft;
    scrollLeftStart.current = slider.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const slider = scrollRef.current;
    if (!slider) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX.current) * 2;
    slider.scrollLeft = scrollLeftStart.current - walk;
  };

  // ============================
  // ⭐ Touch Swipe Handlers
  // ============================
  const touchStart = (e) => {
    const slider = scrollRef.current;
    if (!slider) return;
    isDown.current = true;
    startX.current = e.touches[0].pageX - slider.offsetLeft;
    scrollLeftStart.current = slider.scrollLeft;
  };

  const touchMove = (e) => {
    if (!isDown.current) return;
    const slider = scrollRef.current;
    if (!slider) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX.current) * 2;
    slider.scrollLeft = scrollLeftStart.current - walk;
  };

  const touchEnd = () => {
    isDown.current = false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-siteText">
        {t("shopOurProducts")}
      </h1>

      <div
        ref={scrollRef}
        className="
          grid grid-cols-2 
          gap-8 
          md:grid-cols-4 
          overflow-visible 
          pb-5
        "
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
        {products.map((product) => {
          console.log("🟦 PRODUCT RAW DATA:", product);
console.log("🟧 RAW IMAGES FIELD:", product.images);

          let images = [];

          if (Array.isArray(product.images) && product.images.length > 0) {
            images = product.images;
          } else if (typeof product.images === "string") {
            images = product.images.split(",").map((i) => i.trim());
          }

          if (images.length === 0) images = ["/images/fallback.png"];

          return (
            <div
              key={product._id}
              className="text-center transition-transform hover:-translate-y-2 duration-300"
            >
              <div className="mb-2 overflow-hidden rounded-2xl pointer-events-auto">
                
                <ProductCardSlider
                
                  images={images}
                  name={product.name}
                  productId={product._id}
                />
              </div>

              <Link to={`/product/${product._id}`}>
                <h3 className="mt-2 text-lg font-medium text-siteText">
                  {product.name}
                </h3>
                <p className="text-sitePrice">{fmt(product.price)}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
