import React, { useState } from "react";
import Tabs from "../../products/A_sharedForAllNiches/components/showProductPage/Tabs";
import { CardSim, Grid, List, Palette } from "lucide-react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import NicheConfig from "./nicheConfig/NicheConfig";
import CardsConfig from "./cardsConfig/Components/CardsConfig";
import ThemeOptions from "./themeConfig/ThemeConfig";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import LayoutConfig from "./layoutConfig/LayoutConfig";
import ThemeConfig from "./themeConfig/ThemeConfig";

// Example fake data for preview
const mockProducts = [
  { id: 1, title: "Perfume A", price: 350, rating: 4.5 },
  { id: 2, title: "T-Shirt B", price: 120, rating: 4.2 },
  { id: 3, title: "Bag C", price: 450, rating: 4.8 },
];

export const ConfigureStoreLayout = () => {
    const { state : {currentTheme} } = useStoreConfigCtx();

  const [currentConfig, setCurrentConfig] = useState({
    cardType: "GridCard",
    showPrice: true,
    showRating: true,
    layoutType: "grid",
    theme: "light",
    niche: "fashion",
  });

  const configureTabs = [
    {
      id: "niche",
      label: "Niche",
      Icon: Grid,
      content: (
         <>
          
            <NicheConfig />
      
         </>
      ),
    },
    {
      id: "cards",
      label: "Cards",
      Icon: CardSim,
      content: (
      
         
            <CardsConfig />
    
      
      ),
    },
    {
      id: "layout",
      label: "Layout",
      Icon: List,
      content: (
        
            <LayoutConfig />
       

      ),
    },
    {
      id: "theme",
      label: "Theme",
      Icon: Palette,
      content: (
        
            <ThemeConfig  />
          
      ),
    },
  ];

return (
  <div className="!sticky top-16 z-40  shadow overflow-auto h-[calc(100vh-64px)]"
  style={{background : currentTheme.bg , color : currentTheme.text}}
  >
    <Tabs tabs={configureTabs} defaultTab="niche" />
   </div>
);
  
   
  
};

export default ConfigureStoreLayout;
ConfigureStoreLayout.layout = (page:any) => <AdminLayout children={page} />
