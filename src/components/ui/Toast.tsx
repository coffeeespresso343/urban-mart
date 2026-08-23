import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { useUIStore, type ToastMessage } from "../../hooks/uiStore";
import { useEffect } from "react";

const ICONS = {
  success: Check,
  error: AlertTriangle,
  info: Info,
};

const ACCENTS = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-warn",
};

const ToastItem = ({ toast }: { toast: ToastMessage }) => {
  const dismissToast = useUIStore((s) => s.dismissToast);
  const Icon = ICONS[toast.variant] ?? Info;
  const accent = ACCENTS[toast.variant] ?? ACCENTS.info;

  useEffect(() => {
    const timeout = window.setTimeout(() => dismissToast(toast.id), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast.id, dismissToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      className="group relative flex items-center w-full overflow-hidden rounded-xl border border-white/50 bg-paper/70 text-ink shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
      {/* <div className={`absolute inset-0 left-0 w-[4px] bg-current ${accent}`} /> */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 3.2, ease: "linear" }}
        style={{ transformOrigin: "left" }}
        className={`absolute left-0 bottom-0 right-0 h-0.5 bg-current ${accent}`}
      />

      <div className="flex min-w-0 flex-1 items-center gap-4 px-2 py-3.5">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/20 ${accent}`}
        >
          <Icon
            className="h-4.5 w-4.5 shrink-0"
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </div>
        <p className="text-[12px]">{toast.message}</p>
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        className="mr-2 flex items-center justify-center h-7 w-7 ml-2 shrink-0 rounded-full text-ink/50 transition-all duration-200 hover:bg-white/10 hover:text-ink active:scale-90"
      >
        <X className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </motion.div>
  );
};

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div
      className="pointer-events-none fixed top-24 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm
       sm:right-6 sm:top-28 sm:w-96"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
