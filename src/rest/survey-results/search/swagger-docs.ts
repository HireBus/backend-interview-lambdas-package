import { surveyResultKeys } from '@core/services/survey-results/survey-result-keys';
import type swaggerJSDoc from 'swagger-jsdoc';

export const searchSurveyResultsSwaggerDocs: swaggerJSDoc.Paths = {
  '/survey-results/search': {
    post: {
      description: 'Search Survey Results.',
      tags: ['Survey Results'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                company: {
                  type: 'string',
                  default: '',
                  description: 'Company Name',
                },
                companies: {
                  type: 'string',
                  default: '',
                  description: 'Company Names (for Franchise Owner, separated by ~)',
                },
                endDate: {
                  type: 'date',
                  description: 'End Date',
                  default: '2030-07-21T16:26:05.258Z',
                },
                isForTopLevelKanbanBoard: {
                  type: 'boolean',
                  optional: true,
                  default: false,
                  description: 'Is for Top-Level Kanban Board',
                },
                includeArchivedAssessments: {
                  type: 'boolean',
                  optional: true,
                  description: 'Include Archived Assessments',
                  default: false,
                },
                includeTestAssessments: {
                  type: 'boolean',
                  optional: true,
                  description: 'Include Test Assessments',
                  default: false,
                },
                searchText: {
                  type: 'string',
                  default: '',
                  description: 'Search Text',
                },
                status: {
                  type: 'string',
                  description: 'Status',
                  default: '',
                },
                statuses: {
                  type: 'array',
                  description: 'Statuses',
                  default: [],
                },
                roles: {
                  type: 'array',
                  description: 'Roles',
                  default: [],
                },
                limit: {
                  type: 'number',
                  default: 10,
                  description: 'Limit',
                },
                offset: {
                  type: 'number',
                  description: 'Offset',
                },
                orderBy: {
                  type: 'object',
                  properties: {
                    role_name: {
                      type: 'string',
                      description: 'Role Name',
                      default: '',
                    },
                    field: {
                      type: 'string',
                      enum: surveyResultKeys,
                      description: 'Field to sort by',
                    },
                    order: {
                      type: 'string',
                      enum: ['asc', 'desc'],
                      description: 'Order to sort by',
                    },
                  },
                },
                sortByColumnPosition: {
                  type: 'boolean',
                  description: 'Sort by Column Position',
                  default: false,
                },
                startDate: {
                  type: 'date',
                  description: 'Start Date',
                  default: '2020-07-20T16:25:06.334Z',
                },
                pipelineId: {
                  type: 'string',
                  default: '',
                  description: 'Pipeline ID',
                },
                pipelineStageId: {
                  oneOf: [
                    {
                      type: 'string',
                      description: 'Pipeline Stage ID',
                      default: '',
                    },
                    {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                      description: 'Array of Pipeline Stage IDs',
                      default: [],
                    },
                  ],
                  description: 'Pipeline Stage ID or Array of Pipeline Stage IDs',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Survey Results Retrieved.',
        },
      },
      security: [{ 'ID Token': [] }],
    },
  },
};
