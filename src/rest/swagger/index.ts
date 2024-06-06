import { ENV } from '@core/constants/environment';
import { CURRENT_PROJECT_CONFIG } from '@core/constants/project-config';
import { SWAGGER_ROUTES } from 'constants/swagger';
import { createApiHandler } from 'utils/api-handler/create-api-handler';
import { getSwaggerTitle } from 'utils/swagger/get-swagger-title';

export function makeSwaggerDocsApiHandler() {
  return createApiHandler({
    schema: {},
    // TODO: Remove this after the `makeAPIResponse` is being refactor to accept headers
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handler: () => {
      const swaggerTitle = getSwaggerTitle({
        stage: ENV.STAGE,
        projectName: CURRENT_PROJECT_CONFIG.name,
      });

      const body = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>${swaggerTitle}</title>
            <link href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.8/swagger-ui.min.css" rel="stylesheet">
          </head>
          <body>
            <div id="swagger"></div>
          </body>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.8/swagger-ui-bundle.min.js"></script>
          <script>
            SwaggerUIBundle({
              dom_id: '#swagger',
              url: '${SWAGGER_ROUTES.swaggerJson.path}'
            });
          </script>
        </html>`;

      return {
        statusCode: 200,
        headers: {
          'content-type': 'text/html',
        },
        body,
      };
    },
    type: 'public',
  });
}

export const apiHandler = makeSwaggerDocsApiHandler();
