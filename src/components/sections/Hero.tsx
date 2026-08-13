import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ImageWithFallback from "../ui/ImageWithFallback";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        className="container-edge grid min-h-[58vh] grid-cols-1 items-center gap-10
      py-20 lg:min-h-[90vh] lg:grid-cols-2 lg:py-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 order-2 lg:order-1"
        >
          <span className="label-tag mb-6 inline-block text-orange">
            Urban-Mart / SS26 Collection
          </span>
          <h1
            className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight
          sm:text-6xl lg:text-7xl"
          >
            Built for
            <br />
            City Life<span className="text-orange">.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-stone-light">
            Functional essentials designed for the way you move, work, travel,
            and live.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="label-tag inline-flex items-center justify-center bg-paper text-ink px-8 py-4 font-semibold transition-colors hover:bg-orange hover:text-paper"
            >
              Shop Collection
            </Link>
            <Link
              to="/shop?sort=newest"
              className="label-tag inline-flex items-center justify-center gap-2 border border-orange px-8 py-4 font-semibold text-paper transition-colors hover:border-paper"
            >
              Explore New Arrivals{" "}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 aspect-4/3 w-full overflow-hidden lg:order-2 lg:aspect-auto lg:h-[90vh]"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&q=80&auto=format&fit=crop"
            alt="City street at dust, representing modern urban living"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/40 lg:bg-linear-to-r lg:from-ink/60 lg:via-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
