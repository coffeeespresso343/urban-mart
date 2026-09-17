import type { ReactNode } from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${className} rounded-2xl border border-admin-border bg-admin-card p-4 shadow-sm`}
    >
      {children}
    </div>
  );
}
