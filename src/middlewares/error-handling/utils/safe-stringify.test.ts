import { describe, expect, it } from "vitest";
import { safeStringify } from "./safe-stringify";

describe(safeStringify.name, () => {
  it("should handle circular references", () => {
    const obj: Record<string, unknown> = { name: "John" };
    obj.self = obj;

    const expected = JSON.stringify(
      {
        name: "John",
      },
      null,
      4
    );
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should handle circular references in nested objects", () => {
    const obj: Record<string, string | Record<string, unknown>> = {
      name: "John",
      address: {
        street: "123 Main St",
      },
    };
    (obj.address as Record<string, unknown>).resident = obj;

    const expected = JSON.stringify(
      {
        name: "John",
        address: {
          street: "123 Main St",
        },
      },
      null,
      4
    );
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should stringify a simple object", () => {
    const obj: Record<string, unknown> = { name: "John", age: 30 };
    const expected = JSON.stringify(obj, null, 4);
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should stringify an object with nested objects", () => {
    const obj: Record<string, unknown> = {
      name: "John",
      age: 30,
      address: {
        street: "123 Main St",
        city: "New York",
      },
    };
    const expected = JSON.stringify(obj, null, 4);
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should handle circular references", () => {
    const obj: Record<string, unknown> = { name: "John" };
    obj.self = obj;
    const expected = JSON.stringify(
      {
        name: "John",
        self: undefined,
      },
      null,
      4
    );
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should handle circular references in nested objects", () => {
    const obj: Record<string, unknown> = {
      name: "John",
      address: {
        street: "123 Main St",
      },
    };
    (obj.address as Record<string, unknown>).resident = obj;
    const expected = JSON.stringify(
      {
        name: "John",
        address: {
          street: "123 Main St",
          resident: undefined,
        },
      },
      null,
      4
    );
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should handle arrays", () => {
    const arr = [1, 2, 3, 4, 5];
    const expected = JSON.stringify(arr, null, 4);
    expect(safeStringify(arr)).toEqual(expected);
  });

  it("should handle arrays with circular references", () => {
    const arr = [1, 2, 3] as unknown[];
    arr.push(arr);
    const expected = JSON.stringify([1, 2, 3, undefined], null, 4);
    expect(safeStringify(arr)).toEqual(expected);
  });

  it("should handle null values", () => {
    const obj: Record<string, unknown> = { name: "John", age: null };
    const expected = JSON.stringify(obj, null, 4);
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should handle undefined values", () => {
    const obj: Record<string, unknown> = { name: "John", age: undefined };
    const expected = JSON.stringify(obj, null, 4);
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should handle empty objects", () => {
    const obj: Record<string, unknown> = {};
    const expected = JSON.stringify(obj, null, 4);
    expect(safeStringify(obj)).toEqual(expected);
  });

  it("should handle empty arrays", () => {
    const arr = [] as const;
    const expected = JSON.stringify(arr, null, 4);
    expect(safeStringify(arr)).toEqual(expected);
  });

  it("should handle primitive values", () => {
    expect(safeStringify("hello")).toEqual(JSON.stringify("hello", null, 4));
    expect(safeStringify(42)).toEqual(JSON.stringify(42, null, 4));
    expect(safeStringify(true)).toEqual(JSON.stringify(true, null, 4));
    expect(safeStringify(null)).toEqual(JSON.stringify(null, null, 4));
    expect(safeStringify(undefined)).toEqual(
      JSON.stringify(undefined, null, 4)
    );
  });
});
