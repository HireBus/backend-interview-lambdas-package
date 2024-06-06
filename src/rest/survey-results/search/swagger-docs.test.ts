import { describe, expect, it } from 'vitest';
import { searchSurveyResultsSwaggerDocs } from './swagger-docs';

describe('searchSurveyResultsSwaggerDocs', () => {
  it('should return swagger docs', () => {
    expect(searchSurveyResultsSwaggerDocs).toMatchInlineSnapshot(`
      {
        "/survey-results/search": {
          "post": {
            "description": "Search Survey Results.",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "companies": {
                        "default": "",
                        "description": "Company Names (for Franchise Owner, separated by ~)",
                        "type": "string",
                      },
                      "company": {
                        "default": "",
                        "description": "Company Name",
                        "type": "string",
                      },
                      "endDate": {
                        "default": "2030-07-21T16:26:05.258Z",
                        "description": "End Date",
                        "type": "date",
                      },
                      "includeArchivedAssessments": {
                        "default": false,
                        "description": "Include Archived Assessments",
                        "optional": true,
                        "type": "boolean",
                      },
                      "includeTestAssessments": {
                        "default": false,
                        "description": "Include Test Assessments",
                        "optional": true,
                        "type": "boolean",
                      },
                      "isForTopLevelKanbanBoard": {
                        "default": false,
                        "description": "Is for Top-Level Kanban Board",
                        "optional": true,
                        "type": "boolean",
                      },
                      "limit": {
                        "default": 10,
                        "description": "Limit",
                        "type": "number",
                      },
                      "offset": {
                        "description": "Offset",
                        "type": "number",
                      },
                      "orderBy": {
                        "properties": {
                          "field": {
                            "description": "Field to sort by",
                            "enum": [
                              "id",
                              "checked",
                              "city",
                              "company",
                              "countryCode",
                              "created",
                              "e3_adjectives",
                              "e3_chart",
                              "e3_scales",
                              "e3_scales21",
                              "email",
                              "first",
                              "industry",
                              "ip",
                              "last",
                              "role",
                              "misc",
                              "phone",
                              "status",
                              "region",
                              "region_name",
                              "sid",
                              "starred",
                              "status",
                              "utm_campaign",
                              "utm_content",
                              "utm_medium",
                              "utm_source",
                              "utm_term",
                              "zip",
                            ],
                            "type": "string",
                          },
                          "order": {
                            "description": "Order to sort by",
                            "enum": [
                              "asc",
                              "desc",
                            ],
                            "type": "string",
                          },
                          "role_name": {
                            "default": "",
                            "description": "Role Name",
                            "type": "string",
                          },
                        },
                        "type": "object",
                      },
                      "pipelineId": {
                        "default": "",
                        "description": "Pipeline ID",
                        "type": "string",
                      },
                      "pipelineStageId": {
                        "description": "Pipeline Stage ID or Array of Pipeline Stage IDs",
                        "oneOf": [
                          {
                            "default": "",
                            "description": "Pipeline Stage ID",
                            "type": "string",
                          },
                          {
                            "default": [],
                            "description": "Array of Pipeline Stage IDs",
                            "items": {
                              "type": "string",
                            },
                            "type": "array",
                          },
                        ],
                      },
                      "roles": {
                        "default": [],
                        "description": "Roles",
                        "type": "array",
                      },
                      "searchText": {
                        "default": "",
                        "description": "Search Text",
                        "type": "string",
                      },
                      "sortByColumnPosition": {
                        "default": false,
                        "description": "Sort by Column Position",
                        "type": "boolean",
                      },
                      "startDate": {
                        "default": "2020-07-20T16:25:06.334Z",
                        "description": "Start Date",
                        "type": "date",
                      },
                      "status": {
                        "default": "",
                        "description": "Status",
                        "type": "string",
                      },
                      "statuses": {
                        "default": [],
                        "description": "Statuses",
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
              "201": {
                "description": "Survey Results Retrieved.",
              },
            },
            "security": [
              {
                "ID Token": [],
              },
            ],
            "tags": [
              "Survey Results",
            ],
          },
        },
      }
    `);
  });
});
