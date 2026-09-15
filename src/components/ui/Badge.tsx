import {
  Clock3,
  Crown,
  PackageX,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type Tone =
  | "ink"
  | "orange"
  | "warn"
  | "good"
  | "error"
  | "stone"
  | "blue"
  | "purple"
  | "green"
  | "pink";

const toneClasses: Record<Tone, string> = {
  ink: "bg-ink/60 text-paper border border-ink/20",
  orange: "bg-orange/80 text-paper border border-orange/60 backdrop-blur-sm",
  warn: "bg-warn/50 text-ink border border-warn/60",
  good: "bg-good/50 text-ink border border-good/70 ",
  error: "bg-admin-pink-light text-admin-pink",
  stone: "bg-paper-dim/70 text-ink border border-line-light",
  blue: "bg-admin-blue-light text-admin-blue",
  purple: "bg-admin-purple-light text-admin-purple",
  green: "bg-admin-green-light text-admin-green",
  pink: "bg-admin-pink-light text-admin-pink",
};

const badgeIcons: Record<string, ReactNode> = {
  "best seller": <Crown size={12} strokeWidth={2.5} />,
  bestseller: <Crown size={12} strokeWidth={2.5} />,
  new: <Sparkles size={12} strokeWidth={2.5} />,
  limited: <Clock3 size={12} strokeWidth={2.5} />,
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
  const icon = badgeIcons[label];
  return (
    <span
      className={`text-xs rounded-full backdrop-blur-sm inline-flex items-center gap-1 px-2.5 py-1 font-medium capitalize ${
        toneClasses[tone]
      } ${className}`}
    >
      {icon} {children}
    </span>
  );
};

export default Badge;

const badgeIcon: Record<string, LucideIcon> = {
  "best seller": Crown,
  bestseller: Crown,
  new: Sparkles,
  limited: Clock3,
  "sold out": PackageX,
};

export const BadgeIcon = ({
  badge,
  tone = "ink",
  className = "",
}: {
  badge?: string;
  tone?: Tone;
  className?: string;
}) => {
  const label = badge?.trim().toLowerCase() ?? "";
  const Icon = badgeIcon[label];

  if (!Icon) return null;

  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
        toneClasses[tone]
      } ${className}`}
    >
      <Icon size={10} strokeWidth={2.5} />
    </span>
  );
};
