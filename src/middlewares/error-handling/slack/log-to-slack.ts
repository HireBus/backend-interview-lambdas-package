import { getEnv } from '@core/constants/environment';
import { getSlackSender } from './get-slack-sender';

export async function logToSlack(...messages: string[]): Promise<void> {
  const ENV = getEnv();

  if (!ENV.SLACK_ERROR_CHANNEL_WEBHOOK_URL) {
    return;
  }

  const sender = getSlackSender();

  await sender({ url: ENV.SLACK_ERROR_CHANNEL_WEBHOOK_URL, text: messages.join(' ') });
}
