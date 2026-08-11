import { motion } from "framer-motion";
import type { Product } from "../../types/Product";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
  emptyMessage = "Try adjusting your filters or search terms.",
}: {
  products: Product[];
  emptyMessage?: string;
}) => {
  if (products.length === 0) return <h1>EMPTY STATE</h1>;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
