import { describe, expect, it, vi } from 'vitest';
import { logToChannel } from 'middlewares/error-handling/slack/log-to-channel';

const mocks = vi.hoisted(() => {
  const sender = vi.fn();
  return {
    getSlackSender: vi.fn(() => sender),
    sender,
  }
});

vi.mock('middlewares/error-handling/slack/get-slack-sender', () => ({
  getSlackSender: mocks.getSlackSender,
}));

describe(logToChannel.name, () => {
  it('should call slack sender', async () => {
    const message = 'testMessage';
    const channelWebhook = 'WebhookUrl';
    await logToChannel({ channelWebhook, message });
    expect(mocks.sender).toHaveBeenCalledWith({
      url: channelWebhook,
      text: message
    });
  });

  it('should not throw if sender throws', async () => {
    const message = 'testMessage';
    const channelWebhook = 'WebhookUrl';
    mocks.sender.mockImplementation(() => {
      throw new Error();
    });
    await logToChannel({ channelWebhook, message });
    expect(mocks.sender).toHaveBeenCalledWith({
      url: channelWebhook,
      text: message
    });
  })
});
