import { z } from 'zod';

export const updateSurveyResultSchema = {
  body: z.object({
    archivedAt: z.string().datetime().optional(),
    company: z.string().optional(),
    isTest: z.boolean().optional(),
    role: z.string().optional(),
    surveyResultId: z.number(),
    status: z.string().optional(),
  }),
};
