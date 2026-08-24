import { Color, Cover, Fit, Material, Season, Style } from "./inventoryTypes";
import { ImagePreviewItem } from "./mediaTypes";
import { Country, FashionVariant, Gender } from "./productsTypes";
import { Tag } from "./tagsTypes";

export interface ProductBaseShow {
  id?: string | null;
  name: string;
  brand: string;
  price: string;
  compareAtPrice?: string;
  costPrice?: string;
  category: { id: string; name: string }[];
  description: string;
  rating_average?: number;
  thumbnail?: Cover | ImagePreviewItem | null;
  video?: Cover | ImagePreviewItem | null;
  covers: (Cover | ImagePreviewItem)[];
  tags: Tag[];
  isFeatured?: boolean;
  sku?: string;
  stockQuantity?: number | string;
  releaseDate?: string;
}



export interface FashionProductShow extends ProductBaseShow {
  niche: "fashion";
  materials: Material[];
  fits: Fit[];
  gender: Gender[];
  styles: Style[];
  season: Season[];
  colors : Color[]
  madeCountry?: Country | null;
  variants: FashionVariant[];
}

export interface PerfumesProductShow extends ProductBaseShow {
  niche: "perfumes";
  concentration?: "EDT" | "EDP" | "Parfum" | "Cologne";
  fragranceFamily?: "fresh" | "woody" | "oriental" | "floral" | "aromatic";
  topNotes?: string[];
  middleNotes?: string[];
  baseNotes?: string[];
  volumes: { volume: number; price: number }[];
  quantity: number;
  gender?: Gender[];
}

export interface ElectronicsProductShow extends ProductBaseShow {
  niche: "electronics";
  specs?: Record<string, string | number>;
  warranty?: string;
  model?: string;
  colors?: string[];
}
