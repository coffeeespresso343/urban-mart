import {
  ArrowDownCircle,
  ArrowUpCircle,
  Grid2X2,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories } from "../data/categories";
import {
  defaultFilters,
  filterProducts,
  type ProductFilters,
} from "../utils/filters";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import type { ProductCategory, SortOption, ViewMode } from "../types/Product";
import { sortProducts } from "../utils/sortProducts";
import ProductGrid from "../components/product/ProductGrid";
import { Button } from "../components/ui/Button";
import SortSelect from "../components/filters/SortSelect";
import FilterSidebar from "../components/filters/FilterSidebar";
import FilterDrawer from "../components/filters/FilterDrawer";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import { useProducts } from "../hooks/useProducts";
import HeroBanner from "../components/shop/HeroBanner";

const PAGE_SIZE = 12;

const Shop = () => {
  const { products, isLoading: productLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>("grid-3");

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
  }, [products, filters, sort, dealsOnly, bestSellersOnly]);

  useEffect(() => {}, [filters, sort, dealsOnly, bestSellersOnly]);

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
    <div className="min-h-screen bg-slate-50">
      <HeroBanner searchInput={searchInput} setSearchInput={setSearchInput} />

      <main className="container-edge max-w-7xl mx-auto py-4">
        <div className="mb-8">
          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
            <button
              onClick={() => updateFilter({ ...filters, categories: [] })}
              className={`shrink-0 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                !activeCategory
                  ? "border-ink bg-ink text-paper shadow-sm"
                  : "border-line-light bg-transparent text-ink hover:border-orange hover:text-orange"
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
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ease-in-out  active:scale-95 ${
                    isActive
                      ? "border-ink bg-ink text-paper shadow-sm"
                      : "border-line-light bg-transparent text-ink hover:border-orange hover:text-orange"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sticky bg-slate-50/20 backdrop-blur-sm self-auto z-10 top-16 flex items-center justify-between  border-y border-ink/10 py-4 lg:static lg:top-auto">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-xs font-semibold bg-ink/5 border border-ink/10 text-ink px-2 py-1.5 rounded-2xl flex items-center gap-1.5
            active:scale-95 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <p className="text-sm font-medium text-ink">
            Showing {filteredProducts.length} products
          </p>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <SortSelect value={sort} onChange={setSort} />
            </div>

            <div className="flex items-center gap-1.5 rounded-2xl border border-ink/10 bg-ink/5 hover:bg-white/10">
              <button
                title="4 Column Grid"
                onClick={() => setViewMode("grid-4")}
                className={`hidden sm:block p-1.5 rounded-2xl text-xs transition-all active:scale-95 ${
                  viewMode === "grid-4"
                    ? "bg-ink text-paper"
                    : "text-stone hover:text-current"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>

              <button
                title="3 Column Grid"
                onClick={() => setViewMode("grid-3")}
                className={`p-1.5 rounded-2xl text-xs transition-all active:scale-95 ${
                  viewMode === "grid-3"
                    ? "bg-ink text-paper"
                    : "text-stone hover:text-current"
                }`}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>

              <button
                title="List View"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-2xl text-xs transition-all active:scale-95 ${
                  viewMode === "list"
                    ? "bg-ink text-paper"
                    : "text-stone hover:text-current"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="block py-3 lg:hidden">
          <SortSelect value={sort} onChange={setSort} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block lg:sticky lg:self-start lg:top-30">
            <FilterSidebar
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilter}
            />
          </aside>

          <div>
            {productLoading ? (
              <ProductGridSkeleton
                count={Math.min(visibleProducts.length || PAGE_SIZE, PAGE_SIZE)}
              />
            ) : (
              <>
                <ProductGrid products={visibleProducts} viewMode={viewMode} />

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
      </main>

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
