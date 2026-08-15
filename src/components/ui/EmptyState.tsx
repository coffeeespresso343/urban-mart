import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const EmptyState = ({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-paper-dim">
        <Icon
          className="h-10 w-10 text-stone"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
      <h2 className="font-display text-xl text-stone font-bold uppercase tracking-wide">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-stone">{message}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
