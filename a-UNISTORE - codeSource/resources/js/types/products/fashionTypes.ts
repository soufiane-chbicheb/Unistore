import { Size , Fit , Color , Material , Cover , Gender, Style, Season, Country } from "../inventoryTypes";
import { ProductBase } from "./ProductTypes";
import { ProductVariant } from "./productVariantType";

export interface FashionAttributes {
  materials : Material[]
  fits: Fit[]
  gender : Gender[]
  styles: Style[],
  season: Season[],
}

