import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useProductUICtx } from '@/contextHooks/product/useProductUICtx';
import { Tag as TagType } from '@/types/tagsTypes';
import { useState, useRef, useEffect, useCallback, RefObject } from 'react';




export const useBasicinfoActions = () => {
  const [tagInput, setTagInput] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<TagType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const tagInputRef = useRef<HTMLInputElement>(null);


  const {setBasicInfoForm  ,  basicInfoForm , tagSuggestionsState : tagSuggestions ,  productData} = useProductDataCtx() 
  const {setIsEditingBasicInfo} = useProductUICtx()
  // Filter suggestions based on input
 
  const addTag = (tag : TagType) => {
            if (!basicInfoForm?.tags?.some((t) => Number(t.id) === Number(tag.id))) {
                setBasicInfoForm({
                    ...basicInfoForm,
                    tags: [...basicInfoForm.tags, tag],
                });
            }
        };
 
  const handleCancelBasicInfo = () => {
          setIsEditingBasicInfo(false);
          if(!productData) return ;
          setBasicInfoForm({
              name: productData.name,
              brand: productData.brand,
              price: productData.price,
              description: productData.description,
              category: productData.category,
              gender: productData.gender,
              rating_average : productData.rating_average , 
              isFeatured: productData.isFeatured,
              thumbnail: productData.thumbnail,
              tags: productData.tags,
          });
      };
 

  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = tagSuggestions.filter(
        (tag) =>
          tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
          !basicInfoForm?.tags.some((t) => Number(t.id) === Number(tag.id))
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [tagInput, tagSuggestions, basicInfoForm?.tags]);

  const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[selectedSuggestionIndex]);
      } else if (tagInput.trim()) {
        const newTag: TagType = {
          id: Date.now().toString(),
          name: tagInput.trim(),
        };
        addTag(newTag);
      }
      setTagInput('');
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setTagInput('');
    }
  }, [filteredSuggestions, selectedSuggestionIndex, tagInput, addTag]);

  const handleCancelWithConfirmation = useCallback(() => {
    const hasChanges = JSON.stringify(basicInfoForm) !== JSON.stringify(productData);
    
    if (hasChanges) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in';
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <div class="font-bold">Unsaved Changes</div>
            <div class="text-sm">Your changes will be lost</div>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    
    handleCancelBasicInfo();
  }, [basicInfoForm, productData, handleCancelBasicInfo]);

  const handleAddTagFromInput = useCallback(() => {
    if (filteredSuggestions.length > 0) {
      addTag(filteredSuggestions[0]);
    } else if (tagInput.trim()) {
      const newTag: TagType = {
        id: Date.now().toString(),
        name: tagInput.trim(),
      };
      addTag(newTag);
    }
    setTagInput('');
    setShowSuggestions(false);
  }, [filteredSuggestions, tagInput, addTag]);



  const removeTag = (tagId: string) => {
            setBasicInfoForm({
                ...basicInfoForm,
                tags: basicInfoForm?.tags?.filter((t) => Number(t.id) !== Number(tagId)),
            });
        };
    
        
    
  
  return {
    removeTag , 
    addTag , 
    tagInput,
    handleCancelBasicInfo , 
    setTagInput,
    filteredSuggestions,
    showSuggestions,
    setShowSuggestions,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    selectedCategory,
    setSelectedCategory,
    tagInputRef,
    handleTagInputKeyDown,
    handleCancelWithConfirmation,
    handleAddTagFromInput,
  };
};
