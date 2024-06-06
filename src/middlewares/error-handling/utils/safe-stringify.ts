export function safeStringify(obj: unknown) {
  const cache = new Set();

  return JSON.stringify(
    obj,
    (_, value: unknown): unknown => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          // Circular reference found, discard key
          return undefined;
        }
        cache.add(value);
      }
      return value;
    },
    4
  );
}
