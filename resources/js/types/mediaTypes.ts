import { style } from "framer-motion/client";


export interface ImagesMap {
    [key: string]: File | string | null;
    
}

export interface MediaContextType {
    images: ImagesMap;
    setImages: React.Dispatch<React.SetStateAction<ImagesMap>>;
    imagesPlaceHolders: number[];
    setImagesPlaceHolders: React.Dispatch<React.SetStateAction<number[]>>;
    imagesValid: boolean;
    setImagesValid: React.Dispatch<React.SetStateAction<boolean>>;
    isVariantCoverPreview: boolean;
    setIsVariantCoverPreview: React.Dispatch<React.SetStateAction<boolean>>;
    fileToPass: File | null;
    setFileToPass: React.Dispatch<React.SetStateAction<File | null>>;
    isAllCoversDeleted: boolean;
    setIsAllCoversDeleted: React.Dispatch<React.SetStateAction<boolean>>;
    placeHolderNotFilled: boolean;
    setPlaceHolderNotFilled: React.Dispatch<React.SetStateAction<boolean>>;
}



export type FlagMedia = 
  | 'thumbnail'       // main product image
  | 'gallery'           // gallery or variant cover images
  | 'video'           // product video
  | 'avatar'     // customer or user avatar
  | 'banner'    
