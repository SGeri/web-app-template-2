import "server-only";

import { ZodError, type ZodType } from "zod";

/**
 * Parse / validate server-action input. Throws a serializable Error for the client.
 * Prefer Zod schemas defined next to the action or in `src/lib`.
 */
export function parseActionInput<TSchema extends ZodType>(
  schema: TSchema,
  input: unknown,
): TSchema["_output"] {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.issues.map((issue) => issue.message).join("; "));
    }
    throw error;
  }
}
