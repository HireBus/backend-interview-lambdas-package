import { updateSurveyResult } from '@core/services/survey-results/update/update-survey-result';
import { verifyIdTokenMiddleWare } from 'middlewares/authentication/verify-id-token/verify-id-token-middleware';
import { verifyIsHirebusUserMiddleware } from 'middlewares/authentication/verify-is-hirebus-user/verify-is-hirebus-user-middleware';
import { type AuthMiddleware } from 'middlewares/authorization/auth-middleware-type';
import { updateSurveyResultAuthMiddleware } from 'middlewares/authorization/update-survey-result/update-survey-result-auth-middleware';
import { createApiHandler } from 'utils/api-handler/create-api-handler';
import { makeAPIResponse } from 'utils/http';
import { updateSurveyResultSchema } from './schema';

export function createUpdateSurveyResultHandler(
  authMiddlewares: ReadonlyArray<AuthMiddleware> = [
    verifyIdTokenMiddleWare,
    verifyIsHirebusUserMiddleware,
    updateSurveyResultAuthMiddleware as AuthMiddleware,
  ]
) {
  return createApiHandler({
    authMiddlewares,
    schema: updateSurveyResultSchema,
    handler: async ({ body, dbClient }) => {
      await updateSurveyResult({
        dbClient,
        id: body.surveyResultId,
        archivedAt: body.archivedAt ? new Date(body.archivedAt) : undefined,
        companyName: body.company,
        isTest: body.isTest,
        role: body.role,
        status: body.status,
      });
      return makeAPIResponse({ type: 'Success' });
    },
    type: 'private',
  });
}
