import { AnimatePresence, motion } from "framer-motion";
import type { HeroSlide } from "../../types/HeroSlide";
import { Check, ShoppingBag, X } from "lucide-react";
import type { Product } from "../../types/Product";

const ease = [0.16, 1, 0.3, 1] as const;

interface QuickViewModalProps {
  slide: HeroSlide;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}
const QuickViewModal = ({
  slide,
  onClose,
  onAddToCart,
}: QuickViewModalProps) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ ease }}
          role="dialog"
          aria-modal="true"
          aria-label={`${slide.product.name} details`}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-[#121318] p-6 text-white shadow-2xl sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick details"
            className="absolute right-2 top-2 bg-white/5 rounded-full p-2 transition-colors hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
            <div className="aspect-video lg:aspect-square overflow-hidden rounded-2xl bg-stone-800">
              <img
                src={slide.image}
                alt={slide.product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span
                className="mb-2 inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: slide.accentColor }}
              >
                {slide.product.badge}
              </span>
              <h3 className="text-2xl font-black"> {slide.product.name} </h3>
              <p className="mt-1 text-xl font-bold text-orange-500">
                ${slide.product.price}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                {slide.description}
              </p>
              {slide.product.details?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Key Specs
                  </p>
                  {slide.product.details.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  onAddToCart(slide.product);
                  onClose();
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600"
              >
                <ShoppingBag className="h-4 w-4" /> <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
