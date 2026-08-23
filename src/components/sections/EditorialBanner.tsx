import { motion } from "framer-motion";
import ImageWithFallback from "../ui/ImageWithFallback";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import company from "../../assets/company.avif";

const EditorialBanner = () => {
  return (
    <section className="container-edge bg-paper-dim py-20 sm:py-28">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative col-span-1 rounded-2xl aspect-4/3 overflow-hidden bg-paper-dim lg:col-span-7"
        >
          <ImageWithFallback
            src={company}
            alt="Minimal workspace with essential everyday objects"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-1 lg:col-span-5 lg:pl-8"
        >
          <span className="label-tag text-orange">The Philosophy</span>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
            Essentials
            <br />
            <span className="text-orange">Refined</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone">
            Every product in the catalog earns its place through use, not trend.
            We tested for durability, edit for clutter, and design for the way a
            city actually moves.
          </p>

          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="/shop"
            className="label-tag mt-8 inline-flex items-center gap-2 border-b-2 border-ink pb-1
          font-semibold hover:text-orange hover:border-orange"
          >
            Explore the Collection{" "}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialBanner;
