import { Minus, Plus } from "lucide-react";
import React from "react";

const QuantitySelector = ({
  quantity,
  onChange,
  max = 99,
  size = "md",
}: {
  quantity: number;
  onChange: (next: number) => void;
  max?: number;
  size?: "sm" | "md";
}) => {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center border border-line-light">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className={`flex ${dim} items-center justify-center text-ink transition-colors
        hover:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="price w-10 text-center text-sm font-medium">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`flex ${dim} items-center justify-center text-ink transition-colors
        hover:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
