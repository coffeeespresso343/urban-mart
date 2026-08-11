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
    <section className="border-y border-line py-16">
      <div className="container-edge grid grid-cols-2 gap-6 sm:grid-cols-4">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.ttile}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex flex-col items-start gap-3
          border border-white/[0.07] bg-white rounded-lg p-5"
          >
            <b.icon
              className="h-6 w-6 text-copper"
              strokeWidth={1.75}
              aria-hidden="true"
            />
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
