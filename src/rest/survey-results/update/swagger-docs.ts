import { createSwaggerDocs } from 'utils/swagger/create-swagger-docs';
import { updateSurveyResultSchema } from './schema';

export const updateSurveyResultSwaggerDocs = createSwaggerDocs({
  path: '/survey-results/update',
  method: 'post',
  description: 'Update Survey Result',
  tags: ['Survey Results'],
  schema: updateSurveyResultSchema,
  requireIdToken: true,
});
