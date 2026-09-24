import { Check } from "lucide-react";
import ImageWithFallback from "../ui/ImageWithFallback";

const ImagePicker = ({
  label,
  images,
  selected,
  onSelect,
}: {
  label: string;
  images: string[];
  selected: string;
  onSelect: (url: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-admin-gray">{label}</span>
      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onSelect(url)}
            className={`relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
              selected === url
                ? "border-admin-green-light"
                : "border-transparent hover:border-admin-green-light"
            }`}
          >
            <ImageWithFallback
              src={url}
              alt=""
              className="h-full w-full object-cover"
            />
            {selected === url ? (
              <span className="absolute inset-0 flex items-center justify-center bg-admin-ink/40">
                <Check className="h-5 w-5 text-admin-green" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImagePicker;
