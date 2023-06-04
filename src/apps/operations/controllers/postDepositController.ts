import { AccountDbRecord } from '../../../models/DBRecords';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { postDepositValidator } from '../../helpers/validators/postDepositValidator';
import { postOperationInput } from '../../../models/operation';

/**
 * @name postDepositController
 * @description Desposit a given amount into an account
 * @param {APIGatewayProxyEvent} request
 *
 */
export const postDepositController = async (request: APIGatewayProxyEvent) => {

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

  let account : AccountDbRecord;
  try {
    account = await AccountRepository.getOne(input.accountId);
  } catch (e) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'ACCOUNT NOT FOUND',
      }),
    };
  }


};
