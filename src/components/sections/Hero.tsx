import { useEffect, useRef, useState, type TouchEvent } from "react";
import type { HeroSlide } from "../../types/HeroSlide";
import { fetchActiveHeroSlides } from "../../lib/heroSlides";
import HeroContent from "../hero/HeroContent";
import HeroImage from "../hero/HeroImage";
import SlideNavigation from "../hero/SlideNavigation";
import QuickViewModal from "../hero/QuickVIewModal";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/Product";
import { Loader2 } from "lucide-react";

const Hero = () => {
  const { addItem } = useCart();
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const addToCartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSlides = async () => {
      try {
        const data = await fetchActiveHeroSlides();

        if (mounted) {
          setSlides(data);
        }
      } catch (err) {
        console.error("Failed to load hero slides: ", err);

        if (mounted) {
          setSlides([]);
        }
      }
    };

    loadSlides();

    return () => {
      mounted = false;
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (addToCartTimer.current) {
        clearTimeout(addToCartTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAutoplay || !slides || slides?.length <= 1) {
      return;
    }
    const interval = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [isAutoplay, slides]);

  const handleAddToCart = (product: Product) => {
    setIsAddedToCart(true);

    addItem(product, 1, product.colors?.[0]);

    if (addToCartTimer.current) {
      clearTimeout(addToCartTimer.current);
    }

    addToCartTimer.current = setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  if (slides === null) {
    return (
      <section className="py-8 w-full flex items-center justify-center bg-ink">
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex] ?? slides[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? 0;
    touchEndX.current = 0;
  };
  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.changedTouches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <>
      <section className="relative isolate w-full overflow-hidden bg-[#0c0d10] text-[#f2f2f5]">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl transition-all duration-700"
          style={{ backgroundColor: currentSlide.accentColor }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/2 h-96 w-96 rounded-full opacity-15 blur-3xl transition-all duration-700"
          style={{ backgroundColor: currentSlide.accentColor }}
        />

        <div className="mx-auto flex min-h-[100vh-80px] max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 sm:py-12">
          <div className="my-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <HeroContent
              slide={currentSlide}
              isAddedToCart={isAddedToCart}
              onAddToCart={handleAddToCart}
              onQuickView={() => setIsQuickViewOpen(true)}
            />

            <HeroImage
              slide={currentSlide}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isAutoplay={isAutoplay}
              onToggleAutoplay={() => setIsAutoplay((prev) => !prev)}
              currentIndex={currentIndex}
              totalSlides={slides.length}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          <SlideNavigation
            slides={slides}
            currentIndex={currentIndex}
            onSelect={setCurrentIndex}
          />
        </div>
      </section>

      {isQuickViewOpen && (
        <QuickViewModal
          slide={currentSlide}
          onClose={() => setIsQuickViewOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default Hero;
