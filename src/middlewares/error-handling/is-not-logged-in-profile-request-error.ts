import { ENV } from '@core/constants/environment';
import { type MappedError } from 'utils/process-error';

export const allowedWebsiteOrigins = [
  'https://dev.hirebus.com',
  'https://dev.bescoring.com',
  'https://staging.hirebus.com',
  'https://staging.bescoring.com',
  'https://app.hirebus.com',
  'https://app.bescoring.com',
];

export function isUserNotLoggedInOnWebsiteError(error: MappedError): boolean {
  return (
    !('userId' in error) &&
    !('userEmail' in error) &&
    error.body === 'Incorrect username or password' &&
    error.responseType.statusCode === 401 &&
    error.responseType.code === 8 &&
    error.responseType.message === 'Unauthorized' &&
    !!error.requestOrigin &&
    isAllowedOrigin(error.requestOrigin)
  );
}

function isAllowedOrigin(requestOrigin: string): boolean {
  return allowedWebsiteOrigins.includes(requestOrigin) || isAllowedLocalhostRequest(requestOrigin);
}

function isAllowedLocalhostRequest(requestOrigin: string): boolean {
  return ENV.DB_HOST === 'localhost' && requestOrigin === 'http://localhost:3000';
}
