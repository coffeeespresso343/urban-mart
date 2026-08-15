import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../data/categories";
import { defaultFilters, type ProductFilters } from "../utils/filters";
import { useDebounce } from "../hooks/useDebounce";
import { products } from "../data/products";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const activeCategory = filters.categories[0];

  const debouncedSearch = useDebounce(searchInput, 250);

  const dealsOnly = searchParams.get("filter") === "deals";
  const bestSellersOnly = searchParams.get("filter") === "best-sellers";

  return (
    <div className="container-edge py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-4xl">
          Shop
        </h1>
        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-stone" />
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <input
            id="shop-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full border-b border-line-light bg-transparent py-2.5 pl-10 text-sm outline-none focus:border-ink"
          />
          {searchInput ? (
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-stone hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          <button
            className={`label-tag shrink-0 border px-4 py-2 font-medium transition-colors rounded-2xl ${
              activeCategory
                ? "border-orange bg-orange text-ink"
                : "border-line-light hover:border-orange"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`label-tag shrink-0 border px-4 py-2 font-medium transition-colors rounded-2xl ${
                activeCategory
                  ? "border-orange bg-orange text-ink"
                  : "border-line-light hover:border-orange"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p>0 products</p>
        <div>
          <button>Filter</button>
          <div>Sort select</div>
        </div>
      </div>

      <div>Sort select</div>

      <div></div>
    </div>
  );
};

export default Shop;
