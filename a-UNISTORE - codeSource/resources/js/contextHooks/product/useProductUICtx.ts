

import { ProductUIContext } from '@/context/product/ProductUIContext';
import { useContext } from 'react';




export const useProductUICtx = () => {
    const ctx =  useContext(ProductUIContext) ; 
    if(!ctx) throw new Error("product data context should dbe passed in the provider")
    return ctx
}

