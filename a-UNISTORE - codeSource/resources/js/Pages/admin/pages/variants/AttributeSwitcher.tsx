// Horizontal attribute navigation with More popover showing all hidden attributes

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal, Plus } from 'lucide-react';
import type { Attribute, AttributeValue } from './types';
import { useTheme } from '@/contextHooks/useTheme';

interface AttributeSwitcherProps {
  attributes: Attribute[];
  activeAttributeId: string;
  onAttributeSelect: (id: string) => void;
  onAddAttribute: () => void;
  onEditAttribute: (attribute: Attribute) => void;
}

export function AttributeSwitcher({
  attributes,
  activeAttributeId,
  onAttributeSelect,
  onAddAttribute,
}: AttributeSwitcherProps) {
  const MAX_VISIBLE = 5;
  const visibleAttributes = attributes.slice(0, MAX_VISIBLE);
  const hiddenAttributes = attributes.slice(MAX_VISIBLE);
  const { theme: currentTheme } = useTheme(); // color all the page using this theme

  const getValueCount = (attributeId: string) => {
    return attributes.find((v) => v.id === attributeId)?.values?.length || 0;
  };
  
  return (
  <div className="flex items-center gap-2 border-b p-4" style={{ borderColor: currentTheme.border, background: currentTheme.bgSecondary }}>
      <div className="flex flex-1 flex-wrap gap-2">
        {visibleAttributes.map((attribute) => (
          <Button
            key={attribute.id}
            variant={activeAttributeId === attribute.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onAttributeSelect(attribute.id)}
            style={activeAttributeId === attribute.id ? { background: currentTheme.primary, color: currentTheme.textInverse } : { color: currentTheme.text }}
          >
            {attribute.name}
            <Badge variant="secondary" className="ml-2" style={{ background: currentTheme.badge, color: currentTheme.textInverse }}>
              {getValueCount(attribute.id)}
            </Badge>
          </Button>
        ))}

        {hiddenAttributes.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" style={{ color: currentTheme.text }}>
                <MoreHorizontal className="mr-2 h-4 w-4" />
                More ({hiddenAttributes.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="mb-2 text-xs font-semibold uppercase text-gray-500">All Attributes</div>
              <div className="max-h-80 space-y-1 overflow-y-auto">
                {hiddenAttributes.map((attribute) => (
                  <Button
                    key={attribute.id}
                    variant={activeAttributeId === attribute.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => onAttributeSelect(attribute.id)}
                    style={activeAttributeId === attribute.id ? { background: currentTheme.secondary, color: currentTheme.textInverse } : { color: currentTheme.text }}
                  >
                    <span>{attribute.name}</span>
                    <Badge variant="outline" className="ml-2" style={{ background: currentTheme.badge, color: currentTheme.textInverse }}>
                      {getValueCount(attribute.id)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <Button size="sm" onClick={onAddAttribute} style={{ background: currentTheme.primary, color: currentTheme.textInverse }}>
        <Plus className="mr-2 h-4 w-4" />
        Add Attribute
      </Button>
    </div>
  );
}

