/**
 * Common date fields for API models.
 */
export interface IDates<T> {
  createdAt: T;
  updatedAt: T;
}

/**
 * Converts a payload with ISO date strings to native Date objects.
 */
export const parseDates = <T extends IDates<string>>(
  obj: T,
): Omit<T, keyof IDates<string>> & IDates<Date> => ({
  ...obj,
  createdAt: new Date(obj.createdAt),
  updatedAt: new Date(obj.updatedAt),
});
