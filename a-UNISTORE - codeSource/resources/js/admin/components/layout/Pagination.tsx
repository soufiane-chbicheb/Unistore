import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationTableProps {
   onCurrentPageChange : (action: 'prev' | 'next' | number) => void ;
   totalPages : number ; 
   currentPage : number

}
 export const PaginationTable = ({currentPage , onCurrentPageChange, totalPages }:PaginationTableProps) => {
    return (
    <>
  {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onCurrentPageChange('prev')}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              <ChevronLeft size={18} />
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                  }
                  if (pageNum > totalPages) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <Button
                    key={pageNum}
                    type="button"
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => onCurrentPageChange(pageNum)}
                    className="rounded-lg w-9 h-9"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onCurrentPageChange('next')}
              disabled={currentPage === totalPages}
              className="rounded-lg"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
 
    </>)
 }
  
