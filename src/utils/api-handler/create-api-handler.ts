import { type Stage } from '@core/constants/commons';
import { ENV } from '@core/constants/environment';
import { type KyselyClient } from '@core/db/connections';
import { type User } from '@core/types/user';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { type APIGatewayProxyEventV2, type Context, type Handler } from 'aws-lambda';
import { type IdTokenData } from 'middlewares/authentication/types-for-authentication';
import { allHireBusUsersAuthMiddlewares } from 'middlewares/authorization/all-hirebus-users-auth-middleware';
import { type AuthMiddleware } from 'middlewares/authorization/auth-middleware-type';
import { addDbClientMiddleware } from 'middlewares/db/add-db-client-middleware';
import { destroyAllKyselyDbConnectionsMiddleWare } from 'middlewares/db/destroy-all-db-connections-middleware';
import { destroyDbClientMiddleware } from 'middlewares/db/destroy-db-client-middleware';
import { errorHandlerMiddleware } from 'middlewares/error-handling/error-handler-middleware';
import { verifySchemaMiddleware } from 'middlewares/schema/verify-schema-middleware';
import {
  makeMiddlewareCompliant,
  type MiddlewareGeneralType,
} from 'middlewares/utils/make-middleware-compliant';
import { type MergeAndOverride } from 'utils/types/merge-and-override';
import { type ZodSchema } from 'zod';
import { type makeAPIResponse } from '../http';
import { makeServerlessWrapper } from './make-serverless-wrapper';

type APIGatewayEvent<TEvent = undefined> = TEvent extends undefined
  ? APIGatewayProxyEventV2
  : MergeAndOverride<APIGatewayProxyEventV2, TEvent>;

type APIGatewayEventWithIdTokenData<TEvent = undefined> = APIGatewayEvent<TEvent> & {
  idTokenData: IdTokenData;
};

type APIGatewayEventWithIdTokenDataAndEvent<TEvent = undefined> = TEvent extends undefined
  ? APIGatewayEventWithIdTokenData
  : MergeAndOverride<APIGatewayEventWithIdTokenData, TEvent>;

type EventParams<TBody, THeaders = unknown, TPathParams = unknown, TQuery = unknown> = {
  body: TBody;
  headers: THeaders;
  pathParameters: TPathParams;
  queryStringParameters: TQuery;
  dbClient: KyselyClient;
  legacyDbClient: KyselyClient;
  authenticatedUser?: User;
};

type Event<
  TType extends 'public' | 'private',
  TBody,
  THeaders,
  TPathParams,
  TQuery
> = TType extends 'public'
  ? APIGatewayEvent<EventParams<TBody, THeaders, TPathParams, TQuery>>
  : APIGatewayEventWithIdTokenDataAndEvent<EventParams<TBody, THeaders, TPathParams, TQuery>>;

export type ApiHandler<
  TType extends 'private' | 'public',
  TBody,
  THeaders = unknown,
  TPathParams = unknown,
  TQuery = unknown
> = (
  event: Event<TType, TBody, THeaders, TPathParams, TQuery>,
  context?: Context,
  lambdaCallback?: CallableFunction,
  otherThing?: unknown // TODO decide if we'll use this for dependency injection
) => Promise<ReturnType<typeof makeAPIResponse>> | ReturnType<typeof makeAPIResponse>;

export function createApiHandler<
  TBody,
  TQuery,
  THeaders,
  TPathParams,
  TType extends 'private' | 'public'
>({
  schema,
  handler,
  type,
  authMiddlewares = allHireBusUsersAuthMiddlewares,
}: {
  schema: {
    body?: ZodSchema<TBody>;
    headers?: ZodSchema<THeaders>;
    pathParameters?: ZodSchema<TPathParams>;
    queryStringParameters?: ZodSchema<TQuery>;
  };
  handler: ApiHandler<TType, TBody, THeaders, TPathParams, TQuery>;
  type: TType;
  authMiddlewares?: ReadonlyArray<AuthMiddleware>;
}) {
  const currentHandler = makeServerlessWrapper(ENV.STAGE as Stage, handler as unknown as Handler);

  let resultHandler = middy(currentHandler)
    .use(httpJsonBodyParser())
    .use(verifySchemaMiddleware(schema))
    .use(addDbClientMiddleware)
    .use(errorHandlerMiddleware)
    .use(destroyAllKyselyDbConnectionsMiddleWare)
    .use(destroyDbClientMiddleware as middy.MiddlewareObj);

  if (type === 'private') {
    authMiddlewares.forEach(middleware => {
      resultHandler = resultHandler.use(
        makeMiddlewareCompliant(middleware as MiddlewareGeneralType)
      );
    });
  }

  return resultHandler;
}
