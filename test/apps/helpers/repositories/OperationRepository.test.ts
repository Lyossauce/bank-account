import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { OperationDbRecord } from '../../../../src/models/DBRecords';
import { OperationRepository } from '../../../../src/apps/helpers/repositories/OperationRepository';

// @ts-ignore
const dbMock = mockClient(DynamoDBClient);

describe('Operation Repository', () => {

  const operation : OperationDbRecord = {
    id: 'id',
    _accountId: 'accountId',
    date: 'date',
    balance: 1000,
    amount: 300,
    type: 'DEPOSIT'
  };


  afterEach(() => {
    jest.clearAllMocks();
    dbMock.reset();
  });

  describe('createOne', () => {
    it('should create one operation', async () => {

      dbMock.resolves({});

      const expectedCommand = {
        TableName: process.env.accountsTableName,
        Item: {
          id: { S: operation.id },
          _accountId: { S: operation._accountId },
          date: { S: operation.date },
          balance: { N: operation.balance.toString() },
          amount: { N: operation.amount.toString() },
          type: { S: operation.type },
        },
      };

      await OperationRepository.createOne(operation);

      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });
  });
});
