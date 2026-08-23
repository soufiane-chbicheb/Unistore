
import { useEffect, useRef, useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/product/ProductDataContext';
import {  Category, Cover } from '@/types/inventoryTypes';
import { getEditedData, getEmptyInitialProductData } from '@/data/initialProductData';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { CategoriesList } from '../../Pages/admin/pages/categories/Index';
import { ProductBackendProps } from '@/types/products/ProductTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchemaType } from '@/shemas/productSchema';



const ProductDataProvider = ({children , product, nich_cats, shipping_class, badges, variants_options }:ProductBackendProps) => {
    
    const modeForm=  product ? "edit" : "create" ;
  
    const getInitialData = (mode: ModeForm, product?: ProductSchemaType ) => {
      if (mode === "create") return getEmptyInitialProductData();
      if (mode === "edit" && product) return getEditedData(product);
      throw new Error("Invalid state");
    };

    const initialData = getInitialData(modeForm, product);
    const [nicheCategory , setNicheCategory] = useState<Category[]>() ; 
    const draftId = useRef<string | undefined>(product?.id ?? null);
    const { register,reset , handleSubmit, getValues, control, formState  , setError, watch, setValue } = useForm<ProductSchemaType>({
        defaultValues: initialData, 
        resolver: zodResolver(productSchema), 
        mode: "onChange"
    })
    const hasReset = useRef(false);

    useEffect(() => {
        if (initialData && !hasReset.current) {
            reset(initialData);
            hasReset.current = true;
        }
    }, [initialData, reset]);


    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        nicheCategory , setNicheCategory , 
        setValue , getValues , 
        register , handleSubmit , watch , 
        control , formState , setError , 
        nich_cats , shipping_class  , badges , variants_options , 
        draftId
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 
