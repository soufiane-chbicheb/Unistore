import { RefObject } from "react";

// Base types



export interface BaseAttribute {
  id: number | string;
  name: string;
}



export interface Color extends BaseAttribute {
    hex: string;
    
}

// Specific attributes inherit from BaseAttribute
export interface Size extends BaseAttribute {}
export interface Fit extends BaseAttribute {}
export interface Material extends BaseAttribute {}
export interface Category extends BaseAttribute {}
export interface Style extends BaseAttribute {}
export interface Season extends BaseAttribute {}
export interface Gender extends BaseAttribute {}

export interface Cover {
    id: string  ;
    url: string ;
}

export type Video = VideoFile | Iframe | null ;


export interface Iframe {
    media_type:  "iframe" ;
    id?: string | null  ;
    url: string | null  ; // this for uploaded file 
}
export interface VideoFile {
    media_type:  "video" ;
    id?: string | null  ;
    url: string | null  ; // this for uploaded file 
    height? : number | null ;
    order? :  number  ;
    size? :  number | null ;
    width? : number | null ;
}
export  interface Country {
    code: string;
    name: string;
}

export type CategoryCode =
  | "fashion"
  | "electronics"
  | "beauty"
  | "perfumes"
  | "home"
  | "sports"
  | "toys"
  | "jewelry"
  | "baby";



// For Inertia useForm (needs index signature)




// Context type
// export interface InventoryContextType {
//     productVariants: ProductVariant[];
//     setProductVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
//     currentVariant: ProductVariant;
//     setCurrentVariant: React.Dispatch<React.SetStateAction<ProductVariant>>;
//     inventoryValid: boolean;
//     setInventoryValid: React.Dispatch<React.SetStateAction<boolean>>;
//     newSelectedColors: Color[];
//     setNewSelectedColors: React.Dispatch<React.SetStateAction<Color[]>>;
//     updateVariantMode: boolean;
//     setUpdateVariantMode: React.Dispatch<React.SetStateAction<boolean>>;
//     isCurrentVariantActive: boolean;
//     setIsCurrentVariantActive: React.Dispatch<React.SetStateAction<boolean>>;
//     variantFormRef: RefObject<HTMLFormElement | null>;
// }