import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { getClient } from './dynamodbHelper';
import { OperationDbRecord } from '../../../models/DBRecords';

export const OperationRepository = {

  /**
 * @name createOne
 * @description Create an operation
 * @param {OperationDbRecord} record
 *
 */
  createOne: async (record: OperationDbRecord): Promise<void> => {
    const param : PutItemCommandInput = {
      TableName: process.env.operationsTableName,
      Item: marshall(record),
    };

    await getClient().send(new PutItemCommand(param));
  },

  /**
 * @name getByAccountId
 * @description Get last operations for a given account in date order
 * @param {OperationDbRecord} record
 *
 * @returns {AccountDbRecord} Account if found
 */
  getByAccountId: async (accountId: string): Promise<OperationDbRecord[]> => {
    const params: QueryCommandInput = {
      TableName: process.env.operationsTableName,
      IndexName: 'accountIndex',
      KeyConditionExpression: '#accountId = :accountId',
      ExpressionAttributeValues: marshall({
        ':accountId': accountId,
      }),
      ExpressionAttributeNames: { '#accountId': '_accountId' },
      ScanIndexForward: false,
    };

    const output: QueryCommandOutput = await getClient().send(new QueryCommand(params));

    return output.Items ? output.Items.map(item => unmarshall(item)) as OperationDbRecord[] : [];
  },
};
