import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";

export interface ImagePreviewItem {
  key: string;
  src: string;
  onRemove: () => void;
}
const ImageUploadField = ({
  previews,
  onFilesSelected,
}: {
  previews: ImagePreviewItem[];
  onFilesSelected: (files: File[]) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length > 0) {
      onFilesSelected(files);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="images" className="label-tag text-stone">
        Images
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer rounded-lg flex-col items-center justify-center gap-2 border border-dashed px-4 py-8
        text-center transition-colors ${
          isDragging
            ? "border-ink bg-paper-dim"
            : "border-line-light hover:border-ink"
        }`}
      >
        <ImagePlus className="h-5 w-5 text-stone" />
        <p className="text-sm text-stone">
          Drag &amp; drop images, or click to browse
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = ""; // lets the same file be picked again later if removed
          }}
          className="hidden"
        />
      </div>

      {previews.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {previews.map((preview) => (
            <div
              key={preview.key}
              className="group relative h-20 w-20 overflow-hidden bg-paper"
            >
              <img
                src={preview.src}
                className="h-full w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  preview.onRemove();
                }}
                className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-paper opacity-50 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageUploadField;
