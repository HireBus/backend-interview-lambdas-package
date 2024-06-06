import { getSlackSender } from 'middlewares/error-handling/slack/get-slack-sender';
import { logger } from '@core/utils/commons';

export async function logToChannel({
  channelWebhook,
  message,
}: {
  channelWebhook: string;
  message: string;
}) {
  try {
    const sender = getSlackSender();
    await sender({ url: channelWebhook, text: message });
  } catch {
    logger({
      path: logToChannel.name,
      event: 'Failed to send Slack message',
      log: { message },
    })
  }
}
