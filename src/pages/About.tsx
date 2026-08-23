import { motion } from "framer-motion";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import Img from "../assets/city-skyline.avif";
import Img2 from "../assets/street-scene.avif";
import {
  Building2,
  Hammer,
  Leaf,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const VALUES = [
  {
    icon: Hammer,
    title: "Useful",
    desc: "If it doesn't earn its place in daily use, it doesn't make the catalog.",
  },
  {
    icon: ShieldCheck,
    title: "Durable",
    desc: "Every product is stress-tested before it ships to a single customer.",
  },
  {
    icon: Building2,
    title: "Thoughtfully Designed",
    desc: "Form follows function - nothing is decorative for its own sake.",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    desc: "Recycled materials and durable construction, chosen over disposability.",
  },
];

const About = () => {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={Img}
            alt="Urban city at might"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-ink/95 to-ink/35" />
          <div className="absoulte inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_35%,rgba(208,106,58,0.14),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

        <div className="container-edge relative z-10 flex min-h-[68svh] items-end py-20 sm:min-h-[68vh] sm:py-24 lg:min-h-[72vh] lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: ease }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-px w-4 bg-orange" />
              <span className="label-tag text-orange">About Urban-Mart</span>
            </motion.div>

            <h1 className="font-display text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.92] tracking-[0.045em] text-paper">
              Better everyday
              <br />
              things for a
              <br />
              <span className="text-orange">better way to live.</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-7 max-w-xl text-base leading-7 text-stone-light sm:text-lg sm:leading-8"
            >
              We believe everyday products should be useful, durable, and
              thoughtfully designed - made to support the way you work, move,
              travel, and live.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex items-center flex-wrap gap-x-6 gap-y-3 border-t border-paper/10 pt-5"
            >
              <span className="label-tag text-stone">
                Curated for modern life
              </span>
              <span className="h-1 w-1  rounded-full bg-orange sm:block" />
              <span className="label-tag text-stone">Designed to be used</span>
              <span className="h-1 w-1  rounded-full bg-orange sm:block" />
              <span className="label-tag text-stone">Built to last</span>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute hidden lg:block pointer-events-none right-[4vw] -translate-y-1/2 font-display text-[18rem] font-black leading-[0.08em] text-paper/10">
          01
        </div>
      </section>

      <section className="container-edge grid grid-cols-1 gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="label-tag text-orange">Brand Story</span>
          <h2 className="mt-3 font-display font-bold text-3xl tracking-tight sm:text-4xl">
            Started on a crowded commute.
          </h2>
          <p className="mt-6 text-sm text-stone leading-relaxed">
            Urban-Mart began with a life in motion: most everday products are
            built for a life in motion. We set out to build a catalog of
            essentials that could keep up - tools that fold into a pocket,
            lighting that moves with a desk, storage that adapts to a studio
            apartment.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            Every product is chosen, tested, and edited by people who actually
            use it on a daily commute, ad weekend trip, or a Tuesday night
            fixing something that broke. If it doesn't hold, it doesn't ship.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="aspect-4/3 rounded-xl bg-paper-dim overflow-hidden"
        >
          <ImageWithFallback
            src={Img2}
            alt="Urban street scene with cyclist"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </section>

      <section className="bg-paper-dim py-20 sm:py-28">
        <div className="container-edge">
          <h2 className="mb-12 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col border border-white/9 p-3 rounded-xl bg-paper"
              >
                <span className="h-7 w-7 flex items-center justify-center bg-orange/10 rounded-lg">
                  <v.icon className="h-5 w-5 text-orange" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-display text-sm font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-stone">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="shipping"
        className="container-edge grid grid-cols-1 gap-10 py-20 sm:py-28 lg:grid-cols-3"
      >
        <div className="bg-white/70 rounded-xl border-l-4 border-orange/70 p-3">
          <span className="h-7 w-7 flex items-center justify-center bg-orange/90 rounded-lg">
            <Truck className="h-5 w-5 text-white" />
          </span>
          <h3 className="mt-2 font-display text-xl text-orange font-bold tracking-tight">
            Shipping
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone">
            Free standard shipping on orders over $99. Most orders arrive within
            3-5 business days; express options options are available at
            checkout.
          </p>
        </div>

        <div
          id="return"
          className="bg-white/70 border-l-4 border-orange/70 rounded-xl p-3"
        >
          <span className="h-7 w-7 flex items-center justify-center bg-orange/90 rounded-lg">
            <RotateCcw className="h-5 w-5 text-white" />
          </span>
          <h3 className="mt-2 font-display text-xl text-orange font-bold tracking-tight">
            Returns
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone">
            30 days to return anything, unused and in original packaging, for a
            full refund - no questions asked.
          </p>
        </div>

        <div
          id="contact"
          className="bg-white/70 border-l-4 border-orange/70 rounded-xl p-3"
        >
          <span className="h-7 w-7 flex items-center justify-center bg-orange/90 rounded-lg">
            <MessageCircle className="h-5 w-5 text-white" />
          </span>
          <h3 className="mt-2 font-display text-xl text-orange font-bold tracking-tight">
            Contact
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone">
            Reach the team anytime at{" "}
            <span className="text-orange">hello@urbanmart.com</span> - we
            typically respond within one business day.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
