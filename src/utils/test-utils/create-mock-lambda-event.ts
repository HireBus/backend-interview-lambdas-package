import { type KyselyClient } from '@core/db/connections';
import { type User } from '@core/types/user';
import {
  type AuthenticatedAPIGatewayEventType,
  type IdTokenData,
} from 'middlewares/authentication/types-for-authentication';

type Params<
  TBody = unknown,
  THeaders = unknown,
  TPathParameters = unknown,
  TQueryStringParameters = unknown
> = {
  body?: TBody;
  headers?: THeaders;
  pathParameters?: TPathParameters;
  queryStringParameters?: TQueryStringParameters;
  idTokenData?: IdTokenData;
  dbClient?: KyselyClient;
  authenticatedUser?: User;
};

export function createMockLambdaEvent<
  THeaders,
  TPathParameters,
  TQueryStringParameters,
  TBody = undefined
>(
  params?: Params<TBody, THeaders, TPathParameters, TQueryStringParameters>
): AuthenticatedAPIGatewayEventType<TBody> {
  return {
    body: params?.body ?? ({} as TBody),
    headers: params?.headers ?? ({} as THeaders),
    pathParameters: params?.pathParameters ?? ({} as TPathParameters),
    queryStringParameters: params?.queryStringParameters ?? ({} as TQueryStringParameters),
    idTokenData: params?.idTokenData ?? {},
    dbClient: params?.dbClient,
    authenticatedUser: params?.authenticatedUser,
  } as unknown as AuthenticatedAPIGatewayEventType<TBody>;
}
