import { describe, expect, it } from 'vitest';
import { searchSurveyResultsSchema } from './schema';

describe('searchSurveyResultsSchema', () => {
  it('should parse the schema successfully with valid inputs', () => {
    const validInput = {
      companies: 'Company A, Company B',
      company: 'Company A',
      endDate: '2023-03-25',
      isForTopLevelKanbanBoard: true,
      includeTestAssessments: false,
      includeArchivedAssessments: true,
      limit: 10,
      offset: 0,
      orderBy: {
        field: 'id',
        order: 'asc',
      },
      roles: ['Manager', 'Employee'],
      searchText: 'performance',
      sortByColumnPosition: false,
      startDate: '2023-01-01',
      status: 'New',
      statuses: ['New', 'Done'],
      pipelineId: '123',
      pipelineStageId: '456',
    };

    expect(() => searchSurveyResultsSchema.parse(validInput)).not.toThrow();
  });

  it('should throw error with invalid inputs', () => {
    const invalidInput = {
      companies: '  ',
      company: '  ',
      endDate: 'not-a-date',
      isForTopLevelKanbanBoard: 'true',
      includeTestAssessments: 1, // Invalid because it's a number, not a boolean
      limit: '10', // Invalid because it's a string, not an integer
      orderBy: {
        field: 'invalidField', // Assuming "invalidField" is not a valid key in `surveyResultKeys`
        order: 'ascending', // Invalid because it's not "asc" or "desc"
      },
    };

    expect(() => searchSurveyResultsSchema.parse(invalidInput)).toThrow();
  });

  it('should parse successfully with optional fields missing', () => {
    const minimalInput = {
      company: 'Company A',
    };

    expect(() => searchSurveyResultsSchema.parse(minimalInput)).not.toThrow();
  });

  it('should throw error with completely empty inputs', () => {
    const emptyInput = {};

    // This should not throw because all fields are optional
    expect(() => searchSurveyResultsSchema.parse(emptyInput)).not.toThrow();
  });

  it('should accept input with valid optional values for companyIds, locationIds and departmentIds', () => {
    const validInput = {
      companies: 'Company A, Company B',
      company: 'Company A',
      endDate: '2023-03-25',
      isForTopLevelKanbanBoard: true,
      includeTestAssessments: false,
      includeArchivedAssessments: true,
      limit: 10,
      offset: 0,
      orderBy: {
        field: 'id',
        order: 'asc',
      },
      roles: ['Manager', 'Employee'],
      searchText: 'performance',
      sortByColumnPosition: false,
      startDate: '2023-01-01',
      status: 'New',
      statuses: ['New', 'Done'],
      pipelineId: '123',
      pipelineStageId: '456',
      companyIds: [123, 456],
      locationIds: [123, 456],
      departmentIds: [123, 456],
    };

    expect(() => searchSurveyResultsSchema.parse(validInput)).not.toThrow();
  });

  it('should throw if companyIds is not a numeric array', () => {
    const invalidInput = {
      companies: 'Company A, Company B',
      company: 'Company A',
      endDate: '2023-03-25',
      isForTopLevelKanbanBoard: true,
      includeTestAssessments: false,
      includeArchivedAssessments: true,
      limit: 10,
      offset: 0,
      orderBy: {
        field: 'id',
        order: 'asc',
      },
      roles: ['Manager', 'Employee'],
      searchText: 'performance',
      sortByColumnPosition: false,
      startDate: '2023-01-01',
      status: 'New',
      statuses: ['New', 'Done'],
      pipelineId: '123',
      pipelineStageId: '456',
      companyIds: '123, 456',
    };

    expect(() => searchSurveyResultsSchema.parse(invalidInput)).toThrow();
  });

  it('should throw if locationIds is not a numeric array', () => {
    const invalidInput = {
      companies: 'Company A, Company B',
      company: 'Company A',
      endDate: '2023-03-25',
      isForTopLevelKanbanBoard: true,
      includeTestAssessments: false,
      includeArchivedAssessments: true,
      limit: 10,
      offset: 0,
      orderBy: {
        field: 'id',
        order: 'asc',
      },
      roles: ['Manager', 'Employee'],
      searchText: 'performance',
      sortByColumnPosition: false,
      startDate: '2023-01-01',
      status: 'New',
      statuses: ['New', 'Done'],
      pipelineId: '123',
      pipelineStageId: '456',
      locationIds: '123, 456',
    };

    expect(() => searchSurveyResultsSchema.parse(invalidInput)).toThrow();
  });

  it('should throw if departmentIds is not a numeric array', () => {
    const invalidInput = {
      companies: 'Company A, Company B',
      company: 'Company A',
      endDate: '2023-03-25',
      isForTopLevelKanbanBoard: true,
      includeTestAssessments: false,
      includeArchivedAssessments: true,
      limit: 10,
      offset: 0,
      orderBy: {
        field: 'id',
        order: 'asc',
      },
      roles: ['Manager', 'Employee'],
      searchText: 'performance',
      sortByColumnPosition: false,
      startDate: '2023-01-01',
      status: 'New',
      statuses: ['New', 'Done'],
      pipelineId: '123',
      pipelineStageId: '456',
      locationIds: '123, 456',
    };

    expect(() => searchSurveyResultsSchema.parse(invalidInput)).toThrow();
  });
});
