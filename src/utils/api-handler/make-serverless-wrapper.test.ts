import { STAGES } from '@core/constants/commons';
import * as SentryModule from '@core/utils/sentry/sentry-serverless';
import { type Handler } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { makeServerlessWrapper } from './make-serverless-wrapper';

const handler = (() => 'hello') as unknown as Handler;

describe(makeServerlessWrapper.name, () => {
  it('should call the sentryServerlessWrapper when the stage is core', () => {
    const spy = vi.spyOn(SentryModule, 'sentryServerlessWrapper').mockImplementation(a => a);
    const coreStages = [STAGES.Dev, STAGES.Staging, STAGES.Prod];

    coreStages.forEach(stage => {
      makeServerlessWrapper(stage, handler);
      expect(spy).toHaveBeenCalledWith(handler);
    });

    expect(spy).toHaveBeenCalledTimes(coreStages.length);
  });

  it('should not call the sentryServerlessWrapper when the stage is not core', () => {
    const spy = vi.spyOn(SentryModule, 'sentryServerlessWrapper').mockImplementation(a => a);
    const notCoreStages = ['rodrick', 'nick', 'pato', 'any'];

    notCoreStages.forEach(stage => {
      // Note: Disabled because we are forcing the type to not follow the Stage type
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      makeServerlessWrapper(stage, handler);
      expect(spy).not.toHaveBeenCalledWith(handler);
    });

    expect(spy).not.toBeCalled();
  });
});
