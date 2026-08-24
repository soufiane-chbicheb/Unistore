import { ImagePreviewItem } from "@/types/mediaTypes";
import { createContext } from "react";




interface ProductUIContextProps {
  isEditingBasicInfo: boolean 
  setIsEditingBasicInfo: React.Dispatch<React.SetStateAction<boolean>>
  editingVariantId: number | null 
  setEditingVariantId: React.Dispatch<React.SetStateAction<number | null>>

  deleteModalOpen: boolean
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>

  deleteConfirmText :string
  setDeleteConfirmText  : React.Dispatch<React.SetStateAction<string>>

  showToast: boolean
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>

  hasUnsavedChanges: boolean
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>> 

  isVariantFormModalOpen : boolean 
   setIsVariantFormModalOpen :React.Dispatch<React.SetStateAction<boolean>> 

   uiActiveVariantFormImages2Preview : ImagePreviewItem[]
   setUiActiveVariantFormImages2Preview :React.Dispatch<React.SetStateAction<ImagePreviewItem[]>> 

    isVariantFormLoading : boolean
    setIsVariantFormLoading :  React.Dispatch<React.SetStateAction<boolean>>
}

export const ProductUIContext = createContext<ProductUIContextProps |undefined>(undefined)