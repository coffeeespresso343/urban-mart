import type { Product } from "./Product";

export interface HeroSlide {
  id: string;
  tagline: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  thumb: string;
  accentColor: string;
  position: number;
  isActive: boolean;
  product: Product;
}
