import { motion } from "framer-motion";
import { RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";

const BENEFITS = [
  {
    icon: Truck,
    ttile: "Fast Shipping",
    description:
      "Orders ship within 24 hours and arrives in 3-5 business days.",
  },
  {
    icon: ShieldCheck,
    ttile: "Secure Checkout",
    description: "Encrypted payments and buyer protection on every order",
  },
  {
    icon: Sparkles,
    ttile: "Curated Products",
    description: "Every item is tested and edited before it makes the catalog.",
  },
  {
    icon: RotateCcw,
    ttile: "Easy Returns",
    description: "30 days to return anything, no questions asked.",
  },
];

const WhyUrbanMart = () => {
  return (
    <section className="border-y bg-paper-dim border-line py-16">
      <div className="container-edge grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.ttile}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-start flex-col gap-3
          border border-white/30 bg-white/40 rounded-lg p-6"
          >
            <b.icon
              className="h-6 w-6 text-orange shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            <div className="mt-2 flex flex-col gap-3">
              <h3 className="text-sm font-semibold">{b.ttile}</h3>
              <p className="text-xs leading-relaxed text-stone">
                {b.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyUrbanMart;
