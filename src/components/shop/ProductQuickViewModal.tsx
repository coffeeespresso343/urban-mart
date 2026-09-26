import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../../types/Product";
import { Check, Heart, ShoppingCart, X } from "lucide-react";
import ImageWithFallback from "../ui/ImageWithFallback";
import { useState, type MouseEvent } from "react";
import ProductRating from "../product/ProductRating";
import { formatPrice } from "../../utils/currency";
import { useWishlist } from "../../hooks/useWishlist";
import Badge from "../ui/Badge";
import { useCart } from "../../hooks/useCart";

const ease = [0.16, 1, 0.3, 1] as const;
interface ProductQuickViewModalProps {
  product: Product;
  onClose: () => void;
}

const ProductQuickViewModal = ({
  product,
  onClose,
}: ProductQuickViewModalProps) => {
  const { toggleWishlist, isWishListed } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isWishListed(product.id);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    addItem(product, 1, product.colors?.[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/5 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ ease }}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} details`}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white
          grid grid-cols-1 md:grid-cols-2 p-6 text-ink shadow-2xl sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick details"
            className="absolute right-2 top-2 bg-white/5 rounded-full p-2 transition-colors hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-2 bg-slate-50 flex flex-col justify-between">
            <div className="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-white border border-ink/20">
              <ImageWithFallback
                src={selectedImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex gap-2 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 w-16 rounded-xl overflow-hidden border-2 ${
                    selectedImage === img ? "border-orange" : "border-ink/30"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-stone text-sm">
                  {product.category}
                </p>
                {product.badge ? (
                  outOfStock ? (
                    <Badge tone="error">Sold out</Badge>
                  ) : (
                    <Badge
                      tone={
                        product.badge === "Limited"
                          ? "warn"
                          : product.badge === "Best Seller"
                            ? "good"
                            : "orange"
                      }
                    >
                      {product.badge}
                    </Badge>
                  )
                ) : null}
              </div>

              <h2 className="text-xl font-extrabold text-ink mt-1">
                {product.name}
              </h2>

              <div className="mt-1">
                <ProductRating
                  size="md"
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-xl font-bold text-ink-soft">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm font-semibold line-through text-stone">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs text-stone leading-relaxed">
                {product.description}
              </p>

              {product.details.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Key Specs
                  </p>
                  {product.details.slice(0, 2).map((feature) => (
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
            </div>

            <div className="space-y-3 pt-3 border-t border-ink/20">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex h-12 w-full min-w-36 items-center justify-center gap-1.5 rounded-xl border border-white/40 bg-orange px-4 py-3
              text-sm font-semibold text-white shadow-lg backdrop-blur-md
              transition-all duration-300 hover:bg-orange hover:text-white hover:border-orange
              active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {product.stock > 1 ? (
                    <>
                      <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
                      Add to Cart
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/50 bg-paper/65 text-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-orange/30 hover:bg-paper active:scale-95"
                >
                  <motion.span
                    key={wishlisted ? "on" : "off"}
                    initial={{ scale: 0.65 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    <Heart
                      strokeWidth={1.8}
                      aria-hidden="true"
                      className={`h-5 w-5 transition-colors duration-200 ${wishlisted ? "fill-orange text-orange" : "text-ink"}`}
                    />
                  </motion.span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductQuickViewModal;
