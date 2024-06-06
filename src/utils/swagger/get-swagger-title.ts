import { transformToPascal } from '@core/utils/commons';

export function getSwaggerTitle({ stage, projectName }: { stage: string; projectName: string }) {
  const pascalStage = transformToPascal(stage);
  return `${pascalStage} API - ${projectName}`;
}
