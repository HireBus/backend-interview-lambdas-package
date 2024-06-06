import { describe, expect, it, vi } from 'vitest';
import * as factoryModule from './create-update-survey-result-api-handler';

describe('updateSurveyResultApiHandler', () => {
  it('should correctly call "createUpdateSurveyResultHandler"', async () => {
    const spy = vi.spyOn(factoryModule, 'createUpdateSurveyResultHandler');

    await import('./handler');

    expect(spy).toHaveBeenCalled();
    expect(spy).lastCalledWith();
  });
});
