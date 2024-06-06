import { type Stage } from '@core/constants/commons';
import { sentryServerlessWrapper } from '@core/utils/sentry/sentry-serverless';
import { isCoreStage } from '@core/utils/stages';
import { type Handler } from 'aws-lambda';

export function makeServerlessWrapper(stage: Stage, handler: Handler) {
  if (isCoreStage(stage)) {
    return sentryServerlessWrapper(handler);
  }

  return handler;
}
