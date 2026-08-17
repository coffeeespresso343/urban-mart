import type { SortOption } from "../../types/Product";
import { ChevronDown } from "lucide-react";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: Hight to Low" },
  { value: "rating", label: "Highest Rated" },
];

const SortSelect = ({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) => {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>

      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="label-tag appearance-none border-none bg-transparent px-1 py-1 pr-6 font-semibold text-ink focus:outline-none"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-ink" />
    </div>
  );
};

export default SortSelect;
