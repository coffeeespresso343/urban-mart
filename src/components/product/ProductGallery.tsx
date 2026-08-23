import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ImageWithFallback from "../ui/ImageWithFallback";
import { ZoomIn } from "lucide-react";

const ProductGallery = ({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) => {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex shrink-0 gap-3 overflow-x-auto sm:flex-col">
        {images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            aria-label={`View image ${index + 1} of ${productName}`}
            aria-current={active === index}
            onClick={() => setActive(index)}
            className={`relative h-16 w-16 rounded-md shrink-0 overflow-hidden border transition-colors ${
              active === index
                ? "border-orange"
                : "border-line-light opacity-70 hover:opacity-100"
            }`}
          >
            <ImageWithFallback
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <div
        onClick={() => setZoomed((z) => !z)}
        role="button"
        tabIndex={0}
        aria-label={zoomed ? "Zoom out" : "Zoom in on product image"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setZoomed((z) => !z);
        }}
        className="group relative rounded-xl flex-1 cursor-zoom-in overflow-hidden bg-paper-dim"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="aspect-square w-full h-full"
          >
            <ImageWithFallback
              src={images[active]}
              alt={`${productName} - view ${active + 1}`}
              className={`h-full w-full object-cover transition-transform duration-500 ${
                zoomed ? "scale-150" : "scale-100"
              }`}
            />
          </motion.div>
        </AnimatePresence>
        <span
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/30
        text-ink opacity-70 sm:opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
};

export default ProductGallery;
