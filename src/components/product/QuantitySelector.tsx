import { Minus, Plus } from "lucide-react";

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
  const dim = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  return (
    <div className="inline-flex items-center rounded-full border border-line-light bg-paper p-0.5">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className={`flex ${dim} items-center justify-center rounded-full text-ink transition-all duration-200
        hover:bg-paper-dim active:scale-95 disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="price w-10 text-center text-sm  font-medium">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`flex ${dim} items-center justify-center rounded-full text-ink transition-all duration-200
        hover:bg-paper-dim active:scale-95 disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
