import { motion } from "framer-motion";
import type { Product } from "../../types/Product";
import ProductRating from "./ProductRating";
import { getReviewsForProduct } from "../../data/review.";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import { useState } from "react";

const ProductReviews = ({ product }: { product: Product }) => {
  const reviews = getReviewsForProduct(product);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);

  const toggleLike = (reviewId: string) => {
    setLikedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id != reviewId)
        : [...prev, reviewId],
    );
  };

  return (
    <section className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line-light pb-6">
        <div>
          <h2
            id="reviews-heading"
            className="font-display text-2xl font-bold tracking-tight"
          >
            Reviews
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <ProductRating rating={product.rating} size="md" />
            <span className="text-sm text-stone">
              {product.rating.toFixed(1)} out of 5 . {product.reviewCount}
            </span>
          </div>
        </div>
      </div>

      <ul className="border-b border-line-light">
        {reviews.map((review) => {
          const isLiked = likedReviews.includes(review.id);

          return (
            <li key={review.id} className="py-8 border-b border-line-light">
              <div className="flex items-center justify-between gap-4">
                <ProductRating rating={review.rating} />
                <span className="label-tag text-stone">{review.date}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold">{review.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {review.body}
              </p>

              <div className="mt-3 flex items-center gap-1.5">
                {review.verified ? (
                  <BadgeCheck className="h-3.5 w-3.5 text-orange" />
                ) : null}

                <span className="label-tag text-stone">{review.author}</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="bg-paper-dim rounded-xl flex items-center gap-1 px-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(review.id);
                    }}
                    type="button"
                    className="rounded-full flex items-center justify-center h-6 w-6"
                  >
                    <motion.span
                      key={isLiked ? "like" : "unlike"}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <ThumbsUp
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className={`h-4 w-4 ${isLiked ? "text-orange h-4.5 w-4.5" : "text-ink"}`}
                      />
                    </motion.span>
                  </button>
                  <span className="h-4 w-px rounded-full bg-ink/30" />
                  <span className="text-xs text-stone font-bold font-mono">
                    {isLiked ? review.likeCount + 1 : review.likeCount}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ProductReviews;
