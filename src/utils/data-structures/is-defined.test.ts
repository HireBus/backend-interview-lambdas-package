import { describe, it, expect } from 'vitest';
import { isDefined } from './is-defined';

describe(isDefined.name, () => {
  it('should return true for defined values', () => {
    expect(isDefined(1)).toBe(true);
    expect(isDefined('string')).toBe(true);
    expect(isDefined(true)).toBe(true);
    expect(isDefined([])).toBe(true);
    expect(isDefined({})).toBe(true);
    expect(isDefined(() => {})).toBe(true);
  });

  it('should return false for undefined or null values', () => {
    expect(isDefined(undefined)).toBe(false);
    expect(isDefined(null)).toBe(false);
  });

  it('should correctly type guard in TypeScript', () => {
    const val: number | undefined = Math.random() > 0.5 ? 1 : undefined;
    if (isDefined(val)) {
      // TypeScript now knows that `val` is number and not undefined
      expect(typeof val).toBe('number');
    }
  });
});
