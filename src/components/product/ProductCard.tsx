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
    <div className="group bg-white/60 pb-2 rounded-md relative flex flex-col">
      <Link
        to={`/product/${product.id}`}
        className="relative block rounded-t-md aspect-4/5 overflow-hidden bg-paper-dim"
      >
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          aria-label={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge ? (
            <Badge
              className="w-fit"
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
          {outOfStock ? <Badge tone="stone">Sold out</Badge> : null}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-paper/50 text-ink backdrop-blur transition-transform hover:scale-110"
        >
          <motion.span
            key={wishlisted ? "on" : "off"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Heart
              strokeWidth={1.75}
              aria-hidden="true"
              className={`h-4 w-4 ${wishlisted ? "fill-orange text-orange" : "text-ink"}`}
            />
          </motion.span>
        </button>

        <div
          className="pointer-events-auto absolute inset-x-0 bottom-0 translate-y-0 
          bg-linear-to-t from-ink/85 to-transparent p-3 pt-7
        sm:translate-y-full sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!outOfStock) addItem(product, 1, product.colors?.[0]);
            }}
            disabled={outOfStock}
            className="label-tag rounded-md border border-white/20 flex w-full items-center justify-center bg-paper/95 gap-1.5 px-4 py-2 sm:py-2.5 font-semibold
            text-ink shadow-lg backdrop-blur-none transition-all duration-300 active:scale-[0.98] hover:border-orange hover:bg-orange hover:text-paper hover:shadow-xl disabled:border-transparent
             disabled:bg-stone-light/80 disabled:text-stone-dark disabled:cursor-not-allowed disabled:opacity-70
            "
          >
            {outOfStock ? "Unavailable" : added ? "Add more" : "Quick Add"}

            {!added ? (
              <ShoppingCart
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            ) : !outOfStock ? (
              <PlusCircle
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            ) : null}
          </button>
        </div>
      </Link>

      <div className="mt-3 px-2 flex flex-col gap-1">
        <span className="label-tag text-stone">{product.category}</span>
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-medium leading-snug text-ink hover:text-orange"
        >
          {product.name}
        </Link>

        <ProductRating
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        <div className="mt-1 flex items-baseline gap-2">
          <span className="price text-xs font-semibold text-ink">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="price text-xs text-stone line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        {lowStock ? (
          <span className="label-tag flex items-center justify-center text-warn">
            Only {product.stock} left
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
