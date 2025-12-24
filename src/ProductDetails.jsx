// src/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useTranslation } from "react-i18next";
import api from "./api";
import { FiTrash } from "react-icons/fi";
import ChatButton from "./ChatButton";
import ProductCardSlider from "./ProductCardSlider";
import fixImage from "./utils/fixImage";

const fmt = (v) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(v);

export default function ProductDetails() {
  console.log("🔥 ProductDetails → FILE LOADED FROM:", import.meta.url);

const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQty, cartItems } = useCart();

  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // للسحب/التمرير في السلايدر
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const finishDrag = () => {
    if (!isDragging) return;

    const images = product?.images || [];
    if (dragOffset > 80 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (dragOffset < -80 && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  const finishWheelSwipe = () => {
    const images = product?.images || [];
    if (dragOffset > 80 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (dragOffset < -80 && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    setDragOffset(0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQty(1);

    api
      .get(`/products/${id}`)
      .then((res) => {
        console.log("📥 Product API response =", res.data);
        const data = res.data;

        let imagesArray = [];

        if (Array.isArray(data.images) && data.images.length > 0) {
          imagesArray = data.images;
        } else if (typeof data.images === "string") {
          imagesArray = data.images.split(",").map((i) => i.trim());
        }

        if (imagesArray.length === 0) {
          imagesArray = ["/images/fallback.png"];
        }

        setProduct({ ...data, images: imagesArray });
        console.log("🟩 Stored product data =", {
          ...data,
          images: imagesArray,
        });
      })
      .catch((err) => {
        console.error("❌ Error loading product:", err);
        setProduct(null);
      });

    api
      .get("/products")
      .then((res) =>
        setRelated(res.data.filter((p) => String(p._id) !== String(id)))
      )
      .catch(() => setRelated([]));
  }, [id]);

  if (!product) {
    return (
      <div className="text-center mt-20 text-xl text-[]">
        {t("productNotFound")}
      </div>
    );
  }

  const images = product.images || [];
  console.log("🟦 ProductDetails → IMAGES ARRAY =", images);
  console.log("🟦 LENGTH =", images.length);

  const inCart = cartItems.find((p) => p._id === product._id);

  const increaseProductQty = () => {
    if (inCart) updateQty(product._id, inCart.qty + 1);
    else setQty((q) => q + 1);
  };

  const decreaseProductQty = () => {
    if (inCart) {
      if (inCart.qty > 1) updateQty(product._id, inCart.qty - 1);
    } else if (qty > 1) {
      setQty((q) => q - 1);
    }
  };

  const addItem = () => {
    addToCart(product, qty);
    setQty(1);
  };

  const removeItem = () => {
    if (inCart && inCart.qty > 0) {
      updateQty(product._id, inCart.qty - 1);
    }
  };

  const directBuy = () => {
    addToCart(product, qty);
    navigate("/checkout");
  };

  console.log(
    "🟥 Slider transform =",
    `-${currentIndex * 100}% | images = ${images.length}`
  );

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* TOP SECTION */}
      <div className="bg-[] py-8 px-6 pb-20">
        <div className="max-w-4xl mx-auto rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row md:items-stretch bg-[]">
          {/* IMAGE SLIDER */}
          <div className="relative w-full md:w-1/2 h-[500px] overflow-hidden bg-gradient-to-br from-[] to-[]">
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setDragOffset(0);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === idx ? "bg-[]" : "bg-gray-400/70"
                  }`}
                />
              ))}
            </div>

            {/* Slider */}
            <div
              className="w-full h-full relative overflow-hidden"
              onWheel={(e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
                e.preventDefault();
                setDragOffset((prev) => prev - e.deltaX);
                clearTimeout(window._wheelTimer);
                window._wheelTimer = setTimeout(() => finishWheelSwipe(), 60);
              }}
              onTouchStart={(e) => {
                setStartX(e.touches[0].clientX);
                setIsDragging(true);
              }}
              onTouchMove={(e) => {
                if (!isDragging) return;
                const diff = e.touches[0].clientX - startX;
                setDragOffset(diff);
              }}
              onTouchEnd={finishDrag}
              onMouseDown={(e) => {
                setStartX(e.clientX);
                setIsDragging(true);
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                const diff = e.clientX - startX;
                setDragOffset(diff);
              }}
              onMouseUp={finishDrag}
              onMouseLeave={() => isDragging && finishDrag()}
            >
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
                }}
              >
                {images.map((img, idx) => {
                  const finalImg = fixImage(img);
                  return (
                    <div
                      key={idx}
                      className="w-full h-full flex-shrink-0 overflow-hidden"
                    >
<img
  src={finalImg}
  alt={`Product ${idx + 1}`}
  className="w-full h-full object-cover"
  style={{
    imageRendering: "auto",
    transform: "scale(1.15)",
    transformOrigin: "center center",
  }}
  loading="eager"
  decoding="sync"
  onError={(e) => {
    e.target.src = "/images/fallback.png";
  }}
/>



                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setCurrentIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    );
                    setDragOffset(0);
                  }}
                  className="hidden md:block absolute top-1/2 left-3 -translate-y-1/2 text-[] text-5xl z-10"
                >
                  ‹
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => (prev + 1) % images.length);
                    setDragOffset(0);
                  }}
                  className="hidden md:block absolute top-1/2 right-3 -translate-y-1/2 text-[] text-5xl z-10"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* TEXT / INFO */}
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-[]">
{i18n.language === "ar" ? product.name_ar : product.name_en}
              </h2>

              <p className="text-[] mb-4 whitespace-pre-line">
{i18n.language === "ar" ? product.description_ar : product.description_en}
              </p>

              <p className="text-xl font-semibold mb-6 text-[]">
                {fmt(product.price)}
              </p>

              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={decreaseProductQty}
                  className="text-xl px-3 text-[]"
                >
                  −
                </button>

                <span className="text-lg text-[]">
                  {inCart ? inCart.qty : qty}
                </span>

                <button
                  onClick={increaseProductQty}
                  className="text-xl px-3 text-[]"
                >
                  +
                </button>

                <button
                  onClick={removeItem}
                  className="text-xl text-[] hover:text-[]"
                >
                  <FiTrash size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
              <button onClick={directBuy} className="btn-brown-full">
  {t("buyNow")}
</button>


                <button onClick={addItem} className="btn-brown-full">
  {t("addToCart")}
</button>

              </div>
            </div>

            <ChatButton />
          </div>
        </div>
      </div>

      {/* NOTES SECTION */}
      <div className="bg-white border-t border-b border-[]">
        <div
          className="
            w-full mx-auto py-8 px-4 md:px-8
            grid grid-cols-1 md:grid-cols-3 text-center gap-8 md:gap-12 items-start
          "
        >
          <div className="px-2">
            <h3 className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[] mb-2">
              TOP NOTE
            </h3>
            <p
              className="text-[] text-sm md:text-base break-words whitespace-normal w-full"
              style={{
                lineHeight: "1.6",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
{i18n.language === "ar" ? product.topNote_ar : product.topNote_en}

            </p>
          </div>

          <div className="px-2">
            <h3 className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[] mb-2">
              HEART NOTE
            </h3>
            <p
              className="text-[] text-sm md:text-base break-words whitespace-normal w-full"
              style={{
                lineHeight: "1.6",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
{i18n.language === "ar" ? product.heartNote_ar : product.heartNote_en}
 </p>
          </div>

          <div className="px-2">
            <h3 className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[] mb-2">
              BASE NOTE
            </h3>
            <p
              className="text-[] text-sm md:text-base break-words whitespace-normal w-full"
              style={{
                lineHeight: "1.6",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              
{i18n.language === "ar" ? product.baseNote_ar : product.baseNote_en}

            </p>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="px-4 py-12 bg-[] -mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-[]">
            {t("You May Also Like")}
          </h2>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 w-max">
              {related.map((prod) => {
                let imgs = [];
                if (Array.isArray(prod.images) && prod.images.length > 0) {
                  imgs = prod.images;
                } else if (typeof prod.images === "string") {
                  imgs = prod.images.split(",").map((i) => i.trim());
                }
                if (imgs.length === 0) imgs = ["/images/fallback.png"];

                return (
                  <div
                    key={prod._id}
                    className="shrink-0 w-72 text-center hover:-translate-y-2 transition-transform"
                  >
                    <div
                      className="mb-2 overflow-hidden rounded-2xl cursor-pointer"
                      onClick={(e) => {
                        if (!e.target.closest("button")) {
                          window.location.href = `/product/${prod._id}`;
                        }
                      }}
                    >
                      <ProductCardSlider
                        images={imgs}
                        name={prod.name}
                        productId={prod._id}
                      />
                    </div>

                    <Link to={`/product/${prod._id}`}>
                      <h3 className="text-lg font-medium leading-tight hover:underline cursor-pointer text-[] mt-2">
{i18n.language === "ar" ? prod.name_ar : prod.name_en}
                      </h3>
                    </Link>

                    <p className="text-[] mt-1">
                      {fmt(prod.price)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

