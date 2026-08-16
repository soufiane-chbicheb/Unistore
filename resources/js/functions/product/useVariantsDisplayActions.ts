import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { ProductVariant } from "@/types/productsTypes";
import { NicheItem } from "@/context/NicheContext";
import { useNicheCtx } from "@/contextHooks/useStoreConfigCtx";
import { useProductUICtx } from "@/contextHooks/product/useProductUICtx";

type VariantKey = "fashionVariants"  | "parfumesVariants" | "electronicsVariants" ; 
export function useVariantsDisplayActions() {
  const { setVariantForm, setVariantToDelete, productData, setProductData, variantToDelete } = useProductDataCtx();
  const { setEditingVariantId, setDeleteModalOpen, setHasUnsavedChanges, deleteConfirmText, setDeleteConfirmText } =
    useProductUICtx();
  const {currentNiche} = useNicheCtx()
  const editVariant = (variant: ProductVariant) => { 
    
    setEditingVariantId(Number(variant.id));
    setVariantForm({ ...variant });
  };

  const requestDelete = (id: number) => {
    setVariantToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmText.toLowerCase() !== "delete" || variantToDelete === null || !productData) return;

    const nicheToKey: Record<NicheItem, VariantKey> = {
    fashion: "fashionVariants",
    parfumes: "parfumesVariants",
    electronics: "electronicsVariants",
    };

    const niche =  nicheToKey[currentNiche]
    setProductData({
      ...productData,
      [niche]: (productData[niche] ?? [] ).filter((v) => Number(v.id) !== Number(variantToDelete)),
    });

    setDeleteModalOpen(false);
    setDeleteConfirmText("");
    setVariantToDelete(null);
    setHasUnsavedChanges(true);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteConfirmText("");
    setVariantToDelete(null);
  };

  return {
    editVariant,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
