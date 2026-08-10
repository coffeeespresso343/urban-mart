import { ImageOff } from "lucide-react";
import { useState, type ImgHTMLAttributes } from "react";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}
const ImageWithFallback = ({
  src,
  alt,
  className,
  ...props
}: ImageWithFallbackProps) => {
  const [failed, setFailed] = useState(false);

  if (failed)
    return (
      <div
        className={`flex items-center justify-center bg-paper-dim text-stone ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </div>
    );

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;
