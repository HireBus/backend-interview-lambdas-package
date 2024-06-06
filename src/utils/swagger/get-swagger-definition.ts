import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../../package.json';
import { getSwaggerTitle } from './get-swagger-title';

export function getSwaggerDefinition({
  swaggerPaths,
  stage,
  projectName,
}: {
  swaggerPaths: swaggerJsdoc.Paths;
  stage: string;
  projectName: string;
}) {
  const swaggerTitle = getSwaggerTitle({ stage, projectName });

  const options: swaggerJsdoc.OAS3Options = {
    definition: {
      openapi: '3.1.0',
      info: {
        title: swaggerTitle,
        version,
      },
      paths: {
        ...swaggerPaths,
      },
      components: {
        securitySchemes: {
          'ID Token': {
            type: 'apiKey',
            name: 'x-id-token',
            in: 'header',
          },
        },
      },
    },
    apis: [],
  };

  const swaggerDefinition = swaggerJsdoc(options);

  return swaggerDefinition;
}
