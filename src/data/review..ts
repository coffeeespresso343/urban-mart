import type { Product, ProductReview } from "../types/Product";

const AUTHORS = [
  "J. Morrow",
  "A. Kessler",
  "T. Nakamura",
  "S. Ibarra",
  "R. Voss",
  "M. Delgado",
  "C. Okafor",
  "L. Bergström",
];

const TITLES_POSITIVE = [
  "Exactly what I needed",
  "Solid build quality",
  "Better than expected",
  "Worth every dollar",
  "Now I own two",
];

const TITLES_MIXED = [
  "Good, with one caveat",
  "Does the job",
  "Pretty happy overall",
];

const BODY_TEMPLATES = [
  "I've been using this for a few weeks now and it's held up well to daily use. Fits the rest of my setup nicely.",
  "Shipping was fast and the packaging felt premium. The product itself is well made — you can tell it's not a throwaway piece.",
  "Bought this after comparing a few options and glad I went with Urban-Mart. The details are thoughtful.",
  "It's a little smaller than I expected from the photos, but that's actually worked out fine for how I use it.",
  "Been recommending this to everyone who asks what I'm carrying. Simple, functional, no complaints.",
];

export function getReviewsForProduct(product: Product): ProductReview[] {
  const count = Math.min(5, Math.max(3, Math.round(product.reviewCount / 40)));

  return Array.from({ length: count }).map((_, i) => {
    const seed = product.id * 7 + i;
    const rating = Math.max(
      3,
      Math.min(5, Math.round(product.rating) - (i % 2)),
    );
    const titles = rating >= 4.5 ? TITLES_POSITIVE : TITLES_MIXED;

    const likeCount = 90 + ((seed * 47) % 271);

    return {
      id: `${product.id}-review-${i}`,
      author: AUTHORS[seed % AUTHORS.length],
      rating,
      date: new Date(
        2026,
        (seed % 6) + 1,
        ((seed * 3) % 27) + 1,
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      title: titles[seed % titles.length],
      body: BODY_TEMPLATES[seed % BODY_TEMPLATES.length],
      verified: seed % 3 !== 0,
      likeCount,
    };
  });
}
