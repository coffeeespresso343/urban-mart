import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "../../types/Product";
import { fetchProducts, getBestSellers } from "../../lib/products";
import { ProductCardSkeleton } from "../ui/Skeleton";

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState<Product[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const products = await fetchProducts();
      const topSellers = getBestSellers(products);

      setBestSellers(topSellers);
    };

    load();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < maxScrollLeft - 8);

    if (maxScrollLeft <= 0) {
      setActivePage(0);
      setPageCount(1);
      return;
    }

    const pageWidth = el.clientWidth * 0.8;
    const totalPages = Math.ceil(maxScrollLeft / pageWidth) + 1;

    setPageCount(totalPages);

    setActivePage(
      Math.min(totalPages - 1, Math.round(el.scrollLeft / pageWidth)),
    );
  }, []);

  useEffect(() => {
    if (bestSellers === null) return;

    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      updateScrollState();
    };

    const frame = requestAnimationFrame(update);

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [bestSellers, updateScrollState]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="container-edge mb-8 flex items-end justify-between">
        <div>
          <span className="label-tag text-orange">Fan Favorites</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Best Sellers
          </h2>
        </div>

        {bestSellers !== null ? (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous products"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-light text-ink
          transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canScrollNext}
              aria-label="Next products"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-light text-ink
          transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight />
            </button>
          </div>
        ) : null}
      </div>

      <div className="container-edge">
        {bestSellers === null ? (
          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[72vw] shrink-0 sm:w-[45vw] lg:w-[23vw]"
              >
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          >
            {bestSellers.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-[72vw] shrink-0 snap-center sm:w-[45vw] lg:w-[23vw]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* {bestSellers !== null ? (
        <div className="mt-8 flex items-center justify-center gap-2 lg:hidden">
          <button
            disabled={!canScrollPrev}
            onClick={() => scrollBy(-1)}
            className="flex h-8 w-8 rounded-full items-center justify-center bg-ink/5 text-ink/60
          transition-colors active:scale-95 hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === activePage ? "w-6 bg-ink/80" : "w-1.5 bg-line-light"
              }`}
              aria-hidden="true"
            />
          ))}
          <button
            disabled={!canScrollNext}
            onClick={() => scrollBy(1)}
            className="flex h-8 w-8 rounded-full items-center justify-center bg-ink/5 text-ink/60
          transition-colors active:scale-95 hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null} */}
    </section>
  );
};

export default BestSellers;
