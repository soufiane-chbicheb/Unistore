import { Category , Cover , Video } from "../inventoryTypes";
import { Variant } from "./productVariantType";

export interface ProductBackendProps {
    children : React.ReactNode ;
    options : any
    [key: string]: any; 
}

