import { Crown, Hourglass, PackageX, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "ink" | "orange" | "warn" | "good" | "stone";

const toneClasses: Record<Tone, string> = {
  ink: "bg-ink/90 text-paper border border-ink",
  orange: "bg-orange/80 text-paper border border-orange/60 backdrop-blur-sm",
  warn: "bg-warn/90 text-ink border border-warn/95",
  good: "bg-good/50 text-ink border border-good/60 ",
  stone: "bg-paper-dim/70 text-orange border border-line-light",
};

const badgeIcon: Record<string, ReactNode> = {
  "best seller": <Crown size={12} strokeWidth={2.5} />,
  bestseller: <Crown size={12} strokeWidth={2.5} />,
  new: <Sparkles size={12} strokeWidth={2.5} />,
  limited: <Hourglass size={12} strokeWidth={2.5} />,
  "sold out": <PackageX size={12} strokeWidth={2.5} />,
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
      className={`text-xs rounded-full backdrop-blur-sm inline-flex items-center gap-1 px-2.5 py-1 font-semibold ${
        toneClasses[tone]
      } ${className}`}
    >
      {icon} {children}
    </span>
  );
};

export default Badge;
