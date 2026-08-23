
import { ProductUIContext } from '@/context/product/ProductUIContext';
import { ImagePreviewItem } from '@/types/mediaTypes';
import { useState } from 'react';










const ProductUIProvider = ({children}:{children:React.ReactNode}) => {
        
            const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
            const [editingVariantId, setEditingVariantId] = useState<number | null>(
                null
            );
            const [isVariantFormModalOpen , setIsVariantFormModalOpen] = useState<boolean>(true)
           
            const [deleteModalOpen, setDeleteModalOpen] = useState(false);
            const [showToast, setShowToast] = useState(false);
            const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
 
            // stores the variant active form images for preview only 
            const [uiActiveVariantFormImages2Preview, setUiActiveVariantFormImages2Preview] = useState<ImagePreviewItem[]>([]);
            
            const [isVariantFormLoading , setIsVariantFormLoading] = useState(true)
            const [deleteConfirmText , setDeleteConfirmText] =  useState<string>("")
            return (
        <ProductUIContext.Provider value={{ 
            isVariantFormLoading , setIsVariantFormLoading ,  
            uiActiveVariantFormImages2Preview, setUiActiveVariantFormImages2Preview , deleteConfirmText , setDeleteConfirmText , isEditingBasicInfo, setIsEditingBasicInfo , editingVariantId, setEditingVariantId , 
            deleteModalOpen, setDeleteModalOpen  , showToast, setShowToast , isVariantFormModalOpen , setIsVariantFormModalOpen , 
            hasUnsavedChanges, setHasUnsavedChanges
        }}>
         {children}
        </ProductUIContext.Provider>
    )
}

export default ProductUIProvider ; 
