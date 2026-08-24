import {  Material  , Gender} from "../inventoryTypes";
import { ProductBasicInfoData } from "./ProductTypes";
import { ProductVariant } from "./productVariantType";

// 9️⃣ Baby
export interface BabyProduct extends ProductBasicInfoData {
  category: "baby";
  ageRange?: string; // e.g., "0-12 months"
  materials?: Material[];
  gender?: Gender[];
  variants?: ProductVariant[];
}
