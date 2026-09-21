import { AnimatePresence, motion } from "framer-motion";
import type { HeroSlide } from "../../types/HeroSlide";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

interface ProductSpotlightProps {
  slide: HeroSlide;
}
const ProductSpotlight = ({ slide }: ProductSpotlightProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${slide.id}-card`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute bottom-4 left-4 right-4 max-w-xs rounded-2xl border border-white/10 bg-black/20 p-4 text-white shadow-xl backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-auto"
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: slide.accentColor }}
          >
            {slide.product.badge}
          </span>
          <span className="text-sm font-extrabold">${slide.product.price}</span>
        </div>
        <h3 className="mt-2 text-base font-bold">{slide.product.name}</h3>
        <div className="mt-2 flex flex-wrap gap-1">
          {slide.product.details.slice(0, 3).map((feat, index) => (
            <span
              key={index}
              className="text-[10px] bg-white/10 text-stone-200 px-2 py-0.5 rounded-full"
            >
              {feat}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface HeroImageProps {
  slide: HeroSlide;
  onPrevious: () => void;
  onNext: () => void;
  isAutoplay: boolean;
  onToggleAutoplay: () => void;
  currentIndex: number;
  totalSlides: number;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

const HeroImage = ({
  slide,
  onPrevious,
  onNext,
  isAutoplay,
  onToggleAutoplay,
  currentIndex,
  totalSlides,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: HeroImageProps) => {
  return (
    <div className="lg:col-span-6 order-1">
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="group relative aspect-4/3 overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-500 sm:aspect-16/11 lg:aspect-4/3"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease }}
            className="absolute inset-0 h-full w-full"
          >
            <img
              src={slide.image}
              alt={slide.product.name}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/20 to-transparent" />

        {/* Product card */}

        <ProductSpotlight slide={slide} />

        {/* Previous / Next */}
        <div className="pointer-events-none absolute inset-x-4 inset-y-0 flex items-center justify-between opacity-0  transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous slide"
            className="pointer-events-auto rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/80 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next slide"
            className="pointer-events-auto rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/80 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        {/* Autoplay controls */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAutoplay}
            aria-label={isAutoplay ? "Pause autoplay" : "Resume autoplay"}
            title={`${isAutoplay ? "Pause Autoplay" : "Play Autoplay"}`}
            className="rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/70"
          >
            {isAutoplay ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </button>

          <div className="rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-xs text-white backdrop-blur-md">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
