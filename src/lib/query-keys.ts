import type { ListQueryInput } from "@/lib/pagination";

/**
 * Hierarchical query-key factory (TanStack Query convention).
 * Invalidate with prefixes: `queryClient.invalidateQueries({ queryKey: queryKeys.example.all })`.
 */
export const queryKeys = {
  example: {
    all: ["example"] as const,
    lists: () => [...queryKeys.example.all, "list"] as const,
    list: (input: ListQueryInput) => [...queryKeys.example.lists(), input] as const,
    details: () => [...queryKeys.example.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.example.details(), id] as const,
  },
} as const;
