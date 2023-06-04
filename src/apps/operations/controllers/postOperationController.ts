import { OperationType, postOperationInput } from '../../../models/operation';
import { AccountRepository } from '../../helpers/repositories/AccountRepository';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { createAndApplyOperation } from '../services/createAndApplyOperation';
import { postDepositValidator } from '../../helpers/validators/postDepositValidator';

/**
 * @name postOperationController
 * @description Desposit or withdraw a given amount into an account
 * @param {APIGatewayProxyEvent} request
 *
 */
export const postOperationController = async (request: APIGatewayProxyEvent, type: OperationType) => {

  let input: postOperationInput;
  try {
    input = await postDepositValidator(request);
  } catch (e: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: e.message,
      }),
    };
  }

  const account = await AccountRepository.getOne(input.accountId);

  if (!account) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'ACCOUNT NOT FOUND',
      }),
    };

  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: await createAndApplyOperation(input, type, account),
    }),
  };

};
