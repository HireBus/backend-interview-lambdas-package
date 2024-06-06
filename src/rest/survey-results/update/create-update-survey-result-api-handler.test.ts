import { verifyIdTokenMiddleWare } from 'middlewares/authentication/verify-id-token/verify-id-token-middleware';
import { verifyIsHirebusUserMiddleware } from 'middlewares/authentication/verify-is-hirebus-user/verify-is-hirebus-user-middleware';
import { updateSurveyResultAuthMiddleware } from 'middlewares/authorization/update-survey-result/update-survey-result-auth-middleware';
import * as createApiHandlerModule from 'utils/api-handler/create-api-handler';
import { createMockLambdaEvent } from 'utils/test-utils/create-mock-lambda-event';
import { defaultLambdaContext } from 'utils/test-utils/default-lambda-context';
import { describe, expect, it, vi } from 'vitest';
import { makeAPIResponse } from 'utils/http';
import { createUpdateSurveyResultHandler } from './create-update-survey-result-api-handler';

const mocks = vi.hoisted(() => ({
  updateSurveyResult: vi.fn(),
}));

vi.mock('@core/services/survey-results/update/update-survey-result', () => ({
  updateSurveyResult: mocks.updateSurveyResult,
}));

describe(createUpdateSurveyResultHandler.name, () => {
  it('can execute', () => {
    createUpdateSurveyResultHandler();
  });

  it('should be a private api endpoint', () => {
    const spy = vi.spyOn(createApiHandlerModule, 'createApiHandler');

    createUpdateSurveyResultHandler();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'private',
      })
    );
  });

  it('should call "createApiHandler" with the correct auth middlewares', () => {
    const spy = vi.spyOn(createApiHandlerModule, 'createApiHandler');

    createUpdateSurveyResultHandler();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        authMiddlewares: [
          verifyIdTokenMiddleWare,
          verifyIsHirebusUserMiddleware,
          updateSurveyResultAuthMiddleware,
        ],
      })
    );
  });

  it('should correctly call "updateSurveyResult"', async () => {
    const handler = createUpdateSurveyResultHandler([]);

    const mockBody = {
      surveyResultId: 2,
      status: 'Hired',
      role: 'CEO',
      company: 'Some company',
      archivedAt: new Date().toISOString(),
      isTest: true,
    };

    const event = createMockLambdaEvent({
      body: mockBody,
    });

    await handler(event, defaultLambdaContext);

    expect(mocks.updateSurveyResult).lastCalledWith(
      expect.objectContaining({
        id: mockBody.surveyResultId,
        status: mockBody.status,
        role: mockBody.role,
        companyName: mockBody.company,
        archivedAt: new Date(mockBody.archivedAt),
        isTest: mockBody.isTest,
      })
    );
  });

  it('should return 200 response', async () => {
    const handler = createUpdateSurveyResultHandler([]);

    const event = createMockLambdaEvent({
      body: {
        surveyResultId: 2,
        status: 'Hired',
      },
    });

    const response = await handler(event, defaultLambdaContext);

    expect(response).toMatchObject(makeAPIResponse({ type: 'Success' }));
  });
});
