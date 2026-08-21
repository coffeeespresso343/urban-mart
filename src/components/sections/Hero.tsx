import { motion } from "framer-motion";
import { ArrowRight, Package, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageWithFallback from "../ui/ImageWithFallback";
import hero from "../../assets/hero.avif";
import { Button } from "../ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0  bg-[radial-gradient(circle_at_15%_20%,rgba(208,106,58,0.14),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-linear-to-r from-transparent via-paper/10 to-transparent" />
      <div
        className="container-edge grid min-h-[58vh] grid-cols-1 items-center gap-10
      py-10 lg:min-h-[90vh] lg:grid-cols-2 lg:py-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ease }}
          className="relative z-10 order-2 max-w-2xl lg:order-1"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-4 bg-orange" />
            <span className="label-tag  text-orange">
              Curated essentials / SS26
            </span>
          </div>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.98] tracking-[-0.055em]">
            Built for
            <br />
            <span className="text-orange">City Life</span>.
          </h1>
          <p className="mt-6 max-w-md text-base text-stone-light sm:text-lg">
            Discover practical, considered products for work, travel, home, and
            everything in between.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              variant="primary"
              onClick={() => navigate("/shop")}
              className="min-w-[10rem] justify-center px-6 py-3.5"
            >
              Shop now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/shop?sort=newest")}
              className="min-w-[11rem] justify-center px-6 py-3.5 border-paper/15 text-paper hover:border-paper/30 hover:bg-paper/10"
            >
              New Arrivals
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: ease }}
            className="mt-8  max-w-lg grid grid-cols-3 border-t border-white/10 pt-6"
          >
            <div className="flex gap-2">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              <div>
                <p className="label-tag text-paper">Fast</p>
                <p className="mt-1 text-xs text-stone">Shipping</p>
              </div>
            </div>
            <div className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              <div>
                <p className="label-tag text-paper">Secure</p>
                <p className="mt-1 text-xs text-stone">Checkout</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              <div>
                <p className="label-tag text-paper">Curated</p>
                <p className="mt-1 text-xs text-stone">Products</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: ease }}
          className="relative order-1 rounded-2xl aspect-4/3 w-full overflow-hidden border border-paper/10 bg-ink-soft shadow-2xl lg:order-2 lg:aspect-auto lg:h-[76vh]"
        >
          <ImageWithFallback
            src={hero}
            alt="City street at dust, representing modern urban living"
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/55 via-transparent to-transparent lg:bg-linear-to-r lg:from-ink/60 lg:via-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease }}
            className="absolute bottom-4 left-4  border border-white/15 bg-paper/5 backdrop-blur-sm p-4 shadow-xl
          sm:bottom-6 sm:left-6 sm:right-auto rounded-xl"
          >
            <div className="flex flex-col">
              <span className="label-tag text-orange">Featured drop</span>
              <p className="mt-1 font-display text-sm">Everyday, upgraded.</p>
              <p className="mt-1 text-xs text-stone-light">
                New pieces for the way you move.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
