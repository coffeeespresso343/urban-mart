import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "../../hooks/uiStore";
import { useCart } from "../../hooks/useCart";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { Button } from "../ui/Button";
import CartSummary from "./CartSummary";
import CartItem from "./CartItem";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const cartOpen = useUIStore((s) => s.cartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const { items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, closeCart]);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <div className="fixed inset-0 z-[95]">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            onClick={closeCart}
            className="absolute inset-0 bg-ink/50"
          />
          <motion.aside
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper-dim shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line-light px-6 py-5">
              <h2 className="flex gap-2 items-center font-display text-md font-bold tracking-wider ">
                <span className="h-7 w-7 text-orange flex items-center justify-center bg-orange/10 rounded-md">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                Your Bag{" "}
                {items.length > 0 &&
                  `(${items.length}) ${items.length === 1 ? "Item" : "Items"}`}
              </h2>
              <button
                onClick={closeCart}
                className="h-7 w-7 flex items-center justify-center bg-orange/5 rounded-full text-stone transition-colors hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={ShoppingBag}
                  title="Your bag is empty"
                  message="Look like you haven't been added anything yet."
                  action={
                    <Button onClick={closeCart} variant="outline">
                      Continue Shopping
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-line-light overflow-y-auto px-6">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product.id}-${item.color ?? ""}`}
                      item={item}
                      compact
                    />
                  ))}
                </div>
                <div className="border-t border-line-light px-6 py-5">
                  <CartSummary
                    onCheckout={() => {
                      navigate("/checkout");
                      closeCart();
                    }}
                    checkoutLabel="Checkout"
                  />
                </div>
              </>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
};
export default CartDrawer;
