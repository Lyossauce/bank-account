import { APIGatewayProxyEvent } from 'aws-lambda';
import Joi from 'joi';
import { postOperationInput } from '../../../models/operation';

/**
 * @name postDepositValidator
 * @description Validate the request
 * @param {APIGatewayProxyEvent} request
 *
 * @returns {Promise<PostPlayerCardInput>}
 */
export const postDepositValidator = async (request: APIGatewayProxyEvent):  Promise<postOperationInput> => {
  if (!request.body) throw new Error('Missing body');

  const schema = Joi.object({
    amount: Joi.number().required(),
  });

  const body = JSON.parse(request.body);

  await schema.validateAsync(body);

  return {
    ...body,
    accountId: request.pathParameters?.accountId as string,
  };
};

