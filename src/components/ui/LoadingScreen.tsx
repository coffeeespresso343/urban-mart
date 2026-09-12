import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-paper-dim">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-0.5 text-2xl font-body font-semibold tracking-tight">
          <span className="text-orange">Urban</span>
          <span className="text-ink">Mart</span>
        </div>

        <div className="mt-7 h-1 w-24 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full w-1/2 rounded-full bg-orange"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
