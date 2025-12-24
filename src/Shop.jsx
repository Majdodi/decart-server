// src/Shop.jsx
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "./api";
import ProductCardSlider from "./ProductCardSlider";
import FilterDrawer from "./FilterDrawer";

const fmt = (v) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(v);

export default function Shop() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

const [filterOpen, setFilterOpen] = useState(false);

const [filters, setFilters] = useState({
  inStock: false,
  gender: "all",
  minPrice: "",
  maxPrice: "",
  sort: "az",
});

const sortOptions = {
  az: "Alphabetically, A-Z",
  za: "Alphabetically, Z-A",
  priceLow: "Price, low to high",
  priceHigh: "Price, high to low",
  dateOld: "Date, old to new",
  dateNew: "Date, new to old",
};


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
const filteredProducts = [...products]
  .filter((p) => {
    // Gender
    if (
  filters.gender !== "all" &&
  !p.gender?.includes(filters.gender)
) {
  return false;
}


    // Stock
    if (filters.inStock && p.stock <= 0) {
      return false;
    }

    // Price
    if (filters.minPrice && p.price < Number(filters.minPrice)) {
      return false;
    }

    if (filters.maxPrice && p.price > Number(filters.maxPrice)) {
      return false;
    }

    return true;
  })
  .sort((a, b) => {
    switch (filters.sort) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "priceLow":
        return a.price - b.price;
      case "priceHigh":
        return b.price - a.price;
      case "dateOld":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "dateNew":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const clearAll = () => {
  setFilters({
    inStock: false,
    minPrice: "",
    maxPrice: "",
    gender: "All",
    sort: "Alphabetically, A-Z",
  });
  setOpenDropdown(null);
};


const maxPrice = React.useMemo(() => {
  if (!products.length) return 0;
  return Math.max(...products.map(p => p.price));
}, [products]);

const [openDropdown, setOpenDropdown] = useState(null);
// availability | price | gender | sort | null
const hasActiveFilters =
  filters.inStock ||
  filters.minPrice !== "" ||
  filters.maxPrice !== "" ||
  filters.gender !== "all" ||
  filters.sort !== "az";




  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-siteText">
        {t("shopOurProducts")}
      </h1>

{/* ================= TOP CONTROLS (DESKTOP) ================= */}
<div className="hidden md:flex items-center justify-between mb-6 relative">

  {/* ================= LEFT SIDE ================= */}
  <div className="flex items-center gap-6 relative">

    {/* Availability */}
<div className="relative min-w-[20px]">
 <button
  onClick={() =>
    setOpenDropdown(openDropdown === "availability" ? null : "availability")
  }
  className="flex items-center gap-1 whitespace-nowrap"
>
  Availability
  {filters.inStock && (
    <span className="ml-1 text-sm opacity-80">In stock</span>
  )}
  <span className="text-xs">
    {openDropdown === "availability" ? "▴" : "▾"}
  </span>
</button>



      {openDropdown === "availability" && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow rounded p-3 z-50 w-44">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={e =>
                setFilters({ ...filters, inStock: e.target.checked })
              }
            />
            In stock
          </label>
        </div>
      )}
    </div>

    {/* Price */}
<div className="relative min-w-[20px]">
   <button
  onClick={() =>
    setOpenDropdown(openDropdown === "price" ? null : "price")
  }
  className="flex items-center gap-1 whitespace-nowrap"
>
  Price
  {(filters.minPrice || filters.maxPrice) && (
    <span className="ml-1 text-sm opacity-80">
      ₪{filters.minPrice || 0}–₪{filters.maxPrice || maxPrice}
    </span>
  )}
  <span className="text-xs">
    {openDropdown === "price" ? "▴" : "▾"}
  </span>
</button>



      {openDropdown === "price" && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow rounded p-4 w-72 z-50">
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={e =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="border p-2 w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || maxPrice}
              onChange={e =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>

          <p className="text-xs text-gray-500">
            The highest price is ₪{maxPrice}
          </p>
        </div>
      )}
    </div>

    {/* Gender */}
<div className="relative min-w-[20px]">
      <button
  onClick={() =>
    setOpenDropdown(openDropdown === "gender" ? null : "gender")
  }
  className="flex items-center gap-1 whitespace-nowrap"
>
  Gender
  {filters.gender !== "all" && (
    <span className="text-sm text-gray-600 capitalize">
      · {filters.gender}
    </span>
  )}
  <span className="text-xs">
    {openDropdown === "gender" ? "▴" : "▾"}
  </span>
</button>


      {openDropdown === "gender" && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow rounded p-3 z-50 w-40">
          {[
            { key: "all", label: "All" },
            { key: "men", label: "Men" },
            { key: "women", label: "Women" },
            { key: "unisex", label: "Unisex" },
          ].map(g => (
            <label key={g.key} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g.key}
                onChange={() =>
                  setFilters({ ...filters, gender: g.key })
                }
              />
              {g.label}
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Clear all (يظهر فقط عند التغيير) */}
      {hasActiveFilters && (
  <button
    onClick={() =>
      setFilters({
        inStock: false,
        minPrice: "",
        maxPrice: "",
        gender: "all",
        sort: "az",
      })
    }
    className="text-sm underline"
  >
    Clear all
  </button>
)}

  </div>


  {/* ================= RIGHT SIDE (SORT) ================= */}
  <div className="relative">
    <button
      onClick={() =>
        setOpenDropdown(openDropdown === "sort" ? null : "sort")
      }
      className="flex items-center gap-1"
    >
      Sort
      <span className="text-xs">
        {openDropdown === "sort" ? "▴" : "▾"}
      </span>
    </button>

    {openDropdown === "sort" && (
      <div className="absolute top-full right-0 mt-2 bg-white shadow rounded min-w-[260px] z-50">
        {[
          { key: "az", label: "Alphabetically, A-Z" },
          { key: "za", label: "Alphabetically, Z-A" },
          { key: "priceLow", label: "Price, low to high" },
          { key: "priceHigh", label: "Price, high to low" },
          { key: "dateNew", label: "Date, new to old" },
          { key: "dateOld", label: "Date, old to new" },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => {
              setFilters({ ...filters, sort: opt.key });
              setOpenDropdown(null);
            }}
            className="flex justify-between w-full px-4 py-2 hover:bg-gray-100"
          >
            <span>{opt.label}</span>
            {filters.sort === opt.key && "✔"}
          </button>
        ))}
      </div>
    )}
  </div>
</div>


{/* ================= MOBILE FILTER BUTTON ================= */}
<div className="md:hidden flex justify-start mb-6">
  <button
    onClick={() => setFilterOpen(true)}
    className="flex items-center gap-2 border px-4 py-2 rounded-md"
  >
    <svg width="18" height="18" fill="none" stroke="currentColor">
      <path d="M3 5h12M5 9h8M7 13h4" />
    </svg>
    Filter
  </button>
</div>

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
        {filteredProducts.map((product) => {

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
      <FilterDrawer
  open={filterOpen}
  onClose={() => setFilterOpen(false)}
  filters={filters}
  setFilters={setFilters}
  onApply={() => setFilterOpen(false)}
/>

    </div>
  );
}
