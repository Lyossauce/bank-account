import { GetItemCommand, GetItemCommandInput, UpdateItemCommand, UpdateItemCommandInput, UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { AccountDbRecord } from '../../../models/DBRecords';
import { getClient } from './dynamodbHelper';
import { OperationType } from '../../../models/operation';

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

  /**
 * @name updateBalance
 * @description Update the balance of an account and verify if there is enough money available
 * @param {string} id
 * @param {number} amount
 * @param {OperationType} type
 *
 * @returns {number} new balance
 */
  updateBalance: async (id: string, amount: number, type: OperationType): Promise<number> => {
    const params : UpdateItemCommandInput =  {
      TableName: process.env.accountTableName,
      Key: marshall({ id }),
      ExpressionAttributeValues: marshall({
        ':increment': amount * (type === 'DEPOSIT' ? 1 : -1),
        ':minimum': 0,
      }),
      ExpressionAttributeNames: {
        '#balance': 'balance',
      },
      UpdateExpression: 'SET #balance = #balance + :increment',
      ConditionExpression: '#balance + :increment >= :minimum',
      ReturnValues: 'UPDATED_NEW',
    };

    try {
      const output: UpdateItemCommandOutput = await getClient().send(new UpdateItemCommand(params));

      return unmarshall(output.Attributes as Record<string, any>).balance as number;
    } catch (e: any) {
      if (e.message === 'The conditional request failed') {
        throw new Error('Money in the account not sufficient for this withdrawal');
      }

      throw e;
    }
  },
};
