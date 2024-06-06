import { describe, expect, it, vi } from 'vitest';
import * as createSwaggerDocsModule from 'utils/swagger/create-swagger-docs';
import { updateSurveyResultSchema } from './schema';

describe('updateSurveyResultSwaggerDocs', () => {
  it('should correctly call "createSwaggerDocs"', async () => {
    const spy = vi.spyOn(createSwaggerDocsModule, 'createSwaggerDocs');

    await import('./swagger-docs');

    expect(spy).toHaveBeenCalledWith({
      path: '/survey-results/update',
      method: 'post',
      description: 'Update Survey Result',
      tags: ['Survey Results'],
      schema: updateSurveyResultSchema,
      requireIdToken: true,
    });
  });
});
