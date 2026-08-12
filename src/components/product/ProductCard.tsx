import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";
import ImageWithFallback from "../ui/ImageWithFallback";
import { ArrowRight, Heart } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import Badge from "../ui/Badge";
import ProductRating from "./ProductRating";

const ProductCard = ({ product }: { product: Product }) => {
  const wishlisted = true;
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative flex flex-col">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-4/5 overflow-hidden bg-paper-dim"
      >
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          aria-label={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge ? (
            <Badge tone={product.badge === "Limited" ? "warn" : "ink"}>
              {product.badge}
            </Badge>
          ) : null}
          {outOfStock ? <Badge tone="stone">Sold out </Badge> : null}
        </div>

        <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:scale-110">
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
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-r from-ink/85 to-transparent
        p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:pointer-events-auto"
        >
          <button
            disabled={outOfStock}
            className="label-tag flex w-full items-center justify-center gap-1.5 bg-paper py-2.5 font-semibold
            text-ink transition-colors hover:bg-orange hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            {outOfStock ? "Unavailable" : "Quick Add"}
            {!outOfStock && (
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Link>

      <div className="mt-3 flex flex-col gap-1">
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
          <span className="label-tag text-warn">Only {product.stock} left</span>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
