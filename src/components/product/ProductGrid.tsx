import { motion } from "framer-motion";
import type { Product, ViewMode } from "../../types/Product";
import ProductCard from "./ProductCard";
import EmptyState from "../ui/EmptyState";
import { SearchX } from "lucide-react";
import { useMemo } from "react";

const ProductGrid = ({
  products,
  viewMode,
  emptyMessage = "Try adjusting your filters or search terms.",
}: {
  products: Product[];
  viewMode: ViewMode;
  emptyMessage?: string;
}) => {
  const gridClasses = useMemo(() => {
    if (viewMode === "grid-4")
      return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6";

    if (viewMode === "grid-3")
      return "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6";

    if (viewMode === "list") return "flex flex-col gap-4";
  }, [viewMode]);

  if (products.length === 0)
    return (
      <EmptyState
        icon={SearchX}
        title="No products found!"
        message={emptyMessage}
      />
    );

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
        >
          <ProductCard product={product} viewMode={viewMode} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
