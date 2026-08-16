import { ProductSchemaType } from "@/shemas/productSchema";
import { Color, Size } from "../inventoryTypes";

export type Variant = ProductSchemaType["variants"][number]


type VariantAttr = {
    color : Color , 
  } & Record<string, string >