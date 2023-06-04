import { GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { AccountDbRecord } from '../../../models/DBRecords';
import { getClient } from './dynamodbHelper';

export const AccountRepository = {

  /**
 * @name getOne
 * @description GET one account with a given id
 * @param {string} id
 *
 * @returns {AccountDbRecord | undefined} Account if found
 */
  getOne: async (id: string): Promise<AccountDbRecord | undefined> => {
    const param : GetItemCommandInput = {
      TableName: process.env.accountTableName,
      Key: marshall({ id }),
    };

    const result = await getClient().send(new GetItemCommand(param));

    return result.Item ? unmarshall(result.Item) as AccountDbRecord : undefined;
  },
};
