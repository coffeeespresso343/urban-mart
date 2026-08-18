import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-orange border border-orange text-paper rounded-md shadow-sm shadow-orange/10 transition-all duration-300 active:scale-[0.98] hover:border-orange-dark hover:shadow-lg hover:shadow-orange/15 hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange disabled:hover:border-orange",
  secondary:
    "bg-ink text-paper border border-ink rounded-md transition-all duration-300 active:scale-[0.98] hover:text-orange hover:bg-ink-elevated hover:border-ink-elevated disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "bg-paper-dim rounded-md border border-orange/5 transition-all duration-300 active:scale-[0.98] text-orange hover:border-line-light",
  outline:
    "bg-transparent rounded-md transition-all duration-300 active:scale-[0.98] text-ink border border-ink hover:text-paper hover:bg-ink hover:border-ink",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`label-tag inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-colors
      duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
