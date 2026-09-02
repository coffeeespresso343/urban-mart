import { type LucideIcon } from "lucide-react";

const InputField = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  inputMode,
  Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "tel";
  Icon?: LucideIcon;
}) => {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label-tag text-stone">
        {label}
      </label>
      <div className="relative min-w-0">
        {Icon && (
          <Icon className="pointer-events-none absolute text-stone h-4 w-4 left-2 top-1/2 -translate-y-1/2" />
        )}
        <input
          type={type}
          id={id}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`border bg-paper w-full rounded-md px-8 py-3 text-sm outline-none transition-colors ${
            error ? "border-warn" : "border-line-light focus:border-orange"
          }`}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default InputField;
