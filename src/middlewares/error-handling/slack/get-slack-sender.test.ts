import * as IsTestRuntimeModule from '@core/utils/environment/is-test-runtime';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { getSlackSender } from './get-slack-sender';

describe(getSlackSender.name, () => {
  it('should return a function that does nothing if the runtime is test', async () => {
    vi.spyOn(IsTestRuntimeModule, 'isTestRuntime').mockReturnValueOnce(true);

    const sender = getSlackSender();

    const axiosPostRequestSpy = vi
      .spyOn(axios, 'post')
      .mockImplementationOnce(() => Promise.resolve({}));

    await sender({ url: 'some-url', text: 'some text' });

    expect(axiosPostRequestSpy).not.toHaveBeenCalled();
  });

  it('should return a function that makes an axios request if the runtime is not test', async () => {
    vi.spyOn(IsTestRuntimeModule, 'isTestRuntime').mockReturnValueOnce(false);

    const sender = getSlackSender();

    const url = 'https://some-slack-webhook.com';

    const axiosPostRequestSpy = vi
      .spyOn(axios, 'post')
      .mockImplementationOnce(() => Promise.resolve({}));

    await sender({ url, text: 'some text' });

    expect(axiosPostRequestSpy).toHaveBeenCalledWith(url, { text: 'some text' });
  });
});
