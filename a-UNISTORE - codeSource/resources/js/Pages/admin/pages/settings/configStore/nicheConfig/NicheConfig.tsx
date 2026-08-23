import React, { useState } from "react";
import StorePreview from "../layoutConfig/StorePreview";
import { useNicheWarning } from "@/functions/product/useNicheWarning";
import NicheWarning from "./components/NicheWarning";
import TogglableCard, { TogglableOption } from "@/components/partials/TooglableCard";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { LayoutStyle, NicheCardsDataType, NicheItem } from "@/types/StoreConfigTypes";


const niches : NicheCardsDataType[] = [
  {
    style: "fashion",
    label: "fashion",
    image: "/images/fashionNiche.png",
    info: "Fashion products like clothing & accessories. Backend provides related layouts and options.",
  },
  {
    style: "perfumes",
    label: "perfumes",
    image: "/images/perfumesNiche.png",
    info: "Perfume products. Backend ensures only perfume-related options and layouts.",
  },
  {
    style: "electronics",
    label: "electronics",
    image: "/images/electronicsNiche.png",
    info: "Electronics products. Backend provides electronics-specific options and store structure.",
  },
];

const mockProducts: any = {
  fashion: [
    { id: 1, title: "T-Shirt", price: 25 },
    { id: 2, title: "Dress", price: 60 },
  ],
  perfume: [
    { id: 3, title: "Floral Perfume", price: 40 },
    { id: 4, title: "Citrus Perfume", price: 35 },
  ],
  electronics: [
    { id: 5, title: "Smartphone", price: 400 },
    { id: 6, title: "Headphones", price: 80 },
  ],
};

const NicheConfig = () => {

  const {state : {currentTheme ,  currentNiche} , dispatch} = useStoreConfigCtx()
  const [previewNicheStyle, setPreviewNicheStyle] = useState<NicheItem>(currentNiche);
  const { isVisible, dismiss } = useNicheWarning();
  const handleNicheToggle = (nicheId: NicheItem) => {
    dispatch({type : "SET_NICHE" , payload : nicheId})
    setPreviewNicheStyle(nicheId);
  };

  return (
    <div>
      <NicheWarning isVisible={isVisible} onDismiss={dismiss} />

      <div className="flex gap-6">
        <div className="w-1/4 p-5 overflow-y-auto   w-[70%]">
          <h2 className="text-xl font-semibold mb-4">Niches</h2>
          <div className="grid grid-cols-2  gap-4">
            {niches.map((niche) => {
              const isCurrent = currentNiche === niche.style;
              const isPreview = previewNicheStyle === niche.style;
              return (
                 
                   <TogglableCard  key={niche.style} 
                     handleOptionToggle={handleNicheToggle} 
                     isCurrent={isCurrent} 
                     isPreview={isPreview}
                     changeToggledStyle={(style:NicheItem) => setPreviewNicheStyle(style)}  
                     option={niche}
                    />
              );
            })}
          </div>
        </div>

      
        <div className="w-1/4 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-bold mb-4" style={{color : currentTheme.text}}>Store Preview</h3>
          <StorePreview products={mockProducts[previewNicheStyle] || []}  />
        </div>
      </div>
    </div>
  );
};

export default NicheConfig;



