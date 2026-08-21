import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import EmptyState from "../components/ui/EmptyState";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/Button";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

const Cart = () => {
  const { items } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-edge py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          message="Looks like you haven't added anything yet."
          action={
            <Button onClick={() => navigate("/shop")}>
              Continue shopping <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          }
        />
      </div>
    );
  }
  return (
    <div className="container-edge py-20">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex gap-2 text-3xl items-center font-display font-bold tracking-wider ">
          <span className="h-10 w-10 text-orange flex items-center justify-center bg-orange/10 rounded-md">
            <ShoppingBag className="h-6 w-6" />
          </span>
          Your Bag{" "}
          {items.length > 0 &&
            `(${items.length}) ${items.length === 1 ? "Item" : "Items"}`}
        </h2>
        <Link
          to="/shop"
          className="label-tag hidden items-center gap-1.5 text-stone font-medium hover:text-ink sm:flex"
        >
          Continue shopping <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        <div className="px-6 py-2 divide-y divide-line-light border border-line-light rounded-xl">
          {items.map((item) => (
            <CartItem
              key={`${item.product.id}-${item.color ?? ""}`}
              item={item}
            />
          ))}
        </div>

        <div>
          <div className="border rounded-xl border-line-light p-6">
            <CartSummary
              checkoutLabel="Checkout"
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
