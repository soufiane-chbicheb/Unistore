// Modal for creating/editing attributes

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contextHooks/useTheme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Attribute, DisplayType } from './types';

interface AddAttributeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Attribute, 'id'>) => void;
  initialData?: Attribute;
}

export function AddAttributeModal(props: Readonly<AddAttributeModalProps>) {
  const { open, onOpenChange, onSubmit, initialData } = props;
  const [name, setName] = useState('');
  const [displayType, setDisplayType] = useState<DisplayType>('radio');

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setDisplayType(initialData.displayType);
    } else if (open) {
      setName('');
      setDisplayType('radio');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), displayType });
  };
  const { theme: currentTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ background: currentTheme.modal, color: currentTheme.text }}>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Attribute' : 'Add Attribute'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attribute-name">Attribute Name</Label>
              <Input
                id="attribute-name"
                placeholder="e.g. Size"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display-type">Display Type</Label>
              <Select value={displayType} onValueChange={(value) => setDisplayType(value as DisplayType)}>
                <SelectTrigger id="display-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radio">Radio Buttons</SelectItem>
                  <SelectItem value="checkbox">Checkboxes</SelectItem>
                  <SelectItem value="buttons">Button Group</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="color-swatches">Color Swatches</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter style={{ background: currentTheme.bgSecondary }}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} style={{ borderColor: currentTheme.border, color: currentTheme.text }}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: currentTheme.primary, color: currentTheme.textInverse }}>{initialData ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

