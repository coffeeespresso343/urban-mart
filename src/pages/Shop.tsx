import {
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import FilterDrawer from "../components/filters/FilterDrawer";
import { ProductGridSkeleton } from "../components/ui/Skeleton";

const PAGE_SIZE = 12;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  }, [searchParams]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch]);

  const dealsOnly = searchParams.get("filter") === "deals";
  const bestSellersOnly = searchParams.get("filter") === "best-sellers";

  const filteredProducts = useMemo(() => {
    let list = filterProducts(products, filters);

    if (dealsOnly) list = list.filter((p) => p.compareAtPrice);
    if (bestSellersOnly) list = list.filter((p) => p.bestSeller);
    return sortProducts(list, sort);
  }, [filters, sort, dealsOnly, bestSellersOnly]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timeout);
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

  const activeCategoryRef = useRef<HTMLButtonElement>(null);
  const activeCategory = filters.categories[0];
  const categorySlug = searchParams.get("category");

  useEffect(() => {
    if (!activeCategoryRef.current) return;

    activeCategoryRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory, categorySlug]);

  return (
    <div className="container-edge bg-paper py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black tracking-wide sm:text-4xl">
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
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-stone hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => updateFilter({ ...filters, categories: [] })}
            className={`label-tag shrink-0 border px-4 py-2 font-medium transition-colors rounded-2xl duration-200 active:scale-95 ${
              !activeCategory
                ? "border-orange bg-orange text-ink"
                : "border-line-light hover:border-orange"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                ref={isActive ? activeCategoryRef : null}
                key={cat.slug}
                onClick={() =>
                  updateFilter({
                    ...filters,
                    categories: [cat.name],
                  })
                }
                className={`label-tag shrink-0 border px-4 py-2 font-medium transition-colors duration-200 active:scale-95 rounded-2xl ${
                  activeCategory === cat.name
                    ? "border-orange bg-orange text-ink"
                    : "border-line-light hover:border-orange"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between border-y border-line-light py-4">
        <p className="label-tag text-stone">
          {filteredProducts.length} products
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="label-tag bg-paper/50 border border-line-light text-ink-elevated px-2 py-1 rounded-md flex items-center gap-1.5 font-medium
            active:scale-95 lg:hidden"
          >
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
          {isLoading ? (
            <ProductGridSkeleton
              count={Math.min(visibleProducts.length || PAGE_SIZE, PAGE_SIZE)}
            />
          ) : (
            <>
              <ProductGrid products={visibleProducts} />
              {visibleCount < filteredProducts.length ? (
                <div className="mt-12 flex justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    View More <ArrowDownCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : visibleCount >= filteredProducts.length &&
                visibleProducts.length > PAGE_SIZE / 2 ? (
                <div className="mt-12 flex justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.scrollTo({ top: 0 })}
                  >
                    Back to Top <ArrowUpCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilter}
        resultCount={filteredProducts.length}
      />
    </div>
  );
};

export default Shop;
