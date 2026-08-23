import { ShoppingCart, X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { Button } from "../ui/Button";
import { useState, type FormEvent } from "react";
import { formatPrice } from "../../utils/currency";

const CartSummary = ({
  onCheckout,
  checkoutLabel = "Checkout",
}: {
  onCheckout?: () => void;
  checkoutLabel?: string;
}) => {
  const { totals, promoCode, applyPromoCode, removePromoCode } = useCart();

  const [code, setCode] = useState("");

  const handleApply = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (applyPromoCode(code)) setCode("");
  };
  return (
    <div className="flex flex-col gap-3">
      {!promoCode ? (
        <form onSubmit={handleApply} className="flex gap-2">
          <label htmlFor="promo-code" className="sr-only">
            Promo Code
          </label>
          <input
            id="promo-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo Code"
            className="text-xs font-mono flex-1 rounded-md border border-line-light bg-paper px-3 py-2 text-ink
          placeholder:text-stone placeholder:uppercase focus:border-orange"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={!code}
            className="disabled:opacity-50"
          >
            Apply
          </Button>
        </form>
      ) : (
        <div className="flex items-center justify-between rounded-md bg-orange-light px-3 py-2.5">
          <span className="label-tag text-orange">
            Code {promoCode} applied
          </span>
          <button
            type="button"
            onClick={removePromoCode}
            className=" text-orange-dark hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {!promoCode && (
        <p className="label-tag text-stone">Try URBAN10 or WELCOME15</p>
      )}
      <div className="flex flex-col gap-2 border-t border-line-light pt-3 text-sm">
        <div className="flex items-center justify-between text-stone">
          <span>Subtotal</span>
          <span className="price text-ink">{formatPrice(totals.subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-stone">
          <span>Shipping</span>
          <span className="price text-ink">
            {totals.shipping === 0 ? (
              <span className="text-good">Free</span>
            ) : (
              formatPrice(totals.shipping)
            )}
          </span>
        </div>

        {totals.discount > 0 ? (
          <div className="flex items-center justify-between text-stone">
            <span>Discount</span>
            <span className="price text-ink">
              {formatPrice(totals.discount)}
            </span>
          </div>
        ) : null}

        <div className="mt-2 flex items-center justify-between border-t border-t-line-light pt-2 text-base font-semibold">
          <span className="label-tag">Total</span>
          <span className="price">{formatPrice(totals.total)}</span>
        </div>
      </div>

      {onCheckout ? (
        <Button
          size="lg"
          onClick={onCheckout}
          disabled={totals.itemCount === 0}
        >
          {checkoutLabel}
          <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Button>
      ) : null}
    </div>
  );
};

export default CartSummary;
