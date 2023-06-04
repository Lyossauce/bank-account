import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { getClient } from './dynamodbHelper';
import { marshall } from '@aws-sdk/util-dynamodb';
import { OperationDbRecord } from '../../../models/DBRecords';

export const OperationRepository = {

  /**
 * @name createOne
 * @description Create an operation
 * @param {OperationDbRecord} record
 *
 * @returns {AccountDbRecord | undefined} Account if found
 */
  createOne: async (record: OperationDbRecord): Promise<void> => {
    const param : PutItemCommandInput = {
      TableName: process.env.accountTableName,
      Item: marshall(record),
    };

    await getClient().send(new PutItemCommand(param));
  },
};
