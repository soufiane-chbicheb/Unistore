// Reusable table component with consistent key-value structure and bulk selection

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import type { AttributeValue } from './types';
import { useTheme } from '@/contextHooks/useTheme';

interface AttributeValuesTableProps {
  values: AttributeValue[];
  isColorAttribute: boolean;
  onEdit: (value: AttributeValue) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

export function AttributeValuesTable({ values, isColorAttribute, onEdit, onDelete, onBulkDelete }: AttributeValuesTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { theme: currentTheme } = useTheme(); // color all the page sing this theme
  useEffect(() => {
    setSelectedIds([]);
  }, [values]);

  const toggleSelectAll = () => {
    if (selectedIds.length === values.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(values.map((v) => v.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  if (values.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed" style={{ borderColor: currentTheme.border, background: currentTheme.bgSecondary }}>
        <p className="text-sm" style={{ color: currentTheme.textSecondary }}>No values yet. Add your first value.</p>
      </div>
    );
  }

  const isAllSelected = selectedIds.length === values.length && values.length > 0;

  return (
    <div className="space-y-3">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border px-4 py-2" style={{ background: currentTheme.bgSecondary, borderColor: currentTheme.border }}>
          <span className="text-sm font-medium" style={{ color: currentTheme.text }}>
            {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
          </span>
          <Button type="button" size="sm" variant="destructive" onClick={handleBulkDelete} style={{ background: currentTheme.error, color: currentTheme.textInverse }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

  <div className="rounded-md border" style={{ borderColor: currentTheme.border }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.map((value) => (
              <TableRow key={value.id} style={selectedIds.includes(value.id) ? { background: currentTheme.bgSecondary , borderColor : currentTheme.border} : undefined}>
                <TableCell>
                  <Checkbox checked={selectedIds.includes(value.id)} onCheckedChange={() => toggleSelect(value.id)} />
                </TableCell>
                <TableCell className="font-medium">{value.name}</TableCell>
                <TableCell>
                  {isColorAttribute && value.value ? (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded border" style={{ backgroundColor: value.value , borderColor : currentTheme.border }} />
                      <span className="text-sm" style={{ color: currentTheme.textSecondary }}>{value.value}</span>
                    </div>
                  ) : (
                    <span style={{ color: currentTheme.textSecondary }}>—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(value)} style={{ color: currentTheme.textSecondary }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDelete(value.id)}
                      style={{ color: currentTheme.error }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

