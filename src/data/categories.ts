import type { ProductCategory } from "../types/Product";

export interface CategoryInfo {
  slug: string;
  name: ProductCategory;
  subtitle?: string;
  count?: number;
  badge: string;
  description: string;
  image: string;
  featuredProduct?: string; // slug
  priceRange?: string;
  tag?: string[];
  accentColor?: string;
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const categories: CategoryInfo[] = [
  {
    slug: "home",
    name: "Home & Living",
    subtitle: "Architectural Decon",
    count: 42,
    badge: "Featured",
    description: "Considered objects for compact city living.",
    image: "/images/category/home.jfif",

    featuredProduct: "Frame Wall Shelf",
    priceRange: "$29 - $300",
    tag: ["new"],
    accentColor: "#D97706",
  },
  {
    slug: "everyday-carry",
    name: "Everyday Carry",
    subtitle: "Tactile EDC & Pocket Gear",
    count: 28,
    badge: "Trending",
    description: "What you reach for on your way out the door.",
    image: "/images/category/everyday-carry.png",

    featuredProduct: "Core Everyday Backpack",
    priceRange: "$35 - $180",
    tag: ["popular, new"],
    accentColor: "#C95B3E",
  },
  {
    slug: "tech-accessories",
    name: "Tech Accessories",
    subtitle: "Workstations & Studio Sound",
    count: 42,
    badge: "Featured",
    description:
      "Smart devices essential accessories, and everyday tech for a more connected life.",
    image: "/images/category/tech.png",

    featuredProduct: "Wireless Headphone",
    priceRange: "$65 - $420",
    tag: ["popular"],
    accentColor: "#2563EB",
  },
  {
    name: "Travel",
    slug: "travel",
    subtitle: "Modular Bags & Luggage",
    count: 19,
    badge: "Best Seller",

    description:
      "Thoughtful gear for smoother journeys, from everyday commutes to long trips.",
    image: "/images/category/travel.png",

    featuredProduct: "Sling Travel Duffel",
    priceRange: "$80 - $343",
    tag: ["popular"],
    accentColor: "#6B705C",
  },
  {
    slug: "tools",
    name: "Tools",
    subtitle: "Precision Utilitarian Hardware",
    count: 14,
    badge: "Limited",
    description: "Dependable hardware for fixes big and small.",
    image: img("1581092160607-ee22621dd758"),
    featuredProduct: "Torque Compact Wrench",
    priceRange: "$45 - $213",
    tag: ["new"],
    accentColor: "#7C3AED",
  },
  {
    slug: "lighting",
    name: "Lighting",
    subtitle: "Ambient Desk & Floor Glow",
    count: 22,
    badge: "New Arrival",

    description: "Warm, directable light for work and rest.",
    image: "/images/category/lighting.png",
    featuredProduct: "Urban Desk Lamp",
    priceRange: "$79 - $310",
    tag: ["new"],
    accentColor: "#B86B3D",
  },
  {
    slug: "storage",
    name: "Storage",
    subtitle: "",
    count: 12,
    badge: "Best Seller",
    description: "Modular systems that keep small spaces sharp.",
    image: "/images/category/storage.jfif",

    featuredProduct: "Modular Drawer Bin",
    priceRange: "$79 - $310",
    tag: ["sale"],
    accentColor: "#DB2777",
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    subtitle: "Modern Lifestyle",
    count: 5,
    badge: "new",
    description: "Finishing pieces for how you actually live.",
    image: img("1600369672770-985fd30004eb"),
    featuredProduct: "Ceramic Pour-Over Set",
    priceRange: "$45 - $130",
    tag: ["new", "sale"],
    accentColor: "#7C3AED",
  },
];

export const categorySlug = (name: ProductCategory): string => {
  return categories.find((c) => c.name === name)?.slug ?? "";
};
