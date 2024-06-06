import { describe, expect, it, vi } from 'vitest';
import * as createHandlerModule from './create-search-survey-results-api-handler';

describe('searchSurveyResultsApiHandler', () => {
  it('should be correctly instantiated with "createSearchSurveyResultsApiHandler"', async () => {
    const spy = vi.spyOn(createHandlerModule, 'createSearchSurveyResultsApiHandler');

    await import('./handler');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith();
  });
});
