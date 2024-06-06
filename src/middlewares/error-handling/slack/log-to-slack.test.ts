import { getEnv } from '@core/constants/environment';
import { describe, expect, it, vi, type Mock } from 'vitest';
import { getSlackSender } from './get-slack-sender';
import { logToSlack } from './log-to-slack';

vi.mock('@core/constants/environment', () => ({
  getEnv: vi.fn(),
}));

vi.mock('./get-slack-sender', () => ({
  getSlackSender: vi.fn(),
}));

describe('logToSlack', () => {
  it.skip('can work', async () => {
    await logToSlack('Hello there');
  });

  it('should not call the Slack sender if SLACK_ERROR_CHANNEL_WEBHOOK_URL is not set', async () => {
    const getEnvMock = getEnv as Mock;
    getEnvMock.mockReturnValueOnce({ SLACK_ERROR_CHANNEL_WEBHOOK_URL: '' });

    const getSlackSenderMock = getSlackSender as Mock;
    const senderMock = vi.fn();
    getSlackSenderMock.mockReturnValueOnce(senderMock);

    await logToSlack('Test message');

    expect(senderMock).not.toHaveBeenCalled();
  });

  // Get this to work
  it.skip('should call the Slack sender with the correct URL and text if SLACK_ERROR_CHANNEL_WEBHOOK_URL is set', async () => {
    const getEnvMock = getEnv as Mock;
    getEnvMock.mockReturnValueOnce({
      SLACK_ERROR_CHANNEL_WEBHOOK_URL: 'https://example.com/webhook',
    });

    const getSlackSenderMock = getSlackSender as Mock;
    const senderMock = vi.fn();
    getSlackSenderMock.mockReturnValueOnce(senderMock);

    const message = 'Test message';
    await logToSlack(message);

    expect(senderMock).toHaveBeenCalledWith({
      url: 'https://example.com/webhook',
      text: message,
    });
  });
});
