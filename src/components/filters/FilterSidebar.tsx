import type { ProductFilters } from "../../utils/filters";
import { categories } from "../../data/categories";
import type { ProductCategory } from "../../types/Product";
import ProductRating from "../product/ProductRating";
import { useEffect } from "react";

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
  // console.log("FilterSidebar render:", filters);
  const toggleCategory = (category: ProductCategory) => {
    const has = filters.categories.includes(category);

    onChange({
      ...filters,
      categories: has
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="label-tag font-semibold">Filters</h2>
        <button
          onClick={onReset}
          className="label-tag text-orange hover:underline"
        >
          Reset
        </button>
      </div>

      <fieldset>
        <legend className="label-tag mb-3 text-stone">Category</legend>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="h-4 w-4 accent-orange"
              />
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
                value={rating}
                checked={filters.minRating === rating}
                onChange={() => {
                  onChange({ ...filters, minRating: rating });
                }}
                className="h-4 w-4 accent-orange"
              />
              <span className="flex items-center gap-1">
                {rating}
                <ProductRating rating={rating} />
              </span>
              &amp; up
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="radio"
              name="rating"
              value={0}
              checked={filters.minRating === 0}
              onChange={() => onChange({ ...filters, minRating: 0 })}
              className="h-4 w-4 accent-orange"
            />
            Any rating
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-tag mb-3 text-stone">Availablity</legend>
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="h-4 w-4 accent-orange"
          />
          In stock only
        </label>
      </fieldset>
    </div>
  );
};

export default FilterSidebar;
