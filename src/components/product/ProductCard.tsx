import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";
import ImageWithFallback from "../ui/ImageWithFallback";
import { Heart, PlusCircle, ShoppingCart } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import Badge from "../ui/Badge";
import ProductRating from "./ProductRating";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem, isAdded } = useCart();
  const { isWishListed, toggleWishlist } = useWishlist();
  const wishlisted = isWishListed(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const added = isAdded(product.id, product.colors?.[0]);

  return (
    <div
      className="
    group relative flex flex-col
    overflow-hidden rounded-xl
    bg-paper border border-line-light
    transition-all duration-300
    hover:-translate-y-0.5
  "
    >
      <Link
        to={`/product/${product.id}`}
        className="
      relative block aspect-4/5
      overflow-hidden rounded-t-xl
      bg-paper-dim
    "
      >
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          aria-label={product.name}
          className="
        h-full w-full object-cover
        transition-transform duration-700
        ease-out
        group-hover:scale-[1.045]
      "
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

        <div className="absolute left-3 top-3 flex max-w-[75%] flex-wrap gap-1.5">
          {product.badge ? (
            <Badge
              className="
            rounded-full border border-paper/30
            px-2.5 py-1
            text-[9px] font-bold uppercase
            tracking-[0.08em]
            shadow-sm backdrop-blur-md
          "
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
          ) : null}

          {outOfStock ? (
            <Badge
              tone="stone"
              className="
            rounded-full border border-paper/30
            px-2.5 py-1
            text-[9px] font-bold uppercase
            tracking-[0.08em]
            shadow-sm backdrop-blur-md
          "
            >
              Sold out
            </Badge>
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
          className="
        absolute right-3 top-3
        flex h-8 w-8 items-center justify-center
        rounded-full
        border border-paper/50
        bg-paper/65
        text-ink
        shadow-sm
        backdrop-blur-md
        transition-all duration-300
        hover:scale-105
        hover:border-orange/30
        hover:bg-paper
        active:scale-95
      "
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
            h-[17px] w-[17px]
            transition-colors duration-200
            ${wishlisted ? "fill-orange text-orange" : "text-ink"}
          `}
            />
          </motion.span>
        </button>

        <div
          className="
        pointer-events-none absolute inset-x-3 bottom-3
        translate-y-2 opacity-100 sm:opacity-0
        transition-all duration-300 ease-out
        sm:group-hover:pointer-events-auto
        sm:group-hover:translate-y-0
        sm:group-hover:opacity-100
      "
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!outOfStock) {
                addItem(product, 1, product.colors?.[0]);
              }
            }}
            disabled={outOfStock}
            className="
          label-tag flex w-full
          items-center justify-center gap-2
          rounded-lg
          border border-paper/60
          bg-paper/95
          px-4 py-2.5
          font-semibold text-ink
          shadow-[0_8px_25px_rgba(0,0,0,0.12)]
          backdrop-blur-md
          transition-all duration-300
          hover:border-orange
          hover:bg-orange
          hover:text-paper
          hover:shadow-[0_10px_30px_rgba(0,0,0,0.16)]
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:border-transparent
          disabled:bg-stone-light/90
          disabled:text-stone-dark
          disabled:opacity-80
        "
          >
            {!added && !outOfStock ? (
              <ShoppingCart
                className="
              h-4 w-4
              transition-transform duration-300
              group-hover:-translate-y-px
            "
                strokeWidth={2.1}
                aria-hidden="true"
              />
            ) : added && !outOfStock ? (
              <PlusCircle
                className="
              h-4 w-4
              transition-transform duration-300
              group-hover:-translate-y-px
            "
                strokeWidth={2.1}
                aria-hidden="true"
              />
            ) : null}

            {outOfStock ? "Unavailable" : added ? "Add More" : "Quick Add"}
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-1.5 pb-2 pt-4 sm:px-2">
        <span className="label-tag text-[9px] text-stone">
          {product.category}
        </span>

        <Link
          to={`/product/${product.id}`}
          className="
        mt-1.5 line-clamp-2
        text-[13px] font-semibold
        leading-snug tracking-[-0.01em]
        text-ink
        transition-colors duration-200
        hover:text-orange
        sm:text-sm
      "
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
          <span className="price text-sm font-bold text-ink sm:text-[15px]">
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
