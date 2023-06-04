import { AccountRepository } from '../../helpers/repositories/AccountRepository';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { OperationDbRecord } from '../../../models/DBRecords';
import { OperationRepository } from '../../helpers/repositories/OperationRepository';

/**
 * @name getOperationsController
 * @description Get list of operations sorted by date
 * @param {APIGatewayProxyEvent} request
 *
 */
export const getOperationsController = async (request: APIGatewayProxyEvent) => {
  const accountId = (request.pathParameters as Record<string, any>).accountId;

  const account = await AccountRepository.getOne(accountId);

  if (!account) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'ACCOUNT NOT FOUND',
      }),
    };
  }

  const operations: OperationDbRecord[] = await OperationRepository.getByAccountId(accountId);


  return {
    statusCode: 200,
    body: JSON.stringify({
      results: operations.map((operation: OperationDbRecord) => {
        return {
          date: operation.date,
          amount: operation.amount,
          balance: operation.balance,
          type: operation.type,
        };
      }),
    }),
  };
};
