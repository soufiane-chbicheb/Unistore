import type { Product, CollectionSortable } from '@/types/homeEditor';
import { ThemePalette } from '@/types/ThemeTypes';
import { getProductPlaceholder } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
  cardConfig: CollectionSortable['card_config'];
  isLast: boolean;
  theme: ThemePalette;
};

export function ProductCard({ product, cardConfig, isLast, theme }: ProductCardProps) {
  const thumbnail = (product.thumbnail && (product.thumbnail.startsWith('http') || (product.thumbnail.startsWith('/storage/') && !product.thumbnail.includes('/storage/products/')))) 
    ? product.thumbnail 
    : getProductPlaceholder(product.id);

  return (
    <div style={{
      flex: 1,
      borderRight: isLast ? 'none' : `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ aspectRatio: cardConfig.aspectRatio, background: theme.card, overflow: 'hidden' }}>
        <img
          src={thumbnail}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
      </div>
      <div style={{
        padding: '8px 10px 10px',
        background: theme.bgSecondary,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        <div style={{
          fontSize: 11.5,
          color: theme.text,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {product.name}
        </div>
        {cardConfig.showPrice && (
          <div style={{ fontSize: 11, color: theme.priceText, fontWeight: 500 }}>
            ${product.price}
          </div>
        )}
      </div>
    </div>
  );
}
