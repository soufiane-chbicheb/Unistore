
import { ProductDataContext } from '@/context/product/ProductDataContext';
import { useContext } from 'react';



export const useProductDataCtx = () => {
    const ctx =  useContext(ProductDataContext) ; 
    if(!ctx) throw new Error("product data and backend options  context should dbe passed in the provider")
    return ctx
}

