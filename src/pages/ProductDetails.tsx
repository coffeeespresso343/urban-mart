import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import { getProductById, getRelatedProducts, products } from "../data/products";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import ProductReviews from "../components/product/ProductReviews";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductGrid from "../components/product/ProductGrid";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(Number(id)) : undefined;

  const { ids: recentIds, trackView } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      trackView(product.id);
      window.scrollTo({ top: 0 });
    }
  }, [product?.id]);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const related = getRelatedProducts(product);
  const recentlyViewed = recentIds
    .filter((rid) => rid !== product.id)
    .map((rid) => products.find((p) => p.id === rid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  return (
    <motion.div key={product?.id} className="container-edge py-10 sm:py-14">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-stone">
        <Link to="/shop" className="hover:text-orange">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={`shop?category=${product?.category.toLowerCase().replace(/\s+/g, "")}`}
          className="hover:text-orange"
        >
          {product?.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{product?.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product?.images} productName={product?.name} />
        <ProductInfo product={product} />
      </div>

      <ProductReviews />

      {related.length > 0 ? (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-tight">
            You May Also Like
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}

      {recentlyViewed.length > 0 ? (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-tight">
            Recently Viewed
          </h2>
          <ProductGrid products={recentlyViewed} />
        </section>
      ) : null}
    </motion.div>
  );
};

export default ProductDetails;
