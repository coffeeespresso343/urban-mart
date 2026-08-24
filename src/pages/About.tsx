import { motion } from "framer-motion";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import Img from "../assets/about-hero.jpg";
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

const INFO = [
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping",
    text: "Free standard shipping on orders over $99. Most orders arrive within 3–5 business days; express options are available at checkout.",
  },
  {
    id: "return",
    icon: RotateCcw,
    title: "Returns",
    text: "30 days to return anything unused and in original packaging for a full refund — no questions asked.",
  },
  {
    id: "contact",
    icon: MessageCircle,
    title: "Contact",
    text: (
      <>
        Reach the team anytime at{" "}
        <span className="text-orange">hello@urbanmart.com</span> — we typically
        respond within one business day.
      </>
    ),
  },
];

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
      <section className="relative isolate  overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={Img}
            alt="Urban city at night"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/72 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_32%,rgba(208,106,58,0.18),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_35%,rgba(0,0,0,0.15))]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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

            <h1 className="font-display text-[clamp(3.2rem,7.5vw,6.8rem)] font-black leading-[0.92] tracking-[0.045em] text-paper">
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
              transition={{ delay: 0.42, duration: 0.55 }}
              className="mt-10 flex items-center flex-col lg:flex-row flex-wrap gap-x-6 gap-y-3 border-t border-paper/10 pt-6"
            >
              {[
                "Curated for modern life",
                "Designed to be used",
                "Built to last",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.22em] text-white/80 backdrop-blur-md"
                >
                  {item}
                </span>
              ))}
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
          <h2 className="mt-3 font-display font-semibold text-3xl tracking-tight sm:text-4xl">
            Started on a crowded commute.
          </h2>
          <p className="mt-6 text-sm max-w-xl text-stone leading-7 sm:text-base">
            Urban-Mart began with a life in motion: most everday products are
            built for a life in motion. We set out to build a catalog of
            essentials that could keep up - tools that fold into a pocket,
            lighting that moves with a desk, storage that adapts to a studio
            apartment.
          </p>
          <p className="mt-6 text-sm max-w-xl text-stone leading-7 sm:text-base">
            Every product is selected, tested, and edited by people who actually
            use it on a daily commute, ad weekend trip, or a Tuesday night
            fixing something that broke. If it doesn't hold, it doesn't ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Thoughtfully chosen",
              "Everyday durable",
              "Modern essentials",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-ink/10 bg-ink/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink/70"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-dim shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
        >
          <ImageWithFallback
            src={Img2}
            alt="Urban street scene with cyclist"
            className="aspect-[4/3] h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/14 via-transparent to-transparent" />
        </motion.div>
      </section>

      <section className="bg-paper-dim py-20 sm:py-28">
        <div className="container-edge">
          <div className="max-w-2xl">
            <span className="label-tag text-orange">What We Stand For</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Thoughtful design. Everyday function.
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone sm:text-base">
              We aim for a balance of utility, durability, and a calm visual
              language that feels modern without chasing trends.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-2xl border border-ink/8 bg-white/70 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-orange/10">
                  <v.icon
                    className="h-5 w-5 text-orange transition group-hover:scale-105"
                    strokeWidth={1.7}
                  />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="shipping"
        className="container-edge grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-3"
      >
        {INFO.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_10px_32px_rgba(0,0,0,0.04)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange text-white shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone">{item.text}</p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};

export default About;
