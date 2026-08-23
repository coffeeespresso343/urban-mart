import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bestSellers } from "../../data/products";
import ProductCard from "../product/ProductCard";
import { useEffect, useRef, useState } from "react";

const BestSellers = () => {
  //   console.log("Best Sellers: ", bestSellers.length);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const pageCount = Math.ceil(bestSellers.length);
  //   console.log("Page Count: ", pageCount);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const cardWidth = el.scrollWidth / bestSellers.length;
    setActivePage(Math.round(el.scrollLeft / cardWidth));
  };

  useEffect(() => {
    updateScrollState();
  }, []);

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
            className="flex h-10 w-10 items-center justify-center border border-line text-ink
          transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canScrollNext}
            aria-label="Next products"
            className="flex h-10 w-10 items-center justify-center border border-line text-ink
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
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="w-[72vw] shrink-0 snap-start sm:w-[45vw] lg:w-[23vw]"
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
