import { UnauthorizedError, copyErrorProperties } from '@core/services/errors';
import { ForbiddenError } from '@core/services/errors/forbidden-error';
import { ValidationError } from '@core/types/errors';
import { HTTP_RESPONSES } from 'constants/http';
import { ZodError, type ZodIssue } from 'zod';

function buildZodIssue(message: string): ZodIssue {
  return {
    code: 'custom',
    message,
    path: [],
  };
}

function buildZodIssues(message: string) {
  return { issues: [buildZodIssue(message)] };
}

interface UnhandledError {
  message: string;
  stack?: string;
  name: string;
}

type ErrorWithMessage = string;

export type ErrorBody =
  | {
      issues: ZodIssue[];
    }
  | UnhandledError
  | ErrorWithMessage;

export interface MappedError {
  body: ErrorBody;
  responseType: (typeof HTTP_RESPONSES)[keyof typeof HTTP_RESPONSES];
  originalError?: Error;
  requestBody?: unknown;
  userId?: string;
  userEmail?: string;
  routeKey?: string;
  requestOrigin?: string;
  pathname?: string;
  queryStringParameters?: Record<string, string | undefined> | null;
}

type Event = {
  body?: unknown;
  idTokenData?: {
    email: string;
    userId: string;
  };
  routeKey?: string;
  headers?: {
    origin?: string;
    pathname?: string;
  };
  queryStringParameters?: Record<string, string | undefined> | null;
};

export function processError(error: Error, event?: Event): MappedError {
  const baseResult = makeBaseResult(event);

  if (error instanceof ValidationError)
    return {
      ...baseResult,
      body: buildZodIssues(error.message),
      responseType: HTTP_RESPONSES.BadRequest,
    };
  if (error instanceof ZodError)
    return {
      ...baseResult,
      body: error,
      responseType: HTTP_RESPONSES.BadRequest,
    };
  if (error instanceof UnauthorizedError) {
    return {
      ...baseResult,
      body: 'Incorrect username or password',
      responseType: HTTP_RESPONSES.Unauthorized,
      originalError: error,
    };
  }
  if (error instanceof ForbiddenError) {
    return {
      ...baseResult,
      body: error.message,
      responseType: HTTP_RESPONSES.Forbidden,
      originalError: error,
    };
  }
  // TODO: in dev mode we want to return the full error, but this is a security concern in prod
  return {
    ...baseResult,
    body: copyErrorProperties(error),
    responseType: HTTP_RESPONSES.ServerError,
    originalError: error,
  };
}

function makeBaseResult(event?: Event) {
  const headers = event?.headers;

  const baseResponseBodyResponse = getEventBody(event);
  const baseUserInfoResponse = event?.idTokenData
    ? {
        userId: event.idTokenData.userId,
        userEmail: event.idTokenData.email,
      }
    : {};
  const routeKeyResult = event?.routeKey ? { routeKey: event.routeKey } : {};
  const requestOriginResult = headers?.origin ? { requestOrigin: headers.origin } : {};
  const pathnameResult = headers?.pathname ? { pathname: headers.pathname } : {};
  const queryStringParametersResult = event?.queryStringParameters
    ? { queryStringParameters: event.queryStringParameters }
    : {};

  const baseResult = {
    ...baseUserInfoResponse,
    ...routeKeyResult,
    ...requestOriginResult,
    ...pathnameResult,
    ...queryStringParametersResult,
    ...baseResponseBodyResponse,
  };
  return baseResult;
}

function getEventBody(event: Event | undefined) {
  return event?.body ? { requestBody: event.body } : {};
}
