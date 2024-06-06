import * as EnvModule from '@core/constants/environment';
import { HTTP_RESPONSES } from 'constants/http';
import { type MappedError } from 'utils/process-error';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCorrectErrorSlackChannel } from './get-correct-error-slack-channel';

describe(getCorrectErrorSlackChannel.name, () => {
  const defaultError: MappedError = {
    body: 'some error',
    responseType: HTTP_RESPONSES.BadRequest,
  };

  const spyMockEnv = (env: object) => {
    vi.spyOn(EnvModule, 'ENV', 'get').mockReturnValue(env as ReturnType<typeof EnvModule.getEnv>);
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  const validAssessmentErrorPathnames = [
    { pathname: '/survey/register' },
    { pathname: '/survey/take' },
    { pathname: '/survey/thank-you' },
  ];

  it.each(validAssessmentErrorPathnames)(
    'should return the assessments error channel if it is an assessment error with pathname $pathname',
    ({ pathname }) => {
      const assessmentErrorChannelMockUrl = 'https://some-assessment-error-channel.com';

      spyMockEnv({
        SLACK_ASSESSMENT_ERROR_CHANNEL_WEBHOOK_URL: assessmentErrorChannelMockUrl,
      });

      const error: MappedError = {
        ...defaultError,
        pathname,
      };

      const result = getCorrectErrorSlackChannel(error);

      expect(result).toBe(assessmentErrorChannelMockUrl);
    }
  );

  it.each([{ pathname: '/some-other-path' }, { pathname: undefined }])(
    'should return the default error channel if the pathname is $pathname',
    ({ pathname }) => {
      const defaultErrorChannelMockUrl = 'https://some-default-error-channel.com';

      spyMockEnv({
        SLACK_ERROR_CHANNEL_WEBHOOK_URL: defaultErrorChannelMockUrl,
      });

      const error: MappedError = {
        ...defaultError,
        pathname,
      };

      const result = getCorrectErrorSlackChannel(error);

      expect(result).toBe(defaultErrorChannelMockUrl);
    }
  );

  it('should get the default error channel if there is no assessments error channel', () => {
    const defaultErrorChannelMockUrl = 'https://some-default-error-channel.com';

    spyMockEnv({
      SLACK_ERROR_CHANNEL_WEBHOOK_URL: defaultErrorChannelMockUrl,
      SLACK_ASSESSMENT_ERROR_CHANNEL_WEBHOOK_URL: undefined,
    });

    const error: MappedError = {
      ...defaultError,
      pathname: '/survey/register',
    };

    const result = getCorrectErrorSlackChannel(error);

    expect(result).toBe(defaultErrorChannelMockUrl);
  });
});
