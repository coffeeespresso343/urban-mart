import { Loader, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories } from "../data/categories";
import {
  defaultFilters,
  filterProducts,
  type ProductFilters,
} from "../utils/filters";
import { useDebounce } from "../hooks/useDebounce";
import { products } from "../data/products";
import { useSearchParams } from "react-router-dom";
import type { ProductCategory, SortOption } from "../types/Product";
import { sortProducts } from "../utils/sortProducts";
import ProductGrid from "../components/product/ProductGrid";
import { Button } from "../components/ui/Button";
import SortSelect from "../components/filters/SortSelect";
import FilterSidebar from "../components/filters/FilterSidebar";

const PAGE_SIZE = 12;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("featured");

  const debouncedSearch = useDebounce(searchInput, 250);

  useEffect(() => {
    const search = searchParams.get("search") ?? "";
    const categorySlug = searchParams.get("category");
    const sortParam = searchParams.get("sort") as SortOption | null;
    const filterParam = searchParams.get("filter");

    setSearchInput(search);

    let nextCategories: ProductCategory[] = [];

    if (categorySlug) {
      const match = categories.find((c) => c.slug === categorySlug);
      if (match) nextCategories = [match.name];
    }

    setFilters((prev) => ({ ...prev, search, categories: nextCategories }));

    if (sortParam) setSort(sortParam);

    if (filterParam === "deals") {
      setFilters((prev) => ({ ...prev, search }));
    }
  }, []);

  const dealsOnly = searchParams.get("filter") === "deals";
  const bestSellersOnly = searchParams.get("filter") === "best-sellers";

  const filteredProducts = useMemo(() => {
    let list = filterProducts(products, filters);

    if (dealsOnly) list = list.filter((p) => p.compareAtPrice);
    if (bestSellersOnly) list = list.filter((p) => p.bestSeller);
    return sortProducts(list, sort);
  }, [filters, sort, dealsOnly, bestSellersOnly]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const updateFilter = (next: ProductFilters) => {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilter = () => {
    setFilters({ ...defaultFilters, search: filters.search });
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("category");
      next.delete("filter");
      return next;
    });
  };

  const activeCategory = filters.categories[0];
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
      <div className="flex items-center justify-between border-y border-line-light py-4">
        <p className="label-tag text-stone">
          {filteredProducts.length} products
        </p>
        <div className="flex items-center gap-4">
          <button className="label-tag flex items-center gap-1.5 font-medium lg:hidden">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </button>
          <div className="hidden lg:block">
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>
      </div>
      <div className="block py-3 lg:hidden">
        <SortSelect value={sort} onChange={setSort} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onChange={updateFilter}
            onReset={resetFilter}
          />
        </aside>

        <div>
          <ProductGrid products={visibleProducts} />
          {visibleCount < filteredProducts.length ? (
            <div className="mt-12 flex justify-center">
              <Button>
                Load More <Loader className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      filter drawer
    </div>
  );
};

export default Shop;
