import { Search, X } from "lucide-react";
import { useRef, type Dispatch, type SetStateAction } from "react";

const POPULAR_SEARCHES = [
  "Home",
  "Lighting",
  "Anchor Key Rack",
  "Travel",
  "Storage",
];

interface HeroBannerProps {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
}

const HeroBanner = ({ searchInput, setSearchInput }: HeroBannerProps) => {
  const searchRef = useRef(null);

  return (
    <div className="bg-linear-to-br from-ink via-ink to-orange text-paper py-12 px-6 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/20 border border-orange/30
           text-orange text-xs font-semibold mb-4 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 bg-orange rounded-full animate-pulse" />
          <span>Spring Collection 2026 Drop</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-paper leading-tight">
          Discover Urban-Mart Essentials.
        </h1>
        <p className="mt-3 text-stone-light text-sm sm:text-base max-w-xl mx-auto">
          Explore curated lifestyle gear, high-performance electronics, and
          premium apparel crafted for perfection.
        </p>

        <div ref={searchRef} className="mt-8 max-w-xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="h-5 w-5 text-stone absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands, or categories..."
              className="w-full bg-ink/10 border border-white/20 rounded-2xl py-3.5 pl-12 pr-10
                text-white placeholder:text-stone-light outline-none focus:ring-2 focus:ring-orange focus:bg-ink/20 transition-all text-sm sm:text-base"
            />

            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 p-1 rounded-full hover:bg-ink/20 text-stone-light hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-paper">
            <span className="text-stone">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setSearchInput(term)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-paper"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
