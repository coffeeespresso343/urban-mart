import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductGrid from "../product/ProductGrid";
import { newArrivals } from "../../data/products";
import { useEffect, useState } from "react";
import { ProductGridSkeleton } from "../ui/Skeleton";

const FeaturedProducts = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-edge">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="label-tag text-orange">Just In</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="label-tag hidden items-center gap-1.5 font-semibold hover:text-orange sm:flex"
          >
            View All <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <>
            <ProductGrid products={newArrivals} />

            <div className="mt-10 flex items-center justify-center sm:hidden">
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                to="/shop?sort=newest"
                className="label-tag flex items-center gap-2 font-semibold border-b-2 border-ink
            transition-all duration-200 text-ink hover:text-orange hover:border-orange active:scale-95"
              >
                View Alll New Arrivals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
