/* eslint-disable no-underscore-dangle */
import { logger } from '@core/utils/commons';
import { type z } from 'zod';

type SchemaProperty = {
  type: string;
  description?: string;
};

const log = (message: string) =>
  logger({
    path: 'packages/lambdas/src/utils/swagger/create-swagger-post-request-body.ts',
    event: 'createSwaggerPostRequestBody',
    log: message,
  });

export function createSwaggerRequestBody(schema: { body: z.ZodObject<z.ZodRawShape> }) {
  return {
    required: true,
    content: {
      'application/json': {
        schema: createSwaggerBodySchema(schema.body),
      },
    },
  };
}

function createSwaggerBodySchema(body: z.ZodObject<z.ZodRawShape>): {
  type: 'object';
  properties: { [key: string]: SchemaProperty };
} {
  // Get the shape of the zod schema
  const { shape } = body;

  // Prepare an empty object for the Swagger schema
  const swaggerSchema: { [key: string]: SchemaProperty } = {};

  // Iterate over each field in the zod schema
  Object.keys(shape).forEach(key => {
    // Get the zod definition for the field
    const zodDefinition = (shape[key] as { _def: ZodDefinition })._def;

    // Add the field to the Swagger schema
    swaggerSchema[key] = {
      type: getSwaggerType(zodDefinition),
    };
  });

  return {
    type: 'object',
    properties: swaggerSchema,
  };
}

type ZodDefinition = {
  typeName: 'ZodString' | 'ZodNumber' | 'ZodOptional' | 'ZodObject' | 'ZodArray' | 'ZodBoolean' | 'ZodNullable';
  innerType: {
    _def: ZodDefinition;
  };
} | {
  typeName: 'ZodEnum';
  values: (string | number | boolean | object)[];
};

function getSwaggerType(zodDefinition: ZodDefinition): string {
  let swaggerType: string;
  switch (zodDefinition.typeName) {
    case 'ZodString':
      swaggerType = 'string';
      break;
    case 'ZodNumber':
      swaggerType = 'number';
      break;
    case 'ZodOptional':
      swaggerType = getSwaggerType(zodDefinition.innerType._def);
      break;
    case 'ZodObject':
      swaggerType = 'object';
      break;
    case 'ZodArray':
      swaggerType = 'array';
      break;
    case 'ZodBoolean':
      swaggerType = 'boolean';
      break;
    case 'ZodNullable':
      swaggerType = getSwaggerType(zodDefinition.innerType._def);
      break;
    case 'ZodEnum':
      swaggerType = typeof zodDefinition.values[0];
      break;
    // Add more cases as needed
    default: {
      const errorMessage = `Unsupported zod type: ${JSON.stringify(zodDefinition)}`;
      log(errorMessage);
      throw new Error(errorMessage);
    }
  }
  return swaggerType;
}
