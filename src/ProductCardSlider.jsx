// src/ProductCardSlider.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fixImage from "./utils/fixImage";

function ProductCardSlider({ images = [], name, productId }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  let startX = 0;

  const handleMouseEnter = () => {
    if (images.length > 1) setIndex(1);
  };

  const handleMouseLeave = () => {
    setIndex(0);
  };

  const onMouseDown = (e) => {
    startX = e.clientX;

    const handleMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;

      if (diff > 60) {
        prevImage();
        startX = moveEvent.clientX;
      } else if (diff < -60) {
        nextImage();
        startX = moveEvent.clientX;
      }
    };

    const stop = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stop);
  };

  const onTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX;

    if (diff > 60) {
      prevImage();
      startX = e.touches[0].clientX;
    } else if (diff < -60) {
      nextImage();
      startX = e.touches[0].clientX;
    }
  };

  const nextImage = () =>
    setIndex((i) => (images.length === 0 ? 0 : (i + 1) % images.length));
  const prevImage = () =>
    setIndex((i) =>
      images.length === 0 ? 0 : (i - 1 + images.length) % images.length
    );

  const handleClick = (e) => {
    if (Math.abs(startX - e.clientX) < 5) {
      navigate(`/product/${productId}`);
    }
  };

  const safeImages =
    images.length > 0 ? images : ["/images/fallback.png"];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-48 overflow-hidden rounded-2xl group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div
        onClick={handleClick}
        className="flex h-full transition-transform duration-500"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {safeImages.map((img, i) => {
          const finalImg = fixImage(img);
          console.log("🔻 Slider image input:", img);
  console.log("🔻 Slider final src:", finalImg);
          return (
            <img
              key={i}
              src={finalImg}
              alt={`${name}-${i}`}
              className="w-full h-full object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = "/images/fallback.png";
              }}
              loading="lazy"
            />
          );
        })}
      </div>

      {safeImages.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute top-1/2 left-3 -translate-y-1/2 
                 text-white text-3xl font-bold 
                 opacity-0 group-hover:opacity-100 
                 transition duration-300 pointer-events-auto z-20"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 
                 text-white text-3xl font-bold 
                 opacity-0 group-hover:opacity-100 
                 transition duration-300 pointer-events-auto z-20"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default ProductCardSlider;
