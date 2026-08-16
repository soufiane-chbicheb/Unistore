export interface BannerMedia {
  id: number;
  url: string;
  media_type: string; // e.g., 'image', 'video'
  collection?: string;
}

export interface BannerElement {
  text: string;
  color: string;
  visible: boolean;
  bg_color?: string; 
  text_color?: string;
  link : string
}

export interface BannerSlot {
  slot_key: 'left' | 'middle' | 'right'; // Identifying the slot
  is_visible: boolean;
  width: string; // e.g., '35', '50', '100'
  bg_color?: string;
  
  // The actual media objects from your BelongsTo relations
  main_media?: BannerMedia | null;
  secondary_media?: BannerMedia | null;
  
  elements?: {
    settings?: {
      vertical_position?: 'top' | 'center' | 'bottom';
      horizontal_position?: 'left' | 'center' | 'right';
      text_align?: 'left' | 'center' | 'right';
    };
    eyebrow: BannerElement;
    title: BannerElement;
    
    paragraph: BannerElement;
    button: BannerElement;
  };
}

export interface Banner {
  id: number;
  name: string;
  key: string;
  slug: string;
  direction: 'ltr' | 'rtl';
  is_active: boolean;
  
  // Styling settings
  aspect_ratio: string;
  border_radius: string;
  bg_color: string;

  // The collection of slots belonging to this banner
  slots: BannerSlot[];
}