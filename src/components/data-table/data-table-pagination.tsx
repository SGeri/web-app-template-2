"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { getPaginationItems } from "@/lib/pagination";

export type DataTablePaginationProps = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  rowCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageIndexChange: (pageIndex: number) => void;
  className?: string;
};

/**
 * shadcn Pagination for TanStack Table (manual / server pagination).
 * Wire from `table.state.pagination` + table pagination APIs (see README).
 */
export function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageIndexChange,
  className,
}: DataTablePaginationProps) {
  const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className ?? ""}`}
    >
      <p className="text-muted-foreground text-sm">
        {rowCount === 0 ? "No results" : `Showing ${from}–${to} of ${rowCount}`}
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="default"
              className="pl-1.5!"
              disabled={!canPreviousPage}
              onClick={onPreviousPage}
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon data-icon="inline-start" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          </PaginationItem>

          {getPaginationItems(pageIndex, pageCount).map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <Button
                  type="button"
                  variant={item === pageIndex ? "outline" : "ghost"}
                  size="icon"
                  aria-label={`Go to page ${item + 1}`}
                  aria-current={item === pageIndex ? "page" : undefined}
                  onClick={() => onPageIndexChange(item)}
                >
                  {item + 1}
                </Button>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <Button
              type="button"
              variant="ghost"
              size="default"
              className="pr-1.5!"
              disabled={!canNextPage}
              onClick={onNextPage}
              aria-label="Go to next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon data-icon="inline-end" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
