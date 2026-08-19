import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Lock,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
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
  isValidPostalCode,
  required,
} from "../utils/validation";
import { formatPrice } from "../utils/currency";
import { useCart } from "../hooks/useCart";
import EmptyState from "../components/ui/EmptyState";
import { useUIStore } from "../hooks/uiStore";

const STEPS = ["Information", "Shipping", "Payment", "Confirmation"] as const;
type StepName = (typeof STEPS)[number];

type Errors = Partial<Record<keyof ShippingAddress, string>>;

const Checkout = () => {
  const { items, totals, clearCart } = useCart();
  const [stepIndex, setStepIndex] = useState(0);
  const [processing, setProcessing] = useState(false);

  const showToast = useUIStore((S) => S.showToast);

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United State",
  });

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const [errors, setErrors] = useState<Errors>({});

  if (items.length === 0 && !processing) {
    return (
      <div className="container-edge py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          message="Add something to your bag before checking out."
          action={
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

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
    if (!isValidPostalCode(address.postalCode))
      next.postalCode = "Please enter a valid postal code";
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

  const goNext = (e: FormEvent) => {
    e.preventDefault();
    const current: StepName = STEPS[stepIndex];

    if (current === "Information" && !validateInformation()) return;
    if (current === "Shipping" && !validateShipping()) return;
    if (current === "Payment") {
      if (!validatePayment()) return;
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

  const placeOrder = () => {
    setProcessing(true);
    setStepIndex(3);
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
        <div className="flex items-center gap-1.5 text-stone">
          <span className="h-6 w-6 bg-paper-dim rounded-md flex items-center justify-center">
            <Lock className="h-4 w-4" />
          </span>
          <span className="label-tag">Secure Checkout</span>
        </div>
      </div>

      <ol className="mb-10 flex  items-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const isComplete =
            index < stepIndex || (index === stepIndex && processing);
          const isActive = index === stepIndex;

          return (
            <li key={step} className="flex flex-1 items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isComplete
                      ? "bg-orange text-paper"
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

      <div>
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
                <h2 className="font-display text-xl text-orange font-bold tracking-tight">
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
                <h2 className="font-display text-xl text-orange font-bold tracking-tight">
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
                    label="Postal Code"
                    placeholder="Enter postal code"
                    value={address.postalCode}
                    onChange={(v) => setAddress({ ...address, postalCode: v })}
                    error={errors.postalCode}
                  />
                </div>
                <InputField
                  label="Country"
                  placeholder="Enter your country"
                  value={address.country}
                  onChange={(v) => setAddress({ ...address, country: v })}
                  error={errors.country}
                />

                <div className="mt-2 flex gap-3">
                  <Button type="button" variant="ghost" onClick={goBack}>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button size="lg" type="submit">
                    Continue to Payment
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
                <h2 className="font-display text-xl text-orange font-bold tracking-tight">
                  Payment
                </h2>
                <p className="text-stone text-xs">
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
                    Place Order - {formatPrice(3939)}
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
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-orange border-t-transparent" />
                <p className="label-tag mt-6 text-stone">
                  Processing your order...
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
