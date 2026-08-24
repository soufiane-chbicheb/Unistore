import SkeletonLayout  from "@/components/partials/previewSkeletons/SkeletonLayout";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { ThemePalette } from "@/types/ThemeTypes";
import React from "react";




const  StorePreview = ({children , previewThemePalette} :{children : React.ReactNode  , previewThemePalette : ThemePalette}) => {
  const {state : {currentTheme}} = useStoreConfigCtx()
  
  return (
    <div
      className={`h-[520px] overflow-y-auto rounded-2xl border p-4 transition-all`}

        style={{color : previewThemePalette?.text ?? currentTheme.text , background : previewThemePalette?.bg ?? currentTheme.bg , borderColor : currentTheme.border}}
    >
      
     {children}
        
    </div>
  );
};

export default StorePreview;
