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
      <div className="container-edge grid grid-cols-2 gap-6 sm:grid-cols-4">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.ttile}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex flex-col items-start gap-3
          border border-white/60 bg-white/70 rounded-lg p-3"
          >
            <span className="h-8 w-8 rounded-xl bg-orange/10 flex items-center justify-center">
              <b.icon
                className="h-5 w-5 text-orange"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <h3 className="text-sm font-semibold">{b.ttile}</h3>
            <p className="text-xs leading-relaxed text-stone">
              {b.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyUrbanMart;
