import { verifyIdTokenMiddleWare } from "middlewares/authentication/verify-id-token/verify-id-token-middleware";
import { companyUsersAuthMiddleware } from "middlewares/authorization/company-user/company-users-auth-middleware";
import * as createApiHandlerModule from "utils/api-handler/create-api-handler";
import { createMockLambdaEvent } from "utils/test-utils/create-mock-lambda-event";
import { defaultLambdaContext } from "utils/test-utils/default-lambda-context";
import { describe, expect, it, vi } from "vitest";
import { createSearchSurveyResultsApiHandler } from "./create-search-survey-results-api-handler";

const mocks = vi.hoisted(() => ({
  searchSurveyResults: vi.fn(),
}));

vi.mock("@core/services/survey-results", () => ({
  searchSurveyResults: mocks.searchSurveyResults,
}));

describe(createSearchSurveyResultsApiHandler.name, () => {
  it("can execute", () => {
    createSearchSurveyResultsApiHandler();
  });

  it("should supply proper auth middlewares", () => {
    const spy = vi.spyOn(createApiHandlerModule, "createApiHandler");

    createSearchSurveyResultsApiHandler();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        authMiddlewares: [verifyIdTokenMiddleWare, companyUsersAuthMiddleware],
      })
    );
  });

  it('should call "searchSurveyResults" with the right data', async () => {
    const handler = createSearchSurveyResultsApiHandler([]);

    const mockEvent = createMockLambdaEvent({
      body: {
        company_id: ``,
        startDate: "2021-01-01",
      },
    });

    await handler(mockEvent, defaultLambdaContext);

    expect(mocks.searchSurveyResults).lastCalledWith(
      expect.objectContaining({
        company: "Apple Company",
        startDate: new Date("2021-01-01"),
      })
    );
  });
});
