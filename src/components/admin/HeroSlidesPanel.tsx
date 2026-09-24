import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import type { HeroSlide } from "../../types/HeroSlide";
import {
  deleteHeroSlide,
  fetchAllHeroSlides,
  updateHeroSlide,
} from "../../lib/heroSlides";
import { useUIStore } from "../../hooks/uiStore";
import { Button } from "../ui/Button";
import { Eye, EyeOff, Loader, Pencil, Plus, Star, Trash2 } from "lucide-react";
import ImageWithFallback from "../ui/ImageWithFallback";
import HeroSlideModal from "./HeroSlideModal";

const MAX_ACTIVE_SLIDES = 4;

const HeroSlidesPanel = ({ products }: { products: Product[] }) => {
  const showToast = useUIStore((s) => s.showToast);

  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isActiving, setIsActiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    fetchAllHeroSlides().then(setSlides);
  };

  useEffect(load, []);

  const activeCount = slides?.filter((s) => s.isActive).length ?? 0;
  const nextPostion = (slides?.length ?? 0) + 1;

  const openCreate = () => {
    setEditingSlide(null);
    setModalOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setModalOpen(true);
  };

  const toggleActive = async (slide: HeroSlide) => {
    if (!slide.isActive && activeCount >= MAX_ACTIVE_SLIDES) {
      showToast(
        `Only ${MAX_ACTIVE_SLIDES} active hero slides allowed - deactive one first`,
        "error",
      );
      return;
    }

    setPendingId(slide.id);
    setIsActiving(true);
    const { error } = await updateHeroSlide(slide.id, {
      isActive: !slide.isActive,
    });

    setPendingId(null);
    setIsActiving(false);

    if (error) {
      return showToast(error, "error");
    }

    load();
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!window.confirm(`Remove "${slide.title}" from hero section?`)) return;

    setPendingId(slide.id);
    setIsDeleting(true);

    const { error } = await deleteHeroSlide(slide.id);
    setPendingId(null);
    setIsDeleting(false);

    if (error) {
      return showToast(error, "error");
    }

    showToast("Hero slide removed", "success");

    load();
  };

  return (
    <div className="mb-6 rounded-2xl border border-admin-border bg-admin-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-admin-gold" />
            <h2 className="text-lg font-bold">Hero Section</h2>
          </div>
          <p className="mt-1 text-sm text-admin-gray">
            {activeCount} of {MAX_ACTIVE_SLIDES} active
          </p>
        </div>
        <Button
          onClick={openCreate}
          disabled={products.length === 0}
          className="bg-admin-blue! border-admin-blue/20! shadow-admin-blue/30!"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Slide
        </Button>
      </div>

      {slides === null ? (
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-admin-active" />
      ) : slides.length === 0 ? (
        <p className="mt-4 text-sm text-admin-gray-light">
          No hero slides yet - add up to {MAX_ACTIVE_SLIDES} to feature products
          on the homepage.
        </p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-admin-border">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-admin-active">
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] sm:text-sm max-w-28 truncate sm:max-w-60 font-medium">
                      {slide.title}
                    </p>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${slide.accentColor}22`,
                        color: slide.accentColor,
                      }}
                    >
                      #{slide.position}
                    </span>
                    {!slide.isActive ? (
                      <span className="rounded-full bg-admin-active px-2 py-0.5 text-xs font-medium text-admin-gray">
                        Inactive
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-[10px] sm:text-xs text-admin-gray-light">
                    {slide.product.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleActive(slide)}
                  disabled={pendingId === slide.id}
                  className="text-admin-gray-light transition-colors hover:text-admin-ink active:scale-95 disabled:opacity-40"
                >
                  {isActiving && pendingId === slide.id ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : slide.isActive ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>

                <button
                  onClick={() => openEdit(slide)}
                  className="text-admin-gray-light transition-colors hover:text-admin-ink active:scale-95 disabled:opacity-40"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDelete(slide)}
                  className="text-error/80 transition-colors hover:text-error active:scale-95 disabled:opacity-40"
                >
                  {isDeleting && pendingId === slide.id ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <HeroSlideModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          load();
        }}
        editingSlide={editingSlide}
        products={products}
        nextPostion={nextPostion}
      />
    </div>
  );
};

export default HeroSlidesPanel;
