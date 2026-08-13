import type { Product } from "../../types/Product";
import ProductRating from "./ProductRating";
import { getReviewsForProduct } from "../../data/review.";
import { BadgeCheck } from "lucide-react";

const ProductReviews = ({ product }: { product: Product }) => {
  const reviews = getReviewsForProduct(product);

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

      <ul className="divide-y divide-line-light">
        {reviews.map((review) => (
          <li key={review.id} className="py-8">
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
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductReviews;
