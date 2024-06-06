import { type KyselyClient } from '@core/db/connections';
import { type User } from '@core/types/user';
import { type XHeaderType } from 'constants/http';
import { type APIGatewayEventType } from 'types/http';

export type AuthenticatedAPIGatewayEventType<TBody = Record<string, unknown>> =
  APIGatewayEventType<{
    headers: Record<XHeaderType, string>;
    idTokenData?: IdTokenData;
    dbClient: KyselyClient;
    legacyDbClient: KyselyClient;
    body?: TBody;
    authenticatedUser?: User;
  }>;

export type ApiGatewayEventWithIdTokenData = AuthenticatedAPIGatewayEventType & {
  idTokenData: IdTokenData;
};

export type ApiEventWithAllData = ApiGatewayEventWithIdTokenData & {
  body: Record<string, unknown>;
};

export type ApiGatewayEventWithValidIdTokenData = AuthenticatedAPIGatewayEventType & {
  idTokenData: ValidIdTokenData;
};

export type IdTokenData = {
  email: string;
  userId: string;
  superAdminId?: string;
};

export type ValidIdTokenData = {
  email: string;
  userId: string;
  superAdminId?: string;
};
