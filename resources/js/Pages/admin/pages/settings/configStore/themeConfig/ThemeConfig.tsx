import React, { useEffect, useState } from "react";
import TogglableCard from "@/components/partials/TooglableCard";
import { ThemeCardsDataType } from "@/types/StoreConfigTypes";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import SkeletonLayout from "@/components/partials/previewSkeletons/SkeletonLayout";
import StorePreview from "../layoutConfig/StorePreview";
import { ThemeMode, ThemePalette, ThemeStyle } from "@/types/ThemeTypes";
import { currentThemeExample } from "@/data/currentTheme";
import { MoonIcon, SunIcon } from "lucide-react";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";

const themes : ThemeCardsDataType[] = [
  {
    style:  "luxuryNoir", 
    label : "luxuryNoir" ,
    image: "/images/fashionNiche.png",
  },
  {
    style: 'softPastel',
    label: 'softPastel',
    image: "/images/perfumesNiche.png",
  },
  {
    style: 'orangeNight',
    label: 'orangeNight',
    image: "/images/orangeNight.png",
  }
];

interface ThemeConfigProps {
  contextType?: 'store' | 'admin';
}

const ThemeConfig = ({ contextType = 'store' }: ThemeConfigProps) => {
  const storeCtx = useStoreConfigCtx();
  const adminCtx = useAdminThemeCtx();

  const { state, dispatch } = contextType === 'store' ? storeCtx : adminCtx;
  const { currentThemeStyle, currentThemeMode, currentTheme } = state;
  const currentLayoutStyle = (state as any).currentLayoutStyle || 'grid';

  const [previewThemeStyle, setPreviewThemeStyle] = useState<ThemeStyle>(currentThemeStyle);
  const [previewThemeMode, setPreviewThemeMode] = useState<ThemeMode>(currentThemeMode);
  const [previewThemePalette, setPreviewThemePalette] =
      useState<ThemePalette>(currentTheme);
   const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      setPreviewThemePalette(currentThemeExample[previewThemeStyle as ThemeStyle][previewThemeMode as ThemeMode])
  }, [previewThemeMode , previewThemeStyle]);

  useEffect(() => {
     setPreviewThemeMode(currentThemeMode)
  }, [currentThemeMode]);

  useEffect(() => {
    setPreviewThemeStyle(currentThemeStyle);
  }, [currentThemeStyle]);

  const handleThemeToggle = (style: ThemeStyle) => {
    dispatch({type : "SET_THEME_STYLE" , payload : style})
    setPreviewThemeStyle(style);
  };

  const toggleThemeMode = () => {
       const newMode = previewThemeMode === "dark" ? "light" : 'dark';
       dispatch({ type: "SET_THEME_MODE", payload: newMode });
       setPreviewThemeMode(newMode);
  }

  return (
    <div>
      <div className="flex gap-6">
        <div className="w-1/4 p-5 overflow-y-auto   w-[70%]">
          <h2 className="text-xl font-semibold mb-4">{contextType === 'admin' ? 'Admin Themes' : 'Store Themes'}</h2>
          <div className="grid grid-cols-2  gap-4">
            {themes.map((Theme) => {
              const isCurrent = currentThemeStyle === Theme.style;
              const isPreview = previewThemeStyle === Theme.style;
              return (
                   <TogglableCard  key={Theme.style} 
                     handleOptionToggle={handleThemeToggle} 
                     isCurrent={isCurrent} 
                     isPreview={isPreview}
                     changeToggledStyle={(style:ThemeStyle) => setPreviewThemeStyle(style)}  
                     option={Theme}
                    />
              );
            })}
          </div>
        </div>

            <div className="w-2/4 p-4 rounded-lg border "
            style={{borderColor : currentTheme.border }}
            >
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Preview</h3>
              <button
                onClick={toggleThemeMode}
                className={`
                  p-2 rounded-md text-sm 
                  transition-transform duration-500
                  ${animate ? " rotate-12" : "rotate-0"}
                `}
                style={{background : animate ? currentTheme.accent : currentTheme.accentHover , 
                      color : currentTheme.textInverse
                }}
              >
                {previewThemeMode === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>

            <StorePreview 
             previewThemePalette={previewThemePalette}
            >
              <SkeletonLayout 
                previewThemePalette={previewThemePalette}
                previewThemeMode={previewThemeMode}
                previewLayoutStyle={currentLayoutStyle}
                previewThemeStyle={previewThemeStyle}
              />
            </StorePreview>
          </div>
      </div>
    </div>
  );
};

export default ThemeConfig;
