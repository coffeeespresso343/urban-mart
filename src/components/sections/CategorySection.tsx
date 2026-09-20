import { AnimatePresence, motion } from "framer-motion";
import { categories, type CategoryInfo } from "../../data/categories";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Layers,
  LayoutGrid,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

const FILTERS = [
  { id: "all", label: "All Items" },
  { id: "popular", label: "Popular" },
  { id: "new", label: "New" },
  { id: "sale", label: "Sale" },
];

// const FEATURED_SLUG = [
//   "everyday-carry",
//   "home",
//   "tech-accessories",
//   "travel",
//   "tools",
//   "lighting",
// ];

const CategorySection = () => {
  const CATEGORIES = categories;

  const [activeFilter, setActiveFilter] = useState("all");
  const [layoutMode, setLayoutMode] = useState<"bento" | "grid" | "carousel">(
    "bento",
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(
    null,
  );
  const [carouselIndex, setCarouselIndex] = useState(0);

  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return CATEGORIES;

    return CATEGORIES.filter((category) =>
      category.tag?.includes(activeFilter),
    );
  }, [activeFilter]);

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % filteredCategories.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex(
      (prev) =>
        (prev - 1 + filteredCategories.length) % filteredCategories.length,
    );
  };

  return (
    <section
      id="categories"
      className="container-edge min-h-screen w-full bg-ink text-[#f0f0f4] transition-colors duration-500 font-sans selection:bg-orange-500 selection:text-white py-5"
    >
      <main className="max-w-7xl mx-auto py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase
            tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Deparments</span>
            </div>
            <h2 className="font-black text-3xl sm:text-5xl tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-2 text-base max-w-xl text-stone">
              Explore our precision-engineered essentials, crafted for modern
              lifestyle, work setups, and travel.
            </p>
          </div>

          {/**Filters & Layout View */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="p-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setActiveFilter(filter.id);
                      setCarouselIndex(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                        : "text-stone hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/**Layout Mode Toggles */}
            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
              <button
                type="button"
                title="Bento Grid View"
                onClick={() => setLayoutMode("bento")}
                className={`p-2 rounded-2xl text-xs transition-all active:scale-95 ${
                  layoutMode === "bento"
                    ? "bg-orange-500 text-white"
                    : "text-stone hover:text-current"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>

              <button
                type="button"
                title="Equal Grid View"
                onClick={() => setLayoutMode("grid")}
                className={`p-2 rounded-2xl text-xs transition-all active:scale-95 ${
                  layoutMode === "grid"
                    ? "bg-orange-500 text-white"
                    : "text-stone hover:text-current"
                }`}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                title="Carousel View"
                onClick={() => setLayoutMode("carousel")}
                className={`p-2 rounded-2xl text-xs transition-all active:scale-95 ${
                  layoutMode === "carousel"
                    ? "bg-orange-500 text-white"
                    : "text-stone hover:text-current"
                }`}
              >
                <Layers className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {layoutMode === "bento" && (
            <motion.div
              key="bento-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: ease }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredCategories.map((cat, index) => {
                const isHero = index === 0;

                return (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                      ease: ease,
                    }}
                    className={`group relative bg-[#14161d] border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-orange-500/50
                  hover:shadow-2xl hover:shadow-orange-500/10 ${
                    isHero
                      ? "md:col-span-2 md:row-span-2 min-h-[420px]"
                      : "min-h-[300px]"
                  }`}
                  >
                    <div className="absolute inset-0 w-full overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/**Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {cat.badge}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
                        {cat.count} Products
                      </span>
                    </div>

                    {/**Btns */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 text-white flex flex-col justify-end">
                      <p className="text-xs uppercase font-bold tracking-widest text-orange-400 mb-1">
                        {cat.subtitle}
                      </p>

                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3
                            className={`font-black tracking-tight ${isHero ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"}`}
                          >
                            {cat.name}
                          </h3>
                          <p
                            className={`mt-2 text-xs sm:text-sm text-stone-300 max-w-lg line-clamp-2 ${isHero ? "block" : "hidden sm:block"}`}
                          >
                            {cat.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20
                        flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                        >
                          <ArrowUpRight className="h-5 w-5" />
                        </button>
                      </div>

                      {isHero && (
                        <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between text-shadow-2xs text-stone gap-2">
                          <span className="flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-orange-400" />
                            Featured:{" "}
                            <strong className="text-white">
                              {cat.featuredProduct}
                            </strong>
                          </span>
                          <span className="font-mono bg-white/10 px-2.5 py-1 rounded-md">
                            {cat.priceRange}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {layoutMode === "grid" && (
            <motion.div
              key="equal-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: ease }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCategories.map((cat) => (
                <div
                  key={cat.slug}
                  className="group relative bg-[#14161d] border border-white/10 rounded-3xl overflow-hidden
                  aspect-[4/3] transition-all duration-500 hover:shadow-xl hover:bg-orange-500/40"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
                      {cat.count} Items
                    </span>
                    <span
                      className="h-2.5 w-2.5 rounded-full shadow-lg"
                      style={{
                        backgroundColor: cat.accentColor,
                      }}
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white z-10">
                    <h3 className="text-xl font-bold">{cat.name}</h3>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                      {cat.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className="mt-4 w-full py-2.5 rounded-xl bg-white/10 hover:bg-ink/60 text-white text-sm font-semibold backdrop-blur-md
                      border border-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      Explore {cat.name}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {layoutMode === "carousel" && (
            <motion.div
              key="carousel-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: ease }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="relative rounded-3xl bg-[#14161d] border border-white/10 overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
                <img
                  src={filteredCategories[carouselIndex].image}
                  alt={filteredCategories[carouselIndex].name}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />

                <div
                  className="absolute inset-y-0 left-0 p-8 sm:p-12 z-10 text-white max-w-xl
                flex flex-col justify-center"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-dark">
                    0{carouselIndex + 1} / 0{filteredCategories.length} +{" "}
                    {filteredCategories[carouselIndex].badge}
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black mt-2">
                    {filteredCategories[carouselIndex].name}
                  </h3>
                  <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed">
                    {filteredCategories[carouselIndex].description}
                  </p>

                  <div className="mt-6 flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() =>
                        setSelectedCategory(filteredCategories[carouselIndex])
                      }
                    >
                      <span>
                        Explore {filteredCategories[carouselIndex].count} Items
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={handlePrevCarousel}
                    className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border
                  border-white/20 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextCarousel}
                    className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border
                  border-white/20 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ ease }}
              className={`relative z-10 max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border overflow-hidden 
                bg-[#14161d] text-white border-white/20
              }`}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                aria-label="Close Modal"
                className="absolute top-2 right-2 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/70 text-white backdrop-blur-md">
                  {selectedCategory.count} Items Available
                </span>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                {selectedCategory.subtitle}
              </span>
              <h3 className="text-2xl font-black mt-1">
                {selectedCategory.name}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed text-stone`}>
                {selectedCategory.description}
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block">
                    Featured Hardware
                  </span>
                  <span className="font-bold text-sm">
                    {selectedCategory.featuredProduct}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                  <span>Go to Shop</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CategorySection;
