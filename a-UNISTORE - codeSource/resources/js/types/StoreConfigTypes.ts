import { Category } from "./inventoryTypes";
import {  ThemeMode, ThemePalette, ThemeStyle } from "./ThemeTypes";

export type LayoutStyle = "grid" | "list" | "mansonry" | "premium" ;



export type LayoutCardsDataType = {
  style : LayoutStyle 
  label : LayoutStyle 
  image : string 

}

export type ThemeCardsDataType = {
  style : ThemeStyle
  label : ThemeStyle 
  image : string 

}





export interface StoreConfigType {  
    currentThemeStyle : ThemeStyle // is the theme name
    currentThemeMode : ThemeMode 
    currentTheme  : ThemePalette // this is real theme has colors 
    currentLayoutStyle : LayoutStyle 
    currentCardConf : CardConfig

}

export type StoreConfigAction =
  | { type: "SET_LAYOUT"; payload: LayoutStyle }
  | { type: "SET_THEME_MODE"; payload: ThemeMode }
  | { type: "SET_THEME_STYLE"; payload: ThemeStyle }
  | { type: "SET_CARD"; payload:  CardConfig};


export type CardOption = "card-1" | "card-2" | "card-3" | "card-4" | "card-5" | "card-6" 
export type CardConfig = {
  cardId: CardOption;
  
  // 1. Card Container Settings
  internalPadding: 'tight' | 'normal' | 'loose' | string;
  borderCornerStyle: 'sharp' | 'slightly-rounded' | 'extra-rounded';
  borderThickness: 'none' | 'thin' | 'thick';
  shadow: 'none' | 'subtle' | 'deep';
  hoverAnimation: 'none' | 'lift' | 'zoom' | 'shadow';
  textAlignment: 'left' | 'center' | 'right';

  // 2. Media (Image) Settings
  imageVisibility: boolean;
  aspectRatio: '1:1' | '3:4' | '4:3' | string;
  imageFitting: 'cover' | 'contain';
  imageCornerRounding: 'match' | 'sharp' | 'circle';
  imageHoverEffect: 'none' | 'zoom';

  // 3. Component Ordering & Visibility
  // Array of component keys in order
  visibleComponents: string[];

  // 4. Typography & Sizing Scales
  titleScale: 'small' | 'medium' | 'large';
  titleWeight: 'normal' | 'medium' | 'bold';
  titleLineLimit: number; // 0 for full, 1, 2
  priceSize: 'normal' | 'large' | 'extra-large';

  // 5. Overlays & Floating Elements
  showBadges: boolean;
  badgePlacement: 'top-left' | 'top-right' | 'bottom-left';
  badgeStyle: 'solid' | 'pill' | 'outline';
  showWishlist: boolean;
  wishlistPlacement: 'top-right' | 'top-left';
  wishlistIcon: 'heart' | 'star' | 'ribbon';

  // 6. Primary Action Button Settings
  buttonPresence: 'always' | 'hover' | 'hide';
  buttonWidth: 'full' | 'auto';
  buttonTheme: 'primary' | 'secondary' | 'outline';
  buttonIconBehavior: 'text' | 'icon' | 'both';
  buttonClickAction: 'cart' | 'quick-view' | 'page';

  // Legacy fields (keeping for compatibility during transition if needed)
  showPrice: boolean;
  showRating: boolean;
  isRounded: boolean;
  showBorder: boolean;
};



