//src/ProductImageHover.jsx
import React, { useState, useEffect } from "react";

export default function ProductImageHover({ images = [], name }) {
  // ⭐ Step 1: Normalize Images (Make sure images is ALWAYS an array)
  let normalized = [];

  // Case 1: images is an array
  if (Array.isArray(images) && images.length > 0) {
    normalized = images;
  }

  // Case 2: images is a single string separated by commas
  else if (typeof images === "string") {
    normalized = images
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }

  // Fallback if no images at all
  if (!normalized || normalized.length === 0) {
    normalized = ["/images/fallback.png"];
  }

  // ⭐ Step 2: Clean paths and normalize URLs
  const finalImages = normalized.map((img) => {
    if (!img) return "/images/fallback.png";

    img = img.replace(/\\|"/g, "").trim();

    // if it's a full URL:
    if (img.startsWith("http")) return img;

    // if already correct
    if (img.startsWith("/images/")) return img;

    // if begins with slash but missing folder
    if (img.startsWith("/")) return "/images" + img;

    // if plain file name
    return "/images/" + img;
  });

  // ⭐ Step 3: Hover Slider Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered && finalImages.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % finalImages.length);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [hovered, finalImages.length]);

  return (
    <div
      className="relative w-full h-48 overflow-hidden rounded-2xl group select-none cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Images Container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {finalImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${name}-${idx}`}
            className="w-full h-full object-cover flex-shrink-0"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/images/fallback.png";
            }}
          />
        ))}
      </div>

      {/* Slider Arrows */}
      {finalImages.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(
                (prev) => (prev - 1 + finalImages.length) % finalImages.length
              );
            }}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[] text-5xl font-bold 
                       bg-transparent hover:text-[] transition opacity-0 group-hover:opacity-100"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % finalImages.length);
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[] text-5xl font-bold 
                       bg-transparent hover:text-[] transition opacity-0 group-hover:opacity-100"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
