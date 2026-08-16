import { Color } from "../inventoryTypes";
import { ProductBase } from "./ProductTypes";
import { ProductVariant } from "./productVariantType";


export interface ElectronicsAttributes {
  category: "electronics";
  batteryLife?: string;
  connectivity?: string[];
  voltage?: string;
  warrantyMonths?: number;
  model?: string;
  brandSeries?: string;
  techSpecs?: Record<string, string>;
}

