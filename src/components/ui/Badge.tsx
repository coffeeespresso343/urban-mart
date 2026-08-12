import type { ReactNode } from "react";

type Tone = "ink" | "orange" | "warn" | "good" | "stone";

const toneClasses: Record<Tone, string> = {
  ink: "bg-ink text-paper",
  orange: "bg-orange text-paper",
  warn: "bg-warn text-paper",
  good: "bg-good text-paper",
  stone: "bg-paper-dim text-ink border border-line-light",
};

const Badge = ({
  children,
  tone = "ink",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) => {
  return (
    <span
      className={`label-tag inline-flex items-center gap-1 px-2.5 py-1 font-semibold ${
        toneClasses[tone]
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
