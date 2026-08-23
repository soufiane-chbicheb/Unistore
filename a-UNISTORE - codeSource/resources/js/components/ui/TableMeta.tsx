import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import SelectByRadix from "./SelectByRadix";

interface TableMetaProps {
  currentPage: number;
  perPage: number;
  totalItems: number;
  children : React.ReactNode
  onPerPageChange: (value: string) => void;
}

export function TableMeta({ currentPage, perPage, totalItems, onPerPageChange  , children}: TableMetaProps) {
const {state : {currentTheme}} = useStoreConfigCtx()
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <span style={{ color: currentTheme.textMuted, fontSize: "0.85rem" }}>
        Showing {(currentPage - 1) * +perPage + 1} to {Math.min(currentPage * +perPage, totalItems)} of {totalItems}
      </span>
       {/* pagination placehlder in the center */}
      <div>
            {children}
      </div>

      <SelectByRadix value={String(perPage)} onChange={(value) => onPerPageChange(value)} elements={["5", "10", "20", "50"]} extraLabel="per page" />
    </div>
  );
}
