import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container-edge flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span
          className="price block font-display text-8xl font-black text-paper-dim sm:text-9xl"
          aria-hidden="true"
        >
          404
        </span>
        <Compass
          className="mx-auto -mt-6 h-8 w-8 text-cobalt"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h1 className="mt-6 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Lost in the City?
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-stone">
          The page you are looking for doesn't exist.
        </p>
        <Link to="/shop" className="mt-8 inline-block">
          Back to Shop
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
