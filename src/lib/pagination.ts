import { z } from "zod";

/** Aligns with TanStack Table `PaginationState` (0-based `pageIndex`). */
export const paginationInputSchema = z.object({
  pageIndex: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationInputSchema>;

export const sortingItemSchema = z.object({
  id: z.string().min(1),
  desc: z.boolean(),
});

/** Aligns with TanStack Table `SortingState`. */
export const sortingInputSchema = z.array(sortingItemSchema).default([]);

export type SortingInput = z.infer<typeof sortingInputSchema>;

export const listQueryInputSchema = paginationInputSchema.extend({
  sorting: sortingInputSchema,
});

export type ListQueryInput = z.infer<typeof listQueryInputSchema>;

export type PaginatedResult<T> = {
  items: T[];
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  /** Total rows across all pages — pass to TanStack Table as `rowCount`. */
  rowCount: number;
};

export function parseListQueryInput(input: unknown): ListQueryInput {
  return listQueryInputSchema.parse(input);
}

export function toSkipTake({ pageIndex, pageSize }: PaginationInput): {
  skip: number;
  take: number;
} {
  return { skip: pageIndex * pageSize, take: pageSize };
}

export function toPaginatedResult<T>({
  items,
  rowCount,
  pageIndex,
  pageSize,
}: {
  items: T[];
  rowCount: number;
  pageIndex: number;
  pageSize: number;
}): PaginatedResult<T> {
  const pageCount = pageSize > 0 ? Math.ceil(rowCount / pageSize) : 0;

  return {
    items,
    pageIndex,
    pageSize,
    pageCount,
    rowCount,
  };
}

/** Compact page list with ellipsis markers for shadcn Pagination. */
export function getPaginationItems(
  pageIndex: number,
  pageCount: number,
  siblingCount = 1,
): Array<number | "ellipsis"> {
  if (pageCount <= 0) return [];
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i);
  }

  const first = 0;
  const last = pageCount - 1;
  const start = Math.max(pageIndex - siblingCount, first + 1);
  const end = Math.min(pageIndex + siblingCount, last - 1);

  const items: Array<number | "ellipsis"> = [first];

  if (start > first + 1) items.push("ellipsis");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < last - 1) items.push("ellipsis");

  items.push(last);
  return items;
}
