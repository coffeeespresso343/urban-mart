import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product, ViewMode } from "../../types/Product";
import ImageWithFallback from "../ui/ImageWithFallback";
import { Check, Heart, Info, ShoppingCart } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import Badge from "../ui/Badge";
import ProductRating from "./ProductRating";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useState, type MouseEvent } from "react";

const ProductCard = ({
  product,
  viewMode,
  onQuickView,
}: {
  product: Product;
  viewMode: ViewMode;
  onQuickView: (product: Product) => void;
}) => {
  const { addItem, isAdded } = useCart();
  const { isWishListed, toggleWishlist } = useWishlist();
  const [isJustAdded, setIsJustAdded] = useState(false);
  const wishlisted = isWishListed(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const added = isAdded(product.id, product.colors?.[0]);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    addItem(product, 1, product.colors?.[0]);
    setIsJustAdded(true);
    setTimeout(() => {
      setIsJustAdded(false);
    }, 1500);
  };

  if (viewMode === "list") {
    return (
      <div
        className="bg-white rounded-2xl border border-line-light p-4 shadow-sm hover:shadow-md transition-all
      flex flex-col sm:flex-row items-center gap-6 group"
      >
        {/**Image + Badge + Wishlist */}
        <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-ink/5 shrink-0">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute left-2 top-2 flex max-w-[75%] flex-wrap gap-1.5">
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

          <button
            type="button"
            aria-label={
              wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={wishlisted}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full
        border border-paper/50 bg-paper/65 text-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-orange/30 hover:bg-paper active:scale-95"
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
                className={`
            h-4.25 w-4.25
            transition-colors duration-200
            ${wishlisted ? "fill-orange text-orange" : "text-ink"}
          `}
              />
            </motion.span>
          </button>
        </div>

        {/** Rating */}
        <div className="flex-1 space-y-2 w-full">
          <p className="font-bold text-stone text-xs">{product.category}</p>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-ink text-sm hover:text-orange cursor-pointer">
              {product.name}
            </h3>
            <ProductRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>

          <p className="text-xs text-stone line-clamp-2">
            {product.description}
          </p>
          {lowStock && !outOfStock ? (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-warn" />

              <span className="text-[10px] font-medium text-warn">
                Only {product.stock} left
              </span>
            </div>
          ) : null}

          <div className="pt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-ink">
                {formatPrice(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-sm font-semibold text-stone line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onQuickView(product)}
                className="p-2 rounded-full bg-ink/90 text-white hover:text-orange transition-all duration-300 active:scale-95"
              >
                <Info className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="flex w-full min-w-36 items-center justify-center gap-1.5 rounded-xl border border-white/40 bg-orange px-4 py-2.5
              text-xs font-semibold text-white shadow-lg backdrop-blur-md
              transition-all duration-300 hover:bg-orange hover:text-white hover:border-orange
              active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-45
            "
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isJustAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className="h-4 w-4 animate-bounce"
                        strokeWidth={2.5}
                      />
                      Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                      {outOfStock
                        ? "Out of Stock"
                        : added
                          ? "Add More"
                          : "Quick Add"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
    group relative flex flex-col
    overflow-hidden rounded-xl
    bg-white border border-line-light
    transition-all duration-200
    hover:-translate-y-0.5
  "
    >
      <div
        onClick={() => onQuickView(product)}
        className="relative block aspect-4/5 overflow-hidden rounded-t-xl bg-paper-dim"
      >
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          aria-label={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />

        <div
          className="
        pointer-events-none absolute inset-0
        bg-linear-to-t
        from-ink/10 via-transparent to-transparent
        opacity-0 transition-opacity duration-500
        group-hover:opacity-100
      "
        />

        <div className="absolute left-2 top-2 flex max-w-[75%] flex-wrap gap-1.5">
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

        <button
          type="button"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-paper/50
        bg-paper/65 text-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-orange/30
         hover:bg-paperactive:scale-95"
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
              className={`
            h-4.25 w-4.25
            transition-colors duration-200
            ${wishlisted ? "fill-orange text-orange" : "text-ink"}
          `}
            />
          </motion.span>
        </button>

        <div
          className="
        absolute inset-x-3 bottom-3
        translate-y-2 opacity-100 sm:opacity-0
        transition-all duration-200 ease-out
        sm:group-hover:pointer-events-auto
        sm:group-hover:translate-y-0
        sm:group-hover:opacity-100
      "
        >
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="
              flex w-full items-center justify-center gap-2
              rounded-xl border border-white/40 bg-white/90 px-4 py-2.5
              text-xs font-semibold text-ink shadow-lg backdrop-blur-md
              transition-all duration-200 hover:bg-orange hover:text-white hover:border-orange
              active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              {isJustAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4 animate-bounce" strokeWidth={2.5} />
                  Added to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                  {outOfStock
                    ? "Out of Stock"
                    : added
                      ? "Add More"
                      : "Quick Add"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-2 pt-4 sm:px-2">
        <span className="label-tag text-[9px] text-stone">
          {product.category}
        </span>

        <Link
          to={`/product/${product.id}`}
          className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-snug tracking-[-0.01em]
        text-ink transition-colors duration-200 hover:text-orange sm:text-sm"
        >
          {product.name}
        </Link>

        <div className="mt-2">
          <ProductRating
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className=" text-sm font-bold text-ink sm:text-[15px]">
            {formatPrice(product.price)}
          </span>

          {product.compareAtPrice ? (
            <span className="price text-[11px] text-stone line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {lowStock && !outOfStock ? (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-warn" />

            <span className="text-[10px] font-medium text-warn">
              Only {product.stock} left
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
