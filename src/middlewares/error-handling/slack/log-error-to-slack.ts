import { getEnv } from '@core/constants/environment';
import { type MappedError } from 'utils/process-error';
import { isUserNotLoggedInOnWebsiteError } from '../is-not-logged-in-profile-request-error';
import { safeStringify } from '../utils/safe-stringify';
import { getCorrectErrorSlackChannel } from './get-correct-error-slack-channel';
import { getSlackSender } from './get-slack-sender';

export async function logErrorToSlack(error: MappedError): Promise<void> {
  const url = getCorrectErrorSlackChannel(error);
  const text = makeSlackErrorText(error);

  const ENV = getEnv();

  if (!ENV.SLACK_ERROR_CHANNEL_WEBHOOK_URL || isUserNotLoggedInOnWebsiteError(error)) {
    return;
  }

  const sender = getSlackSender();
  await sender({ url, text });
}

export function makeSlackErrorText(error: MappedError): string {
  const ENV = getEnv();

  const viewableError = {
    ...error,
    originalError: error.originalError?.toString(),
  };

  return `An error ocurred in the "${ENV.STAGE}" environment:\n\n${safeStringify(viewableError)}`;
}
