// import { logger } from '@core/utils/commons';
// import path from 'path';
import { fileURLToPath } from "url";
import { type MappedError } from "utils/process-error";

const errorHandlerMiddlewareEvent = "errorHandlerMiddleware" as const;

function getPath(): string {
  const currentWorkingDirectory = process.cwd();
  return path.relative(currentWorkingDirectory, getFileName());
}

function getFileName(): string {
  return fileURLToPath(import.meta.url);
}

export function logError(error: MappedError) {
  console.log(error);
  // logger({
  //   path: getPath(),
  //   event: errorHandlerMiddlewareEvent,
  //   log: error,
  // });
}
