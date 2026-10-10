"use server";

import { parseActionInput } from "@/actions/helpers/parse";
import {
  listQueryInputSchema,
  toPaginatedResult,
  toSkipTake,
  type ListQueryInput,
  type PaginatedResult,
} from "@/lib/pagination";

export type ExampleItem = {
  id: string;
  name: string;
};

/**
 * Reference list action: validate pagination/sorting, return `PaginatedResult`.
 * Replace with real Prisma queries; keep this shape for TanStack Table + Query.
 */
export async function listExamples(
  input: ListQueryInput,
): Promise<PaginatedResult<ExampleItem>> {
  const { pageIndex, pageSize, sorting } = parseActionInput(listQueryInputSchema, input);
  const { skip, take } = toSkipTake({ pageIndex, pageSize });

  // Placeholder dataset — swap for `prisma.model.findMany` / `count`.
  const all: ExampleItem[] = Array.from({ length: 42 }, (_, i) => ({
    id: String(i + 1),
    name: `Example ${i + 1}`,
  }));

  const sorted = [...all].sort((a, b) => {
    const sort = sorting[0];
    if (!sort || sort.id !== "name") return 0;
    const cmp = a.name.localeCompare(b.name);
    return sort.desc ? -cmp : cmp;
  });

  const rowCount = sorted.length;
  const items = sorted.slice(skip, skip + take);

  return toPaginatedResult({ items, rowCount, pageIndex, pageSize });
}
