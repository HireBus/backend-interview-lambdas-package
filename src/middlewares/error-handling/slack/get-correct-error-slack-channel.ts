import { ENV } from '@core/constants/environment';
import { type MappedError } from 'utils/process-error';

export function getCorrectErrorSlackChannel(error: MappedError) {
  const assessmentErrorPathnames = ['/survey/register', '/survey/take', '/survey/thank-you'];

  if (
    ENV.SLACK_ASSESSMENT_ERROR_CHANNEL_WEBHOOK_URL &&
    assessmentErrorPathnames.includes(error.pathname as string)
  ) {
    return ENV.SLACK_ASSESSMENT_ERROR_CHANNEL_WEBHOOK_URL;
  }

  return ENV.SLACK_ERROR_CHANNEL_WEBHOOK_URL ?? '';
}
