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
    name: "Home",
    slug: "home",
    description: "Considered objects for compact city living.",
    image: img("1567416880385-6158327d05d6"),
  },
  {
    name: "Everyday Carry",
    slug: "everyday-carry",
    description: "What you reach for on your way out the door.",
    image: img("1594299447935-e5b840f54b9b"),
  },
  {
    name: "Tech Accessories",
    slug: "tech-accessories",
    description: "Gear that keeps your setup fast and tidy.",
    image: img("1749048575579-c6f995615893"),
  },
  {
    name: "Travel",
    slug: "travel",
    description: "Built to move — carry-on ready, city tested.",
    image: img("1448582649076-3981753123b5"),
  },
  {
    name: "Tools",
    slug: "tools",
    description: "Dependable hardware for fixes big and small.",
    image: img("1756027583186-a04a19e4f6ce"),
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "Warm, directable light for work and rest.",
    image: img("1605194004886-56d82f482d53"),
  },
  {
    name: "Storage",
    slug: "storage",
    description: "Modular systems that keep small spaces sharp.",
    image: img("1583686298564-46fbffda0707"),
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Finishing pieces for how you actually live.",
    image: img("1600369672770-985fd30004eb"),
  },
];

export const categorySlug = (name: ProductCategory): string => {
  return categories.find((c) => c.name === name)?.slug ?? "";
};
