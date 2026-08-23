// Workspace area showing active attribute and its values

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil } from 'lucide-react';
import { AttributeValuesTable } from './AttributeValuesTable';
import type { Attribute, AttributeValue } from './types';
import { useTheme } from '@/contextHooks/useTheme';

interface AttributeWorkspaceProps {
  attribute: Attribute;
  onAddValue: () => void;
  onEditValue: (value: AttributeValue) => void;
  onDeleteValue: (id: string) => void;
  onBulkDeleteValues: (ids: string[]) => void;
  onEditAttribute: () => void;
}

const DISPLAY_TYPE_LABELS: Record<string, string> = {
  radio: 'Radio Buttons',
  checkbox: 'Checkboxes',
  buttons: 'Button Group',
  dropdown: 'Dropdown',
  'color-swatches': 'Color Swatches',
};

export function AttributeWorkspace({
  attribute,
  onAddValue,
  onEditValue,
  onDeleteValue,
  onBulkDeleteValues,
  onEditAttribute,
}: AttributeWorkspaceProps) {
  const isColorAttribute = attribute.name.trim().toLocaleLowerCase() === 'color';
  const { theme: currentTheme } = useTheme(); // color all the page using this theme
  
  return (
    <CardContent className="p-6" style={{ background: currentTheme.card, color: currentTheme.text, borderColor: currentTheme.border }}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold" style={{ color: currentTheme.text }}>
            {attribute.name}
          </h2>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onEditAttribute} style={{ color: currentTheme.textSecondary }}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1" style={{ background: currentTheme.badge, color: currentTheme.textInverse }}>
            Display: {DISPLAY_TYPE_LABELS[attribute.displayType]}
          </Badge>
          <Button onClick={onAddValue} style={{ background: currentTheme.primary, color: currentTheme.textInverse }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Value
          </Button>
        </div>
      </div>

      <AttributeValuesTable
        values={attribute.values}
        isColorAttribute={isColorAttribute}
        onEdit={onEditValue}
        onDelete={onDeleteValue}
        onBulkDelete={onBulkDeleteValues}
      />
    </CardContent>
  );
}

