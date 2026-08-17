import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import type { CartItem as CartItemType } from "../../types/Cart";
import ImageWithFallback from "../ui/ImageWithFallback";
import { useUIStore } from "../../hooks/uiStore";
import { X } from "lucide-react";
import QuantitySelector from "../product/QuantitySelector";
import { formatPrice } from "../../utils/currency";

const CartItem = ({
  item,
  compact = false,
}: {
  item: CartItemType;
  compact?: boolean;
}) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, color } = item;
  const closeCart = useUIStore((s) => s.closeCart);

  return (
    <div className="flex gap-4 py-5">
      <Link
        onClick={closeCart}
        to={`/product/${product.id}`}
        className={`shrink-0 rounded-md overflow-hidden bg-paper-dim ${compact ? "h-20 w-20" : "h-28 w-28"}`}
      >
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="">
            <Link
              to={`/product/${product.id}`}
              onClick={closeCart}
              className="text-sm font-medium hover:text-orange"
            >
              {product.name}
            </Link>
            {color ? (
              <p className="label-tag mt-1 text-stone">Color - {color}</p>
            ) : null}
          </div>
          <button
            onClick={() => removeItem(product.id, color)}
            className="text-warn transition-colors hover:text-stone"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantitySelector
            quantity={quantity}
            onChange={(next) => updateQuantity(product.id, next, color)}
            max={product.stock}
            size="sm"
          />
          <span className="price text-sm font-semibold">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
