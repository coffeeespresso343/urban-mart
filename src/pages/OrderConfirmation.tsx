import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Order } from "../types/Order";
import { Navigate, useNavigate } from "react-router-dom";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { formatPrice } from "../utils/currency";
import { Button } from "../components/ui/Button";

const OrderConfirmation = () => {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("urban-mart-last-order");
      setOrder(raw ? (JSON.parse(raw) as Order) : null);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) return null;
  if (order === null) return <Navigate to="/404" replace />;

  return (
    <div className="container-edge py-16 sm:py-24">
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: 95 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-good/10"
        >
          <Check className="h-7 w-7 text-good" strokeWidth={2.5} />
        </motion.div>

        <h1 className="mt-6 font-display text-3xl font-black text-good tracking-tight sm:text-4xl">
          Order confirmed
        </h1>
        <p className="mt-3 text-sm text-stone">
          Thanks for your order, {order.shippingAddress.firstName}.
        </p>
        <p className="label-tag mt-4 text-orange">Order #{order.id}</p>
      </div>

      <div className="mx-auto mt-12 max-w-lg rounded-xl border border-line-light">
        <div className="divide-y divide-line-light">
          {order.items.map((item) => (
            <div
              key={`${item.product.id}-${item.color ?? ""}`}
              className="flex items-center gap-4 p-4"
            >
              <div className="h-16 w-16 rounded-md shrink-0 overflow-hidden bg-paper-dim">
                <ImageWithFallback
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="label-tag text-stone">Qty {item.quantity}</p>
              </div>
              <span className="price text-sm font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-paper-dim rounded-b-xl flex items-center justify-between  p-4 text-base font-semibold">
          <span className="">Total</span>
          <span className="price">{formatPrice(order.totals.total)}</span>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-lg grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl bg-paper-dim/50 p-4">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-stone" />
          <div>
            <p className="label-tag text-stone">Shipping Address</p>
            <p className="mt-1 text-sm">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}{" "}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-paper-dim/50 p-4">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-stone" />
          <div>
            <p className="label-tag text-stone">Delivery</p>
            <p className="mt-1 text-sm">{order.shippingMethod}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone">
              <Package className="h-3.5 w-3.5" />
              Estimated {order.estimatedDelivery}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button size="lg" variant="primary" onClick={() => navigate("/shop")}>
          Contine Shopping <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
