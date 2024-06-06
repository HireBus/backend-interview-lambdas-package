import type swaggerJSDoc from 'swagger-jsdoc';
import { describe, expect, it } from 'vitest';
import { makeSwaggerPaths } from './swagger';

describe('makeSwaggerPaths', () => {
  it('should correctly merge swagger paths', () => {
    const input: swaggerJSDoc.Paths[] = [
      { '/path1': { get: { summary: 'Get Path 1' } } },
      { '/path2': { get: { summary: 'Get Path 2' }, post: { summary: 'Post Path 2' } } },
      { '/path1': { post: { summary: 'Post Path 1' } } },
    ];

    const result = makeSwaggerPaths(input);

    const expected: swaggerJSDoc.Paths = {
      '/path1': {
        get: { summary: 'Get Path 1' },
        post: { summary: 'Post Path 1' },
      },
      '/path2': { get: { summary: 'Get Path 2' }, post: { summary: 'Post Path 2' } },
    };

    expect(result).toEqual(expected);
  });
});
