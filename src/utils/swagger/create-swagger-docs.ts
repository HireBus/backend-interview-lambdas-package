import type swaggerJSDoc from 'swagger-jsdoc';
import { type z } from 'zod';
import { type Optional } from 'types/index';
import { createSwaggerRequestBody } from 'src/utils/swagger/create-swagger-request-body';

interface SwaggerDocs {
  [path: string]: {
    get?: RequestBody;
    post?: RequestBody;
    put?: RequestBody;
    delete?: RequestBody;
  };
}

type RequestBody = Optional<swaggerJSDoc.RequestBody, 'content'>;
type Responses = Optional<swaggerJSDoc.Response, 'description'>;

type SwaggerGetRequestParams = {
  path: string;
  method: 'get';
  description: string;
  tags: string[];
  parameters: swaggerJSDoc.Parameter[];
  responses: Responses;
  requireIdToken: boolean;
  schema?: {
    queryStringParameters: z.ZodObject<z.ZodRawShape>;
  };
};

type SwaggerPostRequestParams = {
  path: `/${string}`;
  method: 'post';
  description: string;
  tags: string[];
  requestBody?: RequestBody;
  responses?: Responses;
  requireIdToken: boolean;
  schema?: { body: z.ZodObject<z.ZodRawShape> };
};

type SwaggerPutRequestParams = {
  path: `/${string}`;
  method: 'put';
  description: string;
  tags: string[];
  requestBody?: RequestBody;
  parameters: swaggerJSDoc.Parameter[];
  responses?: Responses;
  requireIdToken: boolean;
  schema?: { body: z.ZodObject<z.ZodRawShape> };
}

type SwaggerDeleteRequestParams = {
  path: string;
  method: 'delete';
  description: string;
  tags: string[];
  parameters: swaggerJSDoc.Parameter[];
  responses?: Responses;
  requireIdToken: boolean;
};

export const defaultResponses = {
  200: {
    description: 'Success',
  },
};

export function createSwaggerDocs(
  params: SwaggerGetRequestParams | SwaggerPostRequestParams | SwaggerPutRequestParams | SwaggerDeleteRequestParams
): swaggerJSDoc.Paths {
  const docs: SwaggerDocs = {
    [params.path]: {
      [params.method]: {
        description: params.method,
        tags: params.tags,
        responses: params.responses ?? defaultResponses,
      },
    },
  };
  docs[params.path]![params.method] = getDocsForMethod(params);

  return docs as swaggerJSDoc.Paths;
}

function getSwaggerRequestBody(params: SwaggerPostRequestParams | SwaggerPutRequestParams): RequestBody | undefined {
  if (params.schema) {
    return createSwaggerRequestBody(params.schema);
  }
  return params.requestBody;

}

function getDocsForMethod(params: SwaggerGetRequestParams | SwaggerPostRequestParams | SwaggerPutRequestParams | SwaggerDeleteRequestParams): RequestBody {
  if (params.method === 'get') {
    return {
      description: params.description,
      tags: params.tags,
      parameters: params.parameters,
      responses: params.responses ?? defaultResponses,
      security: params.requireIdToken ? [{ 'ID Token': [] }] : undefined,
    }
  }
  if (params.method === 'post') {
    return {
      description: params.description,
      tags: params.tags,
      requestBody: getSwaggerRequestBody(params),
      responses: params.responses ?? defaultResponses,
      security: params.requireIdToken ? [{ 'ID Token': [] }] : undefined,
    }
  }
  if (params.method === 'put') {
    return {
      description: params.description,
      tags: params.tags,
      parameters: params.parameters,
      requestBody: getSwaggerRequestBody(params),
      responses: params.responses ?? defaultResponses,
      security: params.requireIdToken ? [{ 'ID Token': [] }] : undefined,
    }
  }
  return {
    description: params.description,
    tags: params.tags,
    parameters: params.parameters,
    responses: params.responses ?? defaultResponses,
    security: params.requireIdToken ? [{ 'ID Token': [] }] : undefined,
  }
}
