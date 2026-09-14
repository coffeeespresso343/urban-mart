import { ArrowRight, TriangleAlert } from "lucide-react";
import { getLowStockProducts } from "../../lib/products";
import { Card } from "../../pages/admin/AdminOverview";
import type { Product } from "../../types/Product";
import { Link } from "react-router-dom";

const STATUS_PILL: Record<string, string> = {
  warn: "bg-admin-pink/20 text-error",
  error: "bg-admin-pink/30 text-admin-pink",
};

const LowStockTable = ({ products }: { products: Product[] }) => {
  const lowStock = getLowStockProducts(products);

  return (
    <Card className="">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-1.5 text-xs text-admin-gray font-semibold">
          <TriangleAlert className="h-3.5 w-3.5 text-admin-gold" />
          Low Stock ({lowStock.length})
        </h3>
        <Link
          to="/admin/products"
          className="text-xs font-semibold text-admin-gray hover:underline
          flex items-center gap-1"
        >
          Manage
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {lowStock.length === 0 ? (
        <p className="mt-6 text-sm text-good ">
          Everything's well stocked - nothing at or below 5 units
        </p>
      ) : (
        <div className="mt-4 divide-y divide-admin-border border-t border-admin-border flex flex-col">
          {lowStock.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              to="/admin/products"
              className="flex items-center justify-between gap-3 py-3 transition duration-200 hover:bg-admin-bg active:scale-99"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="mt-0.5 text-xs text-admin-gray">{product.sku}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  product.stock === 0
                    ? STATUS_PILL["error"]
                    : STATUS_PILL["warn"]
                }`}
              >
                {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LowStockTable;
