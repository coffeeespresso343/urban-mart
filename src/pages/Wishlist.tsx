import { motion } from "framer-motion";
import { ArrowRight, Heart, PlusCircle, ShoppingBag, X } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useWishlist } from "../hooks/useWishlist";
import { products } from "../data/products";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import ProductRating from "../components/product/ProductRating";
import { formatPrice } from "../utils/currency";
import { useCart } from "../hooks/useCart";

const Wishlist = () => {
  const { productIds, removeFromWishlist } = useWishlist();

  const { addItem, isAdded } = useCart();

  const items = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length <= 0) {
    return (
      <div className="container-edge py-20">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save products you like and they'll show up here."
          action={
            <Link to="/shop">
              <Button size="md" variant="outline">
                Discover Products <ArrowRight className="h-4 w-4 shrink-0" />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-edge py-10">
      <h1 className="mb-8 flex items-center gap-2 font-display text-3xl font-black tracking-wide sm:text-4xl">
        <span className="h-8 w-8 bg-orange/10 rounded-full justify-center flex items-center">
          <Heart className="h-5 w-5 shrink-0 text-orange" />
        </span>
        Your Wishlist
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {items.map((product, index) => {
          const outOfStock = product.stock <= 0;
          const added = isAdded(product.id, product.colors?.[0]);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="group rounded-xl relative flex flex-col overflow-hidden border border-line-light"
            >
              <Link
                to={`/product/${product.id}`}
                className="relative block aspect-4/3 overflow-hidden bg-paper-dim"
              >
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(product.id);
                }}
                className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-full bg-ink/30 text-stone transition-transform hover:scale-110 active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <span className="label-tag text-stone">{product.category}</span>
                <Link
                  to={`/product/${product.id}`}
                  className="text-sm font-medium hover:text-orange"
                >
                  {product.name}
                </Link>
                <ProductRating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
                <span className="price text-sm mt-1 font-semibold">
                  {formatPrice(product.price)}
                </span>

                <Button
                  size="sm"
                  className="mt-4 w-full"
                  disabled={outOfStock}
                  onClick={(e) => {
                    e.preventDefault();
                    addItem(product, 1, product.colors?.[0]);
                  }}
                >
                  {added ? (
                    <PlusCircle className="h-3.5 w-3.5" />
                  ) : (
                    <ShoppingBag className="h-3.5 w-3.5" />
                  )}
                  {added
                    ? "Add More"
                    : outOfStock
                      ? "Unavailable"
                      : "Add to bag"}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
