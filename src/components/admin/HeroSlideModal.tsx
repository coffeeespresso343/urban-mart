import { useEffect, useState, type FormEvent } from "react";
import { useUIStore } from "../../hooks/uiStore";
import type { HeroSlide } from "../../types/HeroSlide";
import type { Product } from "../../types/Product";
import Modal from "../ui/Modal";
import ImagePicker from "./ImagePicker";
import { Button } from "../ui/Button";
import {
  createHeroSlide,
  updateHeroSlide,
  type HeroSlideInput,
} from "../../lib/heroSlides";

const labelClass = "text-xs font-medium text-admin-gray";

interface FormState {
  productId: number | null;
  tagline: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  thumb: string;
  accentColor: string;
  position: number;
  isActive: boolean;
}

const emptyForm = (): FormState => ({
  productId: null,
  tagline: "",
  title: "",
  highlightText: "",
  description: "",
  image: "",
  thumb: "",
  accentColor: "",
  position: 1,
  isActive: true,
});

const slideToForm = (slide: HeroSlide): FormState => ({
  productId: slide.product.id,
  tagline: slide.tagline,
  title: slide.title,
  highlightText: slide.highlightText,
  description: slide.description,
  image: slide.image,
  thumb: slide.thumb,
  accentColor: slide.accentColor,
  position: slide.position,
  isActive: slide.isActive,
});

const HeroSlideModal = ({
  isOpen,
  onClose,

  onSaved,
  editingSlide,
  products,
  nextPostion,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingSlide: HeroSlide | null;
  products: Product[];
  nextPostion: number;
}) => {
  const showToast = useUIStore((s) => s.showToast);

  const [form, setForm] = useState<FormState>(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(
        editingSlide
          ? slideToForm(editingSlide)
          : { ...emptyForm(), position: nextPostion },
      );
    }
  }, [isOpen, editingSlide, nextPostion]);

  const selectedProduct =
    products.find((product) => product.id === form.productId) ?? null;

  const pickProduct = (product: Product) => {
    setForm((f) => ({
      ...f,
      productId: product.id,
      image: product.images[0] ?? "",
      thumb: product.images[0] ?? "",
      title: f.title || product.name,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.productId) errors.product = "Choose a product for this slide";

    if (!form.tagline.trim()) errors.tagline = "Tagline is required";

    if (!form.title.trim()) errors.title = "Title is required";

    if (!form.description.trim())
      errors.description = "Description is required";

    if (!form.image) errors.image = "Pick an image";
    if (!form.thumb) errors.thumb = "Pick a thumbnail";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateForm()) {
      showToast("Please fix highlighted fields", "error");
      return;
    }

    setIsSaving(true);

    const input: HeroSlideInput = {
      productId: form.productId,
      tagline: form.tagline.trim(),
      title: form.title.trim(),
      highlightText: form.highlightText.trim(),
      description: form.description.trim(),
      image: form.image,
      thumb: form.thumb,
      accentColor: form.accentColor,
      position: form.position,
      isActive: form.isActive,
    };

    const { error } = editingSlide
      ? await updateHeroSlide(editingSlide.id, input)
      : await createHeroSlide(input);

    setIsSaving(false);

    if (error) return showToast(error, "error");
    showToast(
      editingSlide ? "Hero slide updated" : "Hero slide added",
      "success",
    );
    onSaved();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onClear={() => setFormErrors({})}
      title={editingSlide ? "Edit Hero Slide" : "Add Hero Slide"}
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[70vh] flex-col gap-4 scrollbar-none overflow-y-auto pr-1"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="hero-product"
            className="text-xs font-medium text-admin-gray"
          >
            Product
          </label>
          <select
            id="hero-product"
            value={form.productId ?? ""}
            onChange={(e) => {
              const product = products.find(
                (product) => product.id === Number(e.target.value),
              );
              if (product) pickProduct(product);
            }}
            className="border border-admin-border bg-admin-card px-3 py-2.5 rounded-lg text-sm outline-none focus:border-admin-ink"
          >
            <option value="" disabled>
              Select a product...
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          {formErrors.product && (
            <p className="mt-0.5 text-xs text-admin-pink">
              {formErrors.product}
            </p>
          )}
        </div>

        {selectedProduct && selectedProduct.images.length > 0 ? (
          <>
            <ImagePicker
              label="Hero Image"
              images={selectedProduct.images}
              selected={form.image}
              onSelect={(url) => setForm((f) => ({ ...f, image: url }))}
            />

            <ImagePicker
              label="Thumbnail Image"
              images={selectedProduct.images}
              selected={form.thumb}
              onSelect={(url) => setForm((f) => ({ ...f, thumb: url }))}
            />
          </>
        ) : null}

        <TextField
          label="Tagline"
          value={form.tagline}
          onChange={(v) =>
            setForm({
              ...form,
              tagline: v,
            })
          }
          error={formErrors.tagline}
        />

        <TextField
          label="Title"
          value={form.title}
          onChange={(v) =>
            setForm({
              ...form,
              title: v,
            })
          }
          error={formErrors.title}
        />

        <TextField
          label="Highlight Text"
          value={form.highlightText}
          onChange={(v) =>
            setForm({
              ...form,
              highlightText: v,
            })
          }
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="hero-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="hero-description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            rows={3}
            className="border border-admin-border bg-admin-card px-3 py-2.5 rounded-lg text-sm outline-none focus:border-admin-ink"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="hero-accent" className={labelClass}>
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="hero-accent"
                type="color"
                value={form.accentColor || "#C96B34"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accentColor: e.target.value,
                  })
                }
                className="h-10 w-12 shrink-0 border border-line-light bg-admin-gray"
              />
              <input
                value={form.accentColor || "#C96B34"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accentColor: e.target.value,
                  })
                }
                className="min-w-0 flex-1 border border-line-light bg-admin-card rounded-lg px-3 py-2.5 text-sm outline-none focus:border-admin-ink"
              />
            </div>
          </div>

          <TextField
            label="Position"
            value={String(form.position)}
            onChange={(v) =>
              setForm({
                ...form,
                position: Number(v) || 1,
              })
            }
            inputMode="numeric"
          />
        </div>

        <label
          htmlFor="hero-slide-active"
          className="flex items-center gap-2 text-xs"
        >
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({
                ...form,
                isActive: e.target.checked,
              })
            }
            className="h-4 w-4 accent-admin-blue"
          />
          Active (shows on the homepage - max 4 active at once)
        </label>

        <Button type="submit" size="lg" isLoading={isSaving} className="mt-2">
          {editingSlide ? "Save Changes" : "Add Slide"}
        </Button>
      </form>
    </Modal>
  );
};

export default HeroSlideModal;

function TextField({
  label,
  value,
  onChange,
  inputMode,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "text" | "numeric";
  error?: string;
}) {
  const id = `hero-field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        className="border border-admin-border rounded-lg bg-admin-card px-3 py-2.5 text-sm outline-none focus:border-admin-ink"
      />
      {error && <p className="mt-0.5 text-xs text-admin-pink">{error}</p>}
    </div>
  );
}
