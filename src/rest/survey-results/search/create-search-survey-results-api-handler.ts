import { searchSurveyResults } from '@core/services/survey-results';
import { verifyIdTokenMiddleWare } from 'middlewares/authentication/verify-id-token/verify-id-token-middleware';
import { type AuthMiddleware } from 'middlewares/authorization/auth-middleware-type';
import { companyUsersAuthMiddleware } from 'middlewares/authorization/company-user/company-users-auth-middleware';
import { createApiHandler } from 'utils/api-handler/create-api-handler';
import { makeAPIResponse } from 'utils/http';
import { searchSurveyResultsSchema } from './schema';

export function createSearchSurveyResultsApiHandler(
  authMiddlewares: ReadonlyArray<AuthMiddleware> = [
    verifyIdTokenMiddleWare,
    companyUsersAuthMiddleware,
  ]
) {
  return createApiHandler({
    schema: {
      body: searchSurveyResultsSchema,
    },
    handler: async ({ body, dbClient }) => {
      const surveyResults = await searchSurveyResults({
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        dbClient,
      });

      return makeAPIResponse({
        type: 'Success',
        data: surveyResults,
      });
    },
    type: 'private',
    authMiddlewares,
  });
}
