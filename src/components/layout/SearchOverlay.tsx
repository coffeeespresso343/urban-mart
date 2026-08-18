import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "../../hooks/uiStore";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Clock,
  Search,
  SearchX,
  TrendingUp,
  X,
} from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { defaultFilters, filterProducts } from "../../utils/filters";
import { products } from "../../data/products";
import ImageWithFallback from "../ui/ImageWithFallback";
import { formatPrice } from "../../utils/currency";

const POPULAR_SEARCHS = [
  "Backpack",
  "Desk Lamp",
  "Multi-Tools",
  "Travel",
  "Storage",
];

const MAX_RECENT = 5;

const SearchOverlay = () => {
  const searchOpen = useUIStore((s) => s.searchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);

  const [query, setQuery] = useState("");
  const [recent, setRecent] = useLocalStorage<string[]>(
    "urban-mart-recent-searches",
    [],
  );

  const debouncedQuery = useDebounce(query, 250);

  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      const timeout = setTimeout(() => inputRef.current?.focus(), 100);

      return () => {
        clearTimeout(timeout);
        document.body.style.overflow = "";
      };
    }
    // setQuery("");
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch]);

  const results = debouncedQuery.trim()
    ? filterProducts(products, {
        ...defaultFilters,
        search: debouncedQuery,
      }).slice(0, 6)
    : [];

  const commitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecent((prev) =>
      [trimmed, ...prev.filter((t) => t !== trimmed)].slice(0, MAX_RECENT),
    );
    closeSearch();
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <AnimatePresence>
      {searchOpen ? (
        <div className="fixed inset-0 z-95">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-ink/50"
          />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-paper-dim shadow-2xl sm:rounded-b-lg"
          >
            <div className="container-edge mx-auto max-w-2xl py-6 sm:py-10">
              <div className="flex items-center justify-between">
                <span className="label-tag to-stone">Search Urban Mart</span>
                <button
                  onClick={closeSearch}
                  className="text-stone hover:text-ink"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commitSearch(query);
                }}
                className="mt-4 flex items-center gap-3 border-b border-ink pb-3"
              >
                <Search
                  className="h-5 w-5 shrink-0 text-stone"
                  aria-hidden="true"
                />

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, categories..."
                  aria-label="Search products"
                  className="w-full bg-transparent font-display text-[16px] font-medium placeholder:text-stone-light"
                />
                {query.trim() && (
                  <button
                    onClick={() => setQuery("")}
                    className="h-5 w-5 text-stone mr-4 hover:text-ink"
                  >
                    <X className="h-full w-full" />
                  </button>
                )}
              </form>

              {!query.trim() ? (
                <div className="mt-8 flex flex-col gap-8">
                  {recent.length > 0 ? (
                    <div>
                      <h3 className="label-tag mb-3 flex items-center gap-2 text-orange">
                        <Clock className="h-3.5 w-3.5" /> Recent Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((term) => (
                          <button
                            key={term}
                            onClick={() => commitSearch(term)}
                            className="label-tag rounded-2xl border border-line-light px-3 py-1.5 hover:border-ink/10
                        bg-ink/5 transition-all duration-200 active:scale-95"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <h3 className="label-tag mb-3 flex items-center gap-2 text-orange">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHS.map((term) => (
                        <button
                          key={term}
                          onClick={() => commitSearch(term)}
                          className="label-tag rounded-2xl border border-line-light px-3 py-1.5 hover:border-ink/10
                        bg-ink/5 transition-all duration-200 active:scale-95"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <ul className="mt-6 flex flex-col divide-y divide-line">
                  {results.map((product) => (
                    <li
                      key={product.id}
                      className="rounded-md px-2 hover:bg-transparent transition-all duration-200 active:bg-paper active:scale-[0.98]"
                    >
                      <button
                        onClick={() => {
                          setRecent((prev) =>
                            [query, ...prev.filter((t) => t !== query)].slice(
                              0,
                              MAX_RECENT,
                            ),
                          );
                          closeSearch();
                          navigate(`/product/${product.id}`);
                        }}
                        className="flex w-full items-center gap-4 py-3 text-left"
                      >
                        <div className="h-14 w-14 rounded-md shrink-0 overflow-hidden bg-paper-dim">
                          <ImageWithFallback
                            src={product.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="label-tag text-stone">
                            {product.category}
                          </p>
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                        </div>
                        <span className="price text-sm font-semibold">
                          {formatPrice(product.price)}
                        </span>
                      </button>
                    </li>
                  ))}

                  <li className="pt-5 flex items-center justify-center">
                    <button
                      onClick={() => commitSearch(query)}
                      className="label-tag flex items-center justify-center gap-1 
                    font-semibold transition-all duration-200 text-orange active:scale-97"
                    >
                      View all results for "{query}"
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="py-16 flex flex-col items-center gap-3">
                  <SearchX className="h-7 w-7 text-error/80" />
                  <p className="mt-2 text-sm text-stone">
                    No results found for "{query}".
                  </p>
                  <p className="text-[12px] text-stone">
                    Try different search term.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default SearchOverlay;
