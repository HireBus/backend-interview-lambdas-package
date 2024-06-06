import { describe, expect, it } from 'vitest';
import { createBulkUserEventsSwaggerDocs } from './swagger-docs';

describe('createBulkUserEventsSwaggerDocs', () => {
  it('should be correctly shaped', () => {
    expect(createBulkUserEventsSwaggerDocs).toMatchInlineSnapshot(`
      {
        "/user-events": {
          "post": {
            "description": "Create bulk user events",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "user_events": {
                        "items": {
                          "properties": {
                            "description": {
                              "type": "string",
                            },
                            "timestamp": {
                              "format": "date-time",
                              "type": "string",
                            },
                            "user_id": {
                              "type": "number",
                            },
                          },
                          "type": "object",
                        },
                        "type": "array",
                      },
                    },
                    "type": "object",
                  },
                },
              },
              "required": true,
            },
            "responses": {
              "200": {
                "description": "User events created successfully",
              },
            },
            "tags": [
              "User Events",
            ],
          },
        },
      }
    `);
  });
});
