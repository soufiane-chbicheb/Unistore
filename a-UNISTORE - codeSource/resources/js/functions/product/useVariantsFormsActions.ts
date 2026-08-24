import { useProductUICtx } from "@/contextHooks/product/useProductUICtx";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { FashionVariant } from "@/types/productsTypes";
import { v4  as uuidByV4} from "uuid";




export const useVariantsFormsActions = () => {
   
    const {editingVariantId , setEditingVariantId , setHasUnsavedChanges  , setIsVariantFormModalOpen , setUiActiveVariantFormImages2Preview } = useProductUICtx()

    const  {setVariantForm , variantForm   , setProductData } = useProductDataCtx();
  
   const handleSaveVariant = () => {
        if (!variantForm || editingVariantId === null) return;

        setProductData(prev => {
           
            if(!prev) return  prev ;
            if(prev.niche !== "fashion" ) return prev ; 
            return {
            ...prev ,
            fashionVariants: prev?.fashionVariants?.map((v) =>
                Number(v.id) === Number(editingVariantId) ? (variantForm as FashionVariant) : v
            ),
        }
        });
        setEditingVariantId(null);
        setVariantForm(null);
        setHasUnsavedChanges(true);
    };

    const handleCancelVariant = () => {
        setEditingVariantId(null);
        setVariantForm(null);
        setIsVariantFormModalOpen(false)
    };
   
   
       
   const onRemoveImage = (coverId : number) => {
            setVariantForm(prev => {
                if(!prev) return prev ; 
    
                if(prev.niche !== "fashion" ) return prev
    
                return {
                    ...prev , 
                 attributes : {
    
                        ...prev.attributes , 
                         covers : prev?.attributes?.covers.filter(c =>   Number(c.id) !== coverId)
                   
                 }
                }
            })
        }
    
    const onRemovePreviewImage = (id : string) => {
        setUiActiveVariantFormImages2Preview(prev => prev.filter(previewItem => previewItem.id !== id))
    }

    
    const onImageUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
      // give it  a random iid\
      const id = uuidByV4()
      const file  = e.target.files?.[0] ;
      if(!file)  return ;
      const url = URL.createObjectURL(file);
      setUiActiveVariantFormImages2Preview(prev => [...prev , {id ,url  , file}])
       e.target.value = "";
    }
    return { 
        onImageUpload , 
        onRemoveImage , 
        onRemovePreviewImage , 
        handleSaveVariant , 
        handleCancelVariant
    }
}