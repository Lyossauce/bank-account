import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { marshall } from '@aws-sdk/util-dynamodb';
import { AccountDbRecord } from '../../../src/models/DBRecords';
import { AccountRepository } from '../../../src/apps/helpers/repositories/AccountRepository';
import { OperationType } from '../../../src/models/operation';

// @ts-ignore
const dbMock = mockClient(DynamoDBClient);

describe('Account Repository', () => {

  const account : AccountDbRecord = {
    id: 'id',
    balance: 300,
  };


  afterEach(() => {
    jest.clearAllMocks();
    dbMock.reset();
  });

  describe('getOne', () => {
    it('should get one account', async () => {

      dbMock.resolves({ Item: marshall(account) });

      const expectedCommand = {
        TableName: process.env.accountsTableName,
        Key: {
          id: { S: 'id' },
        },
      };

      const result = await AccountRepository.getOne('id');

      expect(result).toStrictEqual(account);
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

    it('should get no account', async () => {

      dbMock.resolves({ Item: undefined });

      const expectedCommand = {
        TableName: process.env.accountsTableName,
        Key: {
          id: { S: 'id' },
        },
      };

      const result = await AccountRepository.getOne('id');

      expect(result).toBeUndefined();
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

  });

  describe('updateBalance', () => {
    const amount = 300;

    let expectedCommand : Record<string, any>;

    beforeEach(()=> {
        expectedCommand = {
            TableName: process.env.accountsTableName,
            Key: {
            id: { S: account.id },
            },
            ExpressionAttributeValues: {
                ':increment': {N: "300"},
                ':minimum': {N: "0"}
            },
            ExpressionAttributeNames: {
                '#balance': 'balance',
            },
            UpdateExpression: 'SET #balance = #balance + :increment',
            ConditionExpression: '#balance >= :minimum',
            ReturnValues: 'UPDATED_NEW',
        };
    })

    it('should update the account with DEPOSIT', async () => {

        const type : OperationType = "DEPOSIT"

        
        dbMock.resolves({
            Attributes: marshall({balance:300})
        });

      const response = await AccountRepository.updateBalance(account.id, amount, type);

      expect(response).toEqual(300);
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

    it('should update the account with WITHDRAWAL', async () => {

        const type : OperationType = "WITHDRAWAL"
        expectedCommand.ExpressionAttributeValues = {
            ':increment': {N: "-300"},
            ':minimum': {N: "300"}
        }
        
        dbMock.resolves({
            Attributes: marshall({balance:300})
        });

      const response = await AccountRepository.updateBalance(account.id, amount, type);

      expect(response).toEqual(300);
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

    it('should should throw conditional error', async () => {

    const type : OperationType = "DEPOSIT"
    
    dbMock.rejects(new Error('The conditional request failed'));

    const expectedError = new Error('Money in the account not sufficient for this withdrawal');

      await expect(async () => {
        await AccountRepository.updateBalance(account.id, amount, type);
      }).rejects.toThrow(expectedError);

      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

    it('should should throw other error', async () => {

        const type : OperationType = "DEPOSIT"

        const expectedError = new Error('error');
        
        dbMock.rejects(expectedError);
    
    
          await expect(async () => {
            await AccountRepository.updateBalance(account.id, amount, type);
          }).rejects.toThrow(expectedError);
    
          expect(dbMock.calls()).toHaveLength(1);
          expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
        });

  });
});
