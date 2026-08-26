import { Crown, Hourglass, PackageX, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "ink" | "orange" | "warn" | "good" | "stone";

const toneClasses: Record<Tone, string> = {
  ink: "bg-ink/10 text-orange",
  orange: "bg-paper/60 text-orange",
  warn: "bg-warn/70 text-paper",
  good: "bg-paper/70 text-orange",
  stone: "bg-paper-dim/50 text-error border border-line-light",
};

const badgeIcon: Record<string, ReactNode> = {
  "best seller": <Crown size={12} strokeWidth={2.25} />,
  bestseller: <Crown size={12} strokeWidth={2.25} />,
  new: <Sparkles size={12} strokeWidth={2.25} />,
  limited: <Hourglass size={12} strokeWidth={2.25} />,
  "sold out": <PackageX size={12} strokeWidth={2.25} />,
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
  const label =
    typeof children === "string" ? children.trim().toLowerCase() : "";
  const icon = badgeIcon[label];
  return (
    <span
      className={`label-tag rounded-2xl backdrop-blur-sm inline-flex items-center gap-1 px-2 py-1 font-semibold ${
        toneClasses[tone]
      } ${className}`}
    >
      {icon} {children}
    </span>
  );
};

export default Badge;
