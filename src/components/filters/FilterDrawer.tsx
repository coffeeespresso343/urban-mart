import { AnimatePresence, motion } from "framer-motion";
import type { ProductFilters } from "../../utils/filters";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import { Button } from "../ui/Button";
import { useEffect } from "react";

const FilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  resultCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onReset: () => void;
  resultCount: number;
}) => {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[95] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/50"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-lg bg-paper"
          >
            <div className="flex items-center justify-between border-b border-r-line-light px-6 py-4">
              <span className="label-tag font-semibold">Filter &amp; Sort</span>
              <button
                onClick={onClose}
                className="h-7 w-7 bg-paper-dim rounded-full flex items-center justify-center active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterSidebar
                filters={filters}
                onChange={onChange}
                onReset={onReset}
              />
            </div>

            <div className="border-t border-line-light px-6 py-4">
              <Button
                size="lg"
                disabled={resultCount <= 0}
                className="w-full disabled:cursor-not-allowed"
                onClick={onClose}
              >
                {resultCount <= 0
                  ? "No products match"
                  : `View ${resultCount} products`}
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default FilterDrawer;
