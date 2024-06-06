import type swaggerJsdoc from 'swagger-jsdoc';
import { describe, expect, it } from 'vitest';
import { getSwaggerDefinition } from './get-swagger-definition';

describe(getSwaggerDefinition.name, () => {
  it('should return a swagger definition', () => {
    const dummySwaggerDocs = {} as swaggerJsdoc.Paths;

    const result = getSwaggerDefinition({
      swaggerPaths: dummySwaggerDocs,
      stage: 'dev',
      projectName: 'HireBus',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "components": {
          "securitySchemes": {
            "ID Token": {
              "in": "header",
              "name": "x-id-token",
              "type": "apiKey",
            },
          },
        },
        "info": {
          "title": "Dev API - HireBus",
          "version": "0.0.0",
        },
        "openapi": "3.1.0",
        "paths": {},
        "tags": [],
      }
    `);
  });
});
