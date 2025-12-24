export default function FilterDrawer({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  maxPrice,
}) {
  if (!open) return null;

  const isDirty =
    filters.inStock ||
    filters.gender !== "all" ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sort !== "az";

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="fixed bottom-0 left-0 right-0 bg-[#F6E6D1] rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-siteText">Filter</h2>
          <button onClick={onClose} className="text-2xl text-siteText">×</button>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-siteText">Availability</h3>
          <label className="flex items-center gap-2 text-siteText">
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

        {/* Gender */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-siteText">Gender</h3>
          {["all", "men", "women", "unisex"].map(g => (
            <label key={g} className="flex items-center gap-2 mb-1 text-siteText">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g}
                onChange={() =>
                  setFilters({ ...filters, gender: g })
                }
              />
              {g === "all" && "All"}
              {g === "men" && "Men"}
              {g === "women" && "Women"}
              {g === "unisex" && "Unisex"}
            </label>
          ))}
        </div>

        {/* Price */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-siteText">Price</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={e =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="border rounded p-2 w-full bg-[#FBF3EA]"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || maxPrice}
              onChange={e =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="border rounded p-2 w-full bg-[#FBF3EA]"
            />
          </div>
          <p className="text-xs text-siteText opacity-70">
            The highest price is ₪{maxPrice}
          </p>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-siteText">Sort</h3>
          {[
            { k: "az", l: "Alphabetically, A-Z" },
            { k: "za", l: "Alphabetically, Z-A" },
            { k: "plh", l: "Price, low to high" },
            { k: "phl", l: "Price, high to low" },
            { k: "new", l: "Date, new to old" },
            { k: "old", l: "Date, old to new" },
          ].map(s => (
            <label key={s.k} className="flex items-center gap-2 mb-1 text-siteText">
              <input
                type="radio"
                name="sort"
                checked={filters.sort === s.k}
                onChange={() =>
                  setFilters({ ...filters, sort: s.k })
                }
              />
              {s.l}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          {isDirty && (
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
              className="w-1/2 bg-[#E5D5C3] text-siteText py-3 rounded-full"
            >
              Clear all
            </button>
          )}

          <button
            onClick={onApply}
            className="flex-1 bg-[#594539] text-white py-3 rounded-full"
          >
            See results
          </button>
        </div>
      </div>
    </div>
  );
}
