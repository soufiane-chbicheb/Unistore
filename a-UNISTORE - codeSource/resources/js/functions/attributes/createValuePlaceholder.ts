import { AttributeValue } from "@/Pages/admin/pages/variants/types";


const DEFAULT_PLACEHOLDERS: Record<string, string> = {
  color: 'Red, Blue, Black',
  size: 'S, M, L, XL',
  material: 'Cotton, Denim, Wool',
  fit: 'Slim, Regular, Oversized',
  style: 'Streetwear, Casual, Formal',
  brand: 'Nike, Apple, Samsung',
  model: 'Model A, Model B',
  capacity: '64GB, 128GB, 256GB',
  generic: 'Option 1, Option 2',
};





export function resolveCreateValuePlaceholder({
    attributeName,
    existingValues
  }: {
    attributeName: string;
    existingValues?: AttributeValue[];
  }) {
    // 1️⃣ Learn from existing values
    if (existingValues && existingValues.length > 0) {
      return existingValues
      .slice(0, 3)
      .map(v => v.name)
      .join(', ');
    }
    

    const staticFallBack = DEFAULT_PLACEHOLDERS[attributeName.trim().toLowerCase().replace(/\s+/g, '_')] ;

    return staticFallBack ?? DEFAULT_PLACEHOLDERS.generic
    
  }
