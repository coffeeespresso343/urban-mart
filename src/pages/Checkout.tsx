import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  CreditCard,
  Info,
  Lock,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/checkout/InputField";
import type { ShippingAddress } from "../types/Order";
import { Button } from "../components/ui/Button";
import {
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidCvc,
  isValidEmail,
  isValidExpiry,
  isValidPhone,
  required,
} from "../utils/validation";
import { formatPrice } from "../utils/currency";
import { useCart } from "../hooks/useCart";
import EmptyState from "../components/ui/EmptyState";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { useUIStore } from "../hooks/uiStore";
import { useAuth } from "../hooks/useAuth";
import { createOrder } from "../lib/Orders";

const STEPS = ["Information", "Shipping", "Payment", "Confirmation"] as const;
type StepName = (typeof STEPS)[number];
const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard Shipping",
    time: "3-5 business days",
    price: 0,
  },
  {
    id: "express",
    label: "Express Shipping",
    time: "1-2 business days",
    price: 18,
  },
];

type Errors = Partial<Record<keyof ShippingAddress, string>>;

const Checkout = () => {
  const { user } = useAuth();
  const { items, totals, clearCart } = useCart();
  const [stepIndex, setStepIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const showToast = useUIStore((s) => s.showToast);

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Myanmar",
  });

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const [errors, setErrors] = useState<Errors>({});

  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0].id);

  if (items.length === 0 && !processing) {
    return (
      <div className="container-edge py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          message="Add something to your bag before checking out."
          action={
            <Link to="/shop">
              <Button>
                Continue Shopping
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const shippingCost =
    SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price ?? 0;
  const grandTotal = totals.total + shippingCost;

  const validateInformation = (): boolean => {
    const next: Errors = {};

    if (!required(address.firstName)) next.firstName = "First name is required";
    if (!required(address.lastName)) next.lastName = "Last name is required";
    if (!isValidEmail(address.email))
      next.email = "Please enter a valid email address";
    if (!isValidPhone(address.phone))
      next.phone = "Please enter a valid phone number";

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const validateShipping = (): boolean => {
    const next: Errors = {};

    if (!required(address.address)) next.address = "Your address is required";
    if (!required(address.city)) next.city = "Your city is required";

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const validatePayment = (): boolean => {
    const next: Record<string, string> = {};

    if (!isValidCardNumber(card.number))
      next.number = "Please enter a valid card number";
    if (!required(card.name)) next.name = "Name on card is required";
    if (!isValidExpiry(card.expiry))
      next.expiry = "Please enter a valid expiry (MM / YY)";
    if (!isValidCvc(card.cvc)) next.cvc = "Please enter a valid CVC";

    setCardErrors(next);

    return Object.keys(next).length === 0;
  };

  const goNext = async (e: FormEvent) => {
    e.preventDefault();
    const current: StepName = STEPS[stepIndex];

    if (current === "Information" && !validateInformation()) {
      showToast("Please fill the highlighted fields", "info");
      return;
    }
    if (current === "Shipping" && !validateShipping()) {
      showToast("Please fill the highlighted fields", "info");
      return;
    }
    if (current === "Payment") {
      if (!validatePayment()) {
        showToast("Please fill the highlighted fields", "info");
        return;
      }
      placeOrder();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setProcessing(true);
    setStepIndex(3);

    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    const deliveryDays = shippingMethod === "express" ? 2 : 5;
    const deliveryDate = new Date(Date.now() + deliveryDays * DAY_IN_MS);

    const order = await createOrder({
      items,
      totals: { ...totals, shipping: shippingCost, total: grandTotal },
      shippingAddress: address,
      shippingMethod:
        SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.label ??
        "Standard Shipping",
      estimatedDelivery: deliveryDate.toISOString().slice(0, 10),
      userId: user?.id ?? null,
    });

    setTimeout(() => {
      clearCart();
      navigate(`/order-confirmation?order=${order.orderNumber}`);
    }, 2600);
  };

  return (
    <div className="container-edge py-10 sm:py-24">
      <div className="mb-10 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-0.5 text-lg font-black tracking-tight sm:text-xl"
        >
          Urban <span className="text-orange">Mart</span>
          <ShoppingCart className="h-5 w-5 text-orange" strokeWidth={2.5} />
        </Link>
        <div className="flex items-center gap-1.5 text-good">
          <span className="h-6 w-6 bg-good/10 rounded-md flex items-center justify-center">
            <Lock className="h-4 w-4" />
          </span>
          <span className="label-tag">Secure Checkout</span>
        </div>
      </div>

      <section className="mb-10 bg-paper-dim/40 p-4 rounded-xl">
        <div className="mb-5 flex items-center justify-between">
          <p className="label-tag text-stone">Checkout Progress</p>
          <span className="text-xs font-medium text-stone">
            {stepIndex >= 0 ? `${stepIndex + 1} of ${STEPS.length}` : ""}
          </span>
        </div>
        <ol className="flex  items-center gap-2 sm:gap-4">
          {STEPS.map((step, index) => {
            const isComplete =
              index < stepIndex || (index === stepIndex && processing);
            const isActive = index === stepIndex;

            return (
              <li
                key={step}
                className="flex flex-1 items-center gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isComplete
                        ? "bg-orange  ring-4 ring-orange/10 text-paper"
                        : isActive
                          ? "border-2 border-orange text-ink"
                          : "border border-line-light text-stone"
                    }`}
                  >
                    {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span
                    className={`label-tag font-medium hidden sm:inline ${
                      isActive || isComplete ? "text-ink" : "text-stone"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {index < STEPS.length - 1 ? (
                  <div
                    className={`h-px flex-1 ${
                      isComplete ? "bg-orange" : "bg-line-light"
                    }`}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <AnimatePresence mode="wait">
            {stepIndex === 0 ? (
              <motion.form
                key="information"
                onSubmit={goNext}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <h2 className="flex items-center gap-2 font-display text-xl text-orange font-bold tracking-tight">
                  <Info className="h-5 w-5" strokeWidth={2.5} />
                  Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="First Name"
                    placeholder="Enter your first name"
                    value={address.firstName}
                    onChange={(v) =>
                      setAddress({
                        ...address,
                        firstName: v,
                      })
                    }
                    error={errors.firstName}
                  />

                  <InputField
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={address.lastName}
                    onChange={(v) =>
                      setAddress({
                        ...address,
                        lastName: v,
                      })
                    }
                    error={errors.lastName}
                  />
                </div>
                <InputField
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={address.email}
                  onChange={(v) =>
                    setAddress({
                      ...address,
                      email: v,
                    })
                  }
                  error={errors.email}
                />
                <InputField
                  label="Phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={address.phone}
                  onChange={(v) =>
                    setAddress({
                      ...address,
                      phone: v,
                    })
                  }
                  error={errors.phone}
                />

                <Button size="lg" type="submit" className="mt-2 self-start">
                  Continue to Shipping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.form>
            ) : null}

            {stepIndex === 1 ? (
              <motion.form
                key="shipping"
                onSubmit={goNext}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <h2 className="flex items-center gap-2 font-display text-xl text-orange font-bold tracking-tight">
                  <Truck className="h-5 w-5" strokeWidth={2.5} />
                  Shipping
                </h2>
                <InputField
                  label="Address"
                  placeholder="Enter your address"
                  value={address.address}
                  onChange={(v) => setAddress({ ...address, address: v })}
                  error={errors.address}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="City"
                    placeholder="Enter your city"
                    value={address.city}
                    onChange={(v) => setAddress({ ...address, city: v })}
                    error={errors.city}
                  />
                  <InputField
                    label="Country"
                    placeholder="Enter your country"
                    value={address.country}
                    onChange={(v) => setAddress({ ...address, country: v })}
                    error={errors.country}
                  />
                </div>

                <fieldset className="mt-2">
                  <legend className="label-tag mb-3 text-stone">
                    Shipping Method
                  </legend>
                  <div className="flex flex-col gap-3">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer rounded-md items-center justify-between border px-4 py-3.5 transition-colors ${
                          shippingMethod === method.id
                            ? "border-orange"
                            : "border-line-light"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping-method"
                            checked={shippingMethod === method.id}
                            onChange={() => setShippingMethod(method.id)}
                            className="h-4 w-4 accent-orange"
                          />
                          <span>
                            <span className="block text-sm font-medium">
                              {method.label}
                            </span>
                            <span className="label-tag text-stone">
                              {method.time}
                            </span>
                          </span>
                        </span>
                        <span className="price text-sm font-semibold">
                          {method.price === 0 ? (
                            <span className="text-good">Free</span>
                          ) : (
                            formatPrice(method.price)
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-2 flex gap-3">
                  <Button type="button" variant="ghost" onClick={goBack}>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button size="lg" type="submit">
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.form>
            ) : null}

            {stepIndex === 2 ? (
              <motion.form
                key="payment"
                onSubmit={goNext}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <h2 className="flex items-center gap-2 font-display text-xl text-orange font-bold tracking-tight">
                  <CreditCard className="h-5 w-5" strokeWidth={2.5} />
                  Payment
                </h2>
                <p className="text-warn text-xs flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  This is a simulated checkout - no real payment is processed.
                </p>
                <InputField
                  label="Card Number"
                  value={card.number}
                  onChange={(v) =>
                    setCard({ ...card, number: formatCardNumber(v) })
                  }
                  placeholder="1234 4567 7899 1011"
                  inputMode="numeric"
                  error={cardErrors.number}
                />
                <InputField
                  label="Name on Card"
                  placeholder="Your name on card"
                  value={card.name}
                  onChange={(v) =>
                    setCard({
                      ...card,
                      name: v,
                    })
                  }
                  error={cardErrors.name}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Expiry (MM / YY)"
                    value={card.expiry}
                    onChange={(v) =>
                      setCard({ ...card, expiry: formatExpiry(v) })
                    }
                    placeholder="04 / 28"
                    inputMode="numeric"
                    error={cardErrors.expiry}
                  />
                  <InputField
                    label="CVC"
                    value={card.cvc}
                    onChange={(v) =>
                      setCard({
                        ...card,
                        cvc: v.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    placeholder="123"
                    error={cardErrors.cvc}
                    inputMode="numeric"
                  />
                </div>
                <div className="mt-2 flex gap-3">
                  <Button type="button" variant="ghost" onClick={goBack}>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button size="lg" type="submit">
                    Place Order - {formatPrice(grandTotal)}
                  </Button>
                </div>
              </motion.form>
            ) : null}

            {stepIndex === 3 ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <span className="h-10 w-10 animate-spin rounded-full border-3 border-orange border-t-transparent" />

                <p className="label-tag mt-6 text-stone">
                  Processing your order...
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="h-fit rounded-xl border border-ink/10 bg-ink/[0.035] p-4">
          <h3 className="label-tag mb-4 font-semibold">Order Summary</h3>
          <div className="max-h-72  divide-y divide-line-light overflow-y-auto scrollbar-none">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.color ?? ""}`}
                className="flex gap-3 py-3"
              >
                <div className="relative h-16 w-16 rounded-sm shrink-0 overflow-hidden bg-paper-dim">
                  <ImageWithFallback
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full"
                  />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/60 text-[10px] text-paper font-semibold">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  {item.color ? (
                    <p className="label-tag text-stone">{item.color}</p>
                  ) : null}
                </div>

                <span className="price text-sm">
                  {formatPrice(item.product.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-line-light pt-4 text-sm">
            <div className="flex items-center justify-between text-stone">
              <span>Subtotal</span>
              <span className="price text-ink">
                {formatPrice(totals.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-stone">
              <span>Shipping</span>
              <span className="price text-ink">
                {shippingCost === 0 ? (
                  <span className="text-good">Free</span>
                ) : (
                  formatPrice(shippingCost)
                )}
              </span>
            </div>

            {totals.discount > 0 ? (
              <div className="flex items-center justify-between text-good">
                <span>Discount</span>
                <span className="font-mono text-sm">
                  -{formatPrice(totals.discount)}
                </span>
              </div>
            ) : null}

            <div className="mt-2 flex items-center justify-between border-t border-line-light pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
