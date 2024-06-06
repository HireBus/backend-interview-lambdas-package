import { describe, it, expect } from 'vitest';
import { createSwaggerDocs } from './create-swagger-docs';

describe('createSwaggerDocs', () => {
  it('should create Swagger docs for GET request', () => {
    const docs = createSwaggerDocs({
      path: '/role-names/list',
      method: 'get',
      description: 'Get All Role Names.',
      tags: ['Role Names'],
      parameters: [
        {
          in: 'query',
          name: 'companyName',
          required: false,
          schema: {
            type: 'string',
          },
          description: 'Company Name',
        },
      ],
      responses: {
        200: {
          description: 'Role Names Retrieved.',
        },
      },
      requireIdToken: true,
    });

    expect(docs).toEqual({
      '/role-names/list': {
        get: {
          description: 'Get All Role Names.',
          tags: ['Role Names'],
          parameters: [
            {
              in: 'query',
              name: 'companyName',
              required: false,
              schema: {
                type: 'string',
              },
              description: 'Company Name',
            },
          ],
          responses: {
            200: {
              description: 'Role Names Retrieved.',
            },
          },
          security: [{ 'ID Token': [] }],
        },
      },
    });
  });

  // Similar tests for POST requests and other scenarios.
  it('should create Swagger docs for POST request', () => {
    const docs = createSwaggerDocs({
      path: '/survey-results/update-status',
      method: 'post',
      description: 'Update status of survey result(s)',
      tags: ['SurveyResults'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ids: {
                  type: 'array',
                  description: 'Ids of survey results to update status for',
                },
                newStatus: {
                  type: 'string',
                  description: 'New status to set for survey results',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Updated the status of the survey result(s) successfully.',
        },
      },
      requireIdToken: true,
    });

    expect(docs).toEqual({
      '/survey-results/update-status': {
        post: {
          description: 'Update status of survey result(s)',
          tags: ['SurveyResults'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ids: {
                      type: 'array',
                      description: 'Ids of survey results to update status for',
                    },
                    newStatus: {
                      type: 'string',
                      description: 'New status to set for survey results',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Updated the status of the survey result(s) successfully.',
            },
          },
          security: [{ 'ID Token': [] }],
        },
      },
    });
  });
});
