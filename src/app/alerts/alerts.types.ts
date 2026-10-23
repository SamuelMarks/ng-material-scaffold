/**
 * Supported alert payload shapes from API responses.
 */
export type TAlert =
  | { error: string; error_message: string }
  | { code: number; message: string }
  | { message: string }
  | Record<string, unknown>;
