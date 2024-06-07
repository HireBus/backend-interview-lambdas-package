// import { surveyResultKeys } from '@core/services/survey-results/survey-result-keys';
import { z } from "zod";

export const searchSurveyResultsSchema = z.object({
  companies: z.string().trim().optional(),
  company: z.string().trim().optional(),
  endDate: z.string().optional(),
  isForTopLevelKanbanBoard: z.boolean().optional(),
  includeTestAssessments: z.boolean().optional(),
  includeArchivedAssessments: z.boolean().optional(),
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
  orderBy: z
    .object({
      role_name: z.string().optional(),
      field: z.enum(["id", "created"]),
      order: z.enum(["asc", "desc"]),
    })
    .optional(),
  roles: z.array(z.string()).optional(),
  searchText: z.string().trim().optional(),
  sortByColumnPosition: z.boolean().optional(),
  startDate: z.string().optional(),
  status: z.string().optional(),
  statuses: z.array(z.string()).optional(),
  pipelineId: z.string().min(1).optional(),
  pipelineStageId: z
    .string()
    .min(1)
    .or(z.array(z.string().min(1)))
    .optional(),
  companyIds: z.array(z.number().int()).optional(),
  locationIds: z.array(z.number().int()).optional(),
  departmentIds: z.array(z.number().int()).optional(),
});
