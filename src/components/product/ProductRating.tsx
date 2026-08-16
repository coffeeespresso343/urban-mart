import { Star } from "lucide-react";

const ProductRating = ({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) => {
  const statSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Rated ${rating} out of 5`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              className={`${statSize} ${filled ? "fill-orange text-orange" : "fill-transparent text-orange"}`}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {reviewCount !== undefined ? (
        <span className="label-tag text-stone">({reviewCount})</span>
      ) : null}
    </div>
  );
};

export default ProductRating;

// 09757342441
