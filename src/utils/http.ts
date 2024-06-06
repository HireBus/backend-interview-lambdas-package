import { HTTP_RESPONSES } from '../constants/http';
import { getCorsAllowedOrigin } from './http/get-cors-allowed-origin';

export const commonHeaders = {
  'Access-Control-Allow-Origin': getCorsAllowedOrigin(),
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

type MakeAPIResponseOption<TData, TError, TRaw extends object> = {
  type: keyof typeof HTTP_RESPONSES;
  data?: TData;
  raw?: TRaw;
  error?: TError;
};

export type ApiResponse = typeof makeAPIResponse;

/**
 * Make a response for API Gateway
 *
 * @param type based on HTTP_RESPONSES
 * @param data the data to be returned
 * @param error the error to be returned
 * @param raw the raw data to be returned
 * @returns API Gateway response
 */
export function makeAPIResponse<TData, TError, TRaw extends object>({
  type,
  data,
  error,
  raw = undefined,
}: MakeAPIResponseOption<TData, TError, TRaw>) {
  return {
    statusCode: HTTP_RESPONSES[type].statusCode,
    headers: commonHeaders,
    body: JSON.stringify(makeResponseBody({ type, data, error, raw })),
  };
}

function makeResponseBody<TData, TError, TRaw extends object>({
  type,
  data,
  raw = undefined, // TODO: I don't think this is used
  error,
}: MakeAPIResponseOption<TData, TError, TRaw>) {
  if (error) throw error; // TODO: this is necessary because some handlers and not dealing with errors properly. Errors should be handled by the error handler middleware
  let finalResult = {
    message: HTTP_RESPONSES[type].message,
    code: HTTP_RESPONSES[type].code,
    data,
  };

  if (raw) {
    finalResult = { ...raw, ...finalResult };
  }

  return finalResult;
}
