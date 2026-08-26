import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bestSellers } from "../../data/products";
import ProductCard from "../product/ProductCard";
import { useCallback, useEffect, useRef, useState } from "react";

const BestSellers = () => {
  // console.log("Best Sellers: ", bestSellers.length);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  //   console.log("Page Count: ", pageCount);

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
    const totalPages = Math.ceil(maxScrollLeft / pageWidth + 1);

    const currentPage = Math.min(
      totalPages - 1,
      Math.round(el.scrollLeft / pageWidth),
    );

    setPageCount(totalPages);
    setActivePage(currentPage);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
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
      </div>

      <div className="container-edge">
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
      </div>

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
    </section>
  );
};

export default BestSellers;
