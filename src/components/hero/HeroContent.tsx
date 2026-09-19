import { AnimatePresence, motion } from "framer-motion";
import type { HeroSlide } from "../../types/HeroSlide";
import {
  ArrowRight,
  Check,
  Eye,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

interface HeroContentProps {
  slide: HeroSlide;
  isAddedToCart: boolean;
  onAddToCart: () => void;
  onQuickView: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

const getTitleParts = (title: string, highlightText: string) => {
  const index = title.indexOf(highlightText);
  if (index === -1) {
    return { before: title, highlight: "", after: "" };
  }
  return {
    before: title.slice(0, index),
    highlight: highlightText,
    after: title.slice(index + highlightText.length),
  };
};

const TrustFeatures = () => {
  const features = [
    { icon: Truck, title: "Fast Delivery", description: "Free over $99" },
    {
      icon: ShieldCheck,
      title: "2-Year Warranty",
      description: "100% Guaranteed",
    },
    { icon: Package, title: "Easy Returns", description: "30-day trial" },
  ];

  return (
    <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
      {features.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold">{title}</p>
            <p className="text-[11px] text-stone-400">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const HeroContent = ({
  slide,
  isAddedToCart,
  onAddToCart,
  onQuickView,
}: HeroContentProps) => {
  const titleParts = getTitleParts(slide.title, slide.highlightText);

  return (
    <div className="order-2 relative z-10 lg:order-1 lg:col-span-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Tag + Rating */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div
              style={{
                borderColor: `${slide.accentColor}40`,
                backgroundColor: `${slide.accentColor}15`,
                color: slide.accentColor,
              }}
              className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{slide.tagline}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-stone">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <span className="font-bold text-white">
                {slide.product.rating}
              </span>
              <span>({slide.product.reviewCount})</span>
            </div>
          </div>
          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {titleParts.before}
            {titleParts.highlight && (
              <span
                className="bg-linear-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${slide.accentColor}, #F59E0B)`,
                }}
              >
                {titleParts.highlight}
              </span>
            )}
            {titleParts.after}
          </h1>
          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg">
            {slide.description}
          </p>
          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onAddToCart}
              style={{
                backgroundColor: slide.accentColor,
                boxShadow: `0 10px 25px -5px ${slide.accentColor}50`,
              }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAddedToCart ? (
                <>
                  <Check className="h-5 w-5 animate-bounce" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <span>Shop {slide.product.name}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onQuickView}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
            >
              <Eye className="h-4 w-4" strokeWidth={2.5} />
              <span>Quick Details</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      <TrustFeatures />
    </div>
  );
};

export default HeroContent;
