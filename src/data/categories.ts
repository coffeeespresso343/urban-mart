import type { ProductCategory } from "../types/Product";

export interface CategoryInfo {
  name: ProductCategory;
  slug: string;
  description: string;
  image: string;
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const categories: CategoryInfo[] = [
  {
    name: "Everyday Carry",
    slug: "everyday-carry",
    description: "What you reach for on your way out the door.",
    image: img("1622560480605-d83c853bc5c3"),
  },
  {
    name: "Home",
    slug: "home",
    description: "Considered objects for compact city living.",
    image: img("1493666438817-866a91353ca9"),
  },
  {
    name: "Tech Accessories",
    slug: "tech-accessories",
    description: "Gear that keeps your setup fast and tidy.",
    image: img("1587829741301-dc798b83add3"),
  },
  {
    name: "Travel",
    slug: "travel",
    description: "Built to move — carry-on ready, city tested.",
    image: img("1516035069371-29a1b244cc32"),
  },
  {
    name: "Tools",
    slug: "tools",
    description: "Dependable hardware for fixes big and small.",
    image: img("1572981779307-38b8cabb2407"),
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "Warm, directable light for work and rest.",
    image: img("1524678606370-a47ad25cb82a"),
  },
  {
    name: "Storage",
    slug: "storage",
    description: "Modular systems that keep small spaces sharp.",
    image: img("1595428774223-ef52624120d2"),
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Finishing pieces for how you actually live.",
    image: img("1483985988355-763728e1935b"),
  },
];

export const categorySlug = (name: ProductCategory): string => {
  return categories.find((c) => c.name === name)?.slug ?? "";
};
