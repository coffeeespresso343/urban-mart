import { motion } from "framer-motion";
import { categories } from "../../data/categories";
import { Link } from "react-router-dom";
import ImageWithFallback from "../ui/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";

const FEATURED_SLUG = [
  "everyday-carry",
  "home",
  "tech-accessories",
  "travel",
  "tools",
  "lighting",
];

const CategorySection = () => {
  const featured = categories.filter((c) => FEATURED_SLUG.includes(c.slug));

  return (
    <section
      id="categories"
      className="container-edge bg-paper-dim py-20 sm:py-28"
    >
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="label-tag text-orange">Browse</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Shop by Category
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((category, index) => (
          <motion.div
            key={category.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
          >
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to={`/shop?category=${category.slug}`}
              className="group relative block rounded-md aspect-4/3 overflow-hidden bg-ink"
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover opacity-80 transition-all duration-700
                ease-out group-hover:opacity-60"
              />

              <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="max-w-[85%] text-sm text-stone-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {category.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <h3
                    className="font-display text-xl text-paper transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  >
                    {category.name}
                  </h3>
                  <ArrowUpRight
                    className="h-5 w-5 text-paper transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
