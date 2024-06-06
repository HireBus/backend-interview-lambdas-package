import { isTestRuntime } from '@core/utils/environment/is-test-runtime';
import axios from 'axios';

type SlackSender = ({ url, text }: { url: string; text: string }) => Promise<void>;

export function getSlackSender(): SlackSender {
  if (isTestRuntime()) {
    return async () => {};
  }
  return ({ url, text }) => axios.post(url, { text });
}
