import type { ProductFilters } from "../../utils/filters";
import { categories } from "../../data/categories";
import { Star } from "lucide-react";

const RATING_OPTIONS = [4, 3, 2];

const FilterSidebar = ({
  filters,
  onChange,
  onReset,
}: {
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onReset: () => void;
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="label-tag font-semibold">Filters</h2>
        <button className="label-tag text-orange hover:underline">Reset</button>
      </div>

      <fieldset>
        <legend className="label-tag mb-3 text-stone">Category</legend>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-ink" />
              {cat.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-tag mb-3 text-stone">
          Price - up to ${filters.maxPrice}
        </legend>
        <input
          type="range"
          min={0}
          max={200}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => {
            onChange({ ...filters, maxPrice: Number(e.target.value) });
          }}
          className="w-full accent-ink"
        />
      </fieldset>

      <fieldset>
        <legend className="label-tag mb-3 text-stone">Rating</legend>
        <div className="flex flex-col gap-2.5 text-sm">
          {RATING_OPTIONS.map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="rating"
                className="h-4 w-4 accent-ink"
              />
              <span className="flex items-center gap-1">
                {rating}
                <Star className="h-3.5 w-3.5 fill-ink text-ink" />
              </span>
              &amp; up
            </label>
          ))}

          <label className="flex items-center gap-2.5 text-sm">
            <input type="radio" name="rating" className="h-4 w-4 accent-ink" />
            Any rating
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-tag mb-3 text-stone">Availablity</legend>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-ink" />
          In stock only
        </label>
      </fieldset>
    </div>
  );
};

export default FilterSidebar;
