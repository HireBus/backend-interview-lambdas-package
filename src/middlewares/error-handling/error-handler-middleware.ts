// import { destroyAllKyselyDbConnections } from "@core/db/utils/kysely-client-pool";
import { type MiddlewareObj } from "@middy/core";
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";
import { logError } from "middlewares/error-handling/log-error";
import { commonHeaders } from "utils/http";
import { processError } from "utils/process-error";
import { safeStringify } from "./utils/safe-stringify";

export const errorHandlerMiddleware: MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = {
  onError: async (request) => {
    if (!request.error) return;

    const mappedError = processError(request.error, request.event);

    logError(mappedError);
    // await destroyAllKyselyDbConnections();
    // await logErrorToSlack(mappedError);

    request.response = {
      headers: commonHeaders,
      statusCode: mappedError.responseType.statusCode,
      body: safeStringify(mappedError.body),
    };
  },
};
