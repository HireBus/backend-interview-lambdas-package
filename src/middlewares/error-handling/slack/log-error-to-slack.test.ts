import * as EnvModule from '@core/constants/environment';
import { type MappedError } from 'utils/process-error';
import { describe, expect, it, vi } from 'vitest';
import * as isUserNotLoggedInOnWebsiteErrorModule from '../is-not-logged-in-profile-request-error';
import * as GetCorrectErrorSlackChannelModule from './get-correct-error-slack-channel';
import * as SendSlackMessageModule from './get-slack-sender';
import { logErrorToSlack, makeSlackErrorText } from './log-error-to-slack';

// TODO: Fix this test suite
describe.skip(logErrorToSlack.name, () => {
  const someError = new Error('my foot really hurts');

  const error: MappedError = {
    body: someError.message,
    responseType: {
      statusCode: 500,
      message: 'Server Error',
      code: 0,
    },
    originalError: someError,
  };

  it('should not execute a network request if the SLACK_ERROR_CHANNEL_WEBHOOK_URL is not set', async () => {
    vi.spyOn(EnvModule, 'getEnv').mockReturnValueOnce({
      SLACK_ERROR_CHANNEL_WEBHOOK_URL: '',
    } as ReturnType<typeof EnvModule.getEnv>);

    const slackSenderSpy = vi.fn();
    vi.spyOn(SendSlackMessageModule, 'getSlackSender').mockReturnValue(slackSenderSpy);

    await logErrorToSlack(error);

    expect(slackSenderSpy).not.toHaveBeenCalled();
  });

  it('should execute the network request correctly if the SLACK_ERROR_CHANNEL_WEBHOOK_URL is set', async () => {
    const url = 'https://some-slack-webhook.com';

    vi.spyOn(GetCorrectErrorSlackChannelModule, 'getCorrectErrorSlackChannel').mockReturnValueOnce(
      url
    );

    const slackSenderSpy = vi.fn();
    vi.spyOn(SendSlackMessageModule, 'getSlackSender').mockReturnValueOnce(slackSenderSpy);

    await logErrorToSlack(error);

    expect(slackSenderSpy).toHaveBeenCalled();
    expect(slackSenderSpy).toHaveBeenCalledWith({
      url,
      text: makeSlackErrorText(error),
    });
  });

  it('should NOT log to slack if isUserNotLoggedInOnWebsiteError is true', async () => {
    vi.spyOn(
      isUserNotLoggedInOnWebsiteErrorModule,
      'isUserNotLoggedInOnWebsiteError'
    ).mockReturnValueOnce(true);

    const url = 'https://some-slack-webhook.com';

    vi.spyOn(EnvModule, 'getEnv').mockReturnValueOnce({
      SLACK_ERROR_CHANNEL_WEBHOOK_URL: url,
    } as ReturnType<typeof EnvModule.getEnv>);

    const slackSenderSpy = vi.fn();

    vi.spyOn(SendSlackMessageModule, 'getSlackSender').mockReturnValueOnce(slackSenderSpy);

    await logErrorToSlack(error);

    expect(slackSenderSpy).not.toHaveBeenCalled();
  });

  it('should get the correct slack error channel', async () => {
    const slackChannelMock = 'https://some-slack-channel.com';

    vi.spyOn(GetCorrectErrorSlackChannelModule, 'getCorrectErrorSlackChannel').mockReturnValueOnce(
      slackChannelMock
    );

    const slackSenderSpy = vi.fn();
    vi.spyOn(SendSlackMessageModule, 'getSlackSender').mockReturnValueOnce(slackSenderSpy);

    await logErrorToSlack(error);

    expect(slackSenderSpy).toHaveBeenCalledWith({
      url: slackChannelMock,
      text: makeSlackErrorText(error),
    });
  });
});
