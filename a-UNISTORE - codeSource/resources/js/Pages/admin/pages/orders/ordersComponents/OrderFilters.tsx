import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SelectByRadix from '@/components/ui/SelectByRadix';
import React from 'react';
import { Button } from '@/components/ui/button';

interface OrderFiltersProps {
  searchQuery: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function OrderFilters({
  searchQuery,
  statusFilter,
  dateFrom,
  dateTo,
  onSearchChange,
  setStatusFilter,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  hasActiveFilters,
}: OrderFiltersProps) {
  return (
    <div className="inline-flex items-center gap-3 w-full">

      {/* Search */}
      <div className="relative flex-1 min-w-[250px]">
        <Input
          placeholder="Search by order ID or customer name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-3 rounded-lg w-full"
        >


            <Search size={18} className="text-muted-foreground" />
        </Input>
      
      </div>

      {/* Status */}
      <div style={{ flex: '0 0 150px' }}>
        
        <SelectByRadix  value={statusFilter} setter={setStatusFilter} elements={['All Orders' , 'Pending' , 'Processing' , 'Shipped' , 'Delivered' , 'Cancelled' , 'Returned']} />
      </div>

      {/* Dates */}
      <div style={{ flex: '0 0 150px' }}>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-full rounded-lg"
        />
    
      </div>

      <div style={{ flex: '0 0 150px' }}>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-full rounded-lg"
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClearFilters}
          className="rounded-lg"
          style={{ flex: '0 0 40px' }}
        >
          <X size={18} />
        </Button>
      )}
    </div>
  );
}
