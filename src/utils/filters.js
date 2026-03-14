/**
 * Case-insensitive comparison for in-memory / file-based filtering.
 * Compares strings ignoring case; falls back to strict equality for non-strings.
 */
export const caseInsensitiveMatch = (itemValue, filterValue) =>
  typeof filterValue === 'string' && typeof itemValue === 'string'
    ? itemValue.toLowerCase() === filterValue.toLowerCase()
    : itemValue === filterValue;

/**
 * Escape special regex characters in a string.
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Detect MongoDB ObjectId-like strings (24-char hex).
 */
const isObjectIdLike = (str) => /^[a-f\d]{24}$/i.test(str);

/**
 * Transform plain filters into Mongo-compatible case-insensitive filters.
 * - Numeric strings are kept as numbers so Mongoose can cast them correctly.
 * - ObjectId-like strings (24-char hex) are left as-is for Mongoose to cast.
 * - Other string values are converted to an anchored regex with the 'i' flag.
 */
export const toMongoFilters = (filters) =>
  Object.fromEntries(
    Object.entries(filters).map(([key, value]) => {
      if (typeof value !== 'string') return [key, value];
      if (isObjectIdLike(value)) return [key, value];
      const num = Number(value);
      if (value !== '' && !isNaN(num)) return [key, num];
      return [key, new RegExp(`^${escapeRegex(value)}$`, 'i')];
    })
  );
