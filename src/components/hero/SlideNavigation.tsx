import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { HeroSlide } from "../../types/HeroSlide";

interface SlideNavigationProps {
  slides: HeroSlide[];
  currentIndex: number;
  onSelect: (index: number) => void;
}
const SlideNavigation = ({
  slides,
  currentIndex,
  onSelect,
}: SlideNavigationProps) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 md:flex-row">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
        <Clock className="h-4 w-4 text-orange-500" />
        <span>SS26 Featured Showcase</span>
      </div>
      <div className="scrollbar-none flex max-w-full items-center gap-3 overflow-x-auto px-2 pb-2 md:pb-1">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              type="button"
              key={slide.id}
              onClick={() => onSelect(index)}
              aria-label={`Show ${slide.product.name}`}
              aria-current={isActive ? "true" : undefined}
              className={`relative my-1 flex shrink-0 items-center gap-3 rounded-xl border p-2 text-left transition-all duration-300 ${isActive ? "scale-105 border-orange-500 bg-white/10 shadow-md" : "border-transparent bg-white/5 opacity-60 hover:bg-white/10 hover:opacity-100"}`}
            >
              <img
                src={slide.image}
                alt=""
                className="h-10 w-10 rounded-lg object-cover"
              />
              <div className="hidden pr-2 text-left sm:block">
                <p className="max-w-25 truncate text-xs font-bold">
                  {slide.product.name}
                </p>
                <p className="text-[10px] text-stone-400">
                  {slide.product.price}
                </p>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-orange-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlideNavigation;
