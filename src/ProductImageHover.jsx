import React, { useState, useEffect } from "react";
import fixImage from "./utils/fixImage";

export default function ProductImageHover({ images = [], name }) {
  let normalized = [];

  if (Array.isArray(images) && images.length > 0) {
    normalized = images;
  } else if (typeof images === "string") {
    normalized = images
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }

  if (!normalized || normalized.length === 0) {
    normalized = ["/images/fallback.png"];
  }

  const finalImages = normalized.map((img) => fixImage(img));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isDesktop && hovered && finalImages.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % finalImages.length);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isDesktop, hovered, currentIndex, finalImages.length]);

  return (
    <div
      className="relative w-full h-48 overflow-hidden rounded-2xl group select-none cursor-pointer"
      onMouseEnter={() => isDesktop && setHovered(true)}
      onMouseLeave={() => {
        if (isDesktop) {
          setHovered(false);
          setCurrentIndex(0);
        }
      }}
    >
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

      {finalImages.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(
                (prev) => (prev - 1 + finalImages.length) % finalImages.length
              );
            }}
            className="hidden md:block absolute top-1/2 left-3 -translate-y-1/2 text-white text-5xl font-bold 
                       bg-transparent hover:text-gray-200 transition opacity-0 group-hover:opacity-100"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % finalImages.length);
            }}
            className="hidden md:block absolute top-1/2 right-3 -translate-y-1/2 text-white text-5xl font-bold 
                       bg-transparent hover:text-gray-200 transition opacity-0 group-hover:opacity-100"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
