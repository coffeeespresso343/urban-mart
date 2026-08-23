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
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="container-edge relative z-10 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="label-tag text-orange">Our Story</span>
            <h1 className="mt-4 font-display text-4xl font-black leading-[0.95] tracking-wide sm:text-6xl">
              We believe everday products should be useful, durable, and
              thoughtfully designed.
            </h1>
          </motion.div>
        </div>

        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src={Img}
            alt="City skyline at night"
            className="h-full w-full object-cover"
          />
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
