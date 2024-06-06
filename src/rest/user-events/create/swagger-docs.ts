import type swaggerJSDoc from 'swagger-jsdoc';

export const createBulkUserEventsSwaggerDocs: swaggerJSDoc.Paths = {
  '/user-events': {
    post: {
      description: 'Create bulk user events',
      tags: ['User Events'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user_events: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      user_id: {
                        type: 'number',
                      },
                      description: {
                        type: 'string',
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User events created successfully',
        },
      },
    },
  },
};
