import { useState } from "react";
import type { Product } from "../../types/Product";
import { formatPrice } from "../../utils/currency";
import Badge from "../ui/Badge";
import ProductRating from "./ProductRating";
import { Check, Heart, RotateCcw, Share2, Truck } from "lucide-react";
import { Button } from "../ui/Button";
import QuantitySelector from "./QuantitySelector";

const ProductInfo = ({ product }: { product: Product }) => {
  const [color, setColor] = useState(product.colors?.[0]);

  const [quantity, setQuantity] = useState(1);

  const isWishlisted = false;
  const wishlisted = true;

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {product.badge ? (
          <Badge tone={product.badge === "Limited" ? "warn" : "ink"}>
            {product.badge}
          </Badge>
        ) : null}
        <span className="label-tag text-stone">{product.sku}</span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3 flex items-center gap-3">
        <ProductRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="md"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="price text-2xl font-semibold">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice ? (
          <span className="price text-base text-stone line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        ) : null}
      </div>

      <p className="mt-6 max-w-md text-sm leading-relaxed text-stone">
        {product.description}
      </p>

      {product.colors && product.colors.length > 0 ? (
        <div className="mt-8">
          <span className="label-tag mb-3 block text-ink">Color - {color}</span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`label-tag border px-3.5 py-2 transition-colors ${
                  color === c
                    ? "border-ink bg-ink text-paper"
                    : "border-line-light text-ink hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <span className="label-tag mb-3 block text-ink">Quantity</span>
        <QuantitySelector
          quantity={quantity}
          onChange={setQuantity}
          max={Math.max(product.stock, 1)}
        />
        {outOfStock ? (
          <p className="label-tag mt-4 text-warn">Currently unavailable</p>
        ) : lowStock ? (
          <p className="label-tag mt-4 text-warn">Only {product.stock} left</p>
        ) : (
          <p className="label-tag mt-4 text-good">In stock, ready to ship</p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" disabled={outOfStock}>
          {outOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={outOfStock}
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? "fill-orange text-orange" : ""}`}
          />
          {wishlisted ? "Wishlisted" : "Wishlist"}
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className="flex-1"
          disabled={outOfStock}
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-10 divide-y divide-line-light border-y border-line-light">
        <div className="flex items-start gap-3 py-4">
          <span className="h-6 w-6 flex items-center justify-center bg-stone/10 border border-stone/5 rounded-md">
            <Truck
              className="mt-0.5 h-4 w-4 shrink-0 text-stone"
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="text-sm font-medium">Shipping</p>
            <p className="mt-1 text-sm text-stone">
              Free shipping on orders over $99. Standard delivery in 3-5
              business days.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-4">
          <span className="h-6 w-6 flex items-center justify-center bg-stone/10 border border-stone/5 rounded-md">
            <RotateCcw
              className="mt-0.5 h-4 w-4 shrink-0 text-stone"
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="text-sm font-medium">Returns</p>
            <p className="mt-1 text-sm text-stone">
              Free 30-day returns. Items must be unused and in original
              packaging.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-4">
          <span className="h-6 w-6 flex items-center justify-center bg-stone/10 border border-stone/5 rounded-md">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-stone"
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="text-sm font-medium">Quality guarantee</p>
            <p className="mt-1 text-sm text-stone">
              Every product is test for durability before it makes the catalog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
