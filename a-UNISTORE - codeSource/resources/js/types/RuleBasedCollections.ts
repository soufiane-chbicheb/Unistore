

interface CollectionPayload {
  id: number;
  key: 'deals' | 'curated' | 'category' | 'new_arrivals';
  name: string;
  slug : string ;
  active: boolean;
  layout_config: {
    displayLimit: number;
    gap: number;
    paddingInline: number;
  };
  card_config: {
    aspectRatio: string;
    borderRadius: number;
    showPrice: boolean;
    showBadge: boolean;
    textAlign: 'left' | 'center';
    hoverEffect: 'zoom' | 'scrim' | 'none';
  };
  rules: {
    id: string;
    field: string;
    operator: string;
    value: string;
    label?: string;
  }[];
}

type CardConfig = CollectionPayload['card_config'];
type Theme = Record<string, string>;