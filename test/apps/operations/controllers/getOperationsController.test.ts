import { APIGatewayProxyEvent } from 'aws-lambda';
import * as postDepositValidator from '../../../../src/apps/helpers/validators/postOperationValidator';
import * as createAndApplyOperation from '../../../../src/apps/operations/services/createAndApplyOperation';
import { AccountRepository } from '../../../../src/apps/helpers/repositories/AccountRepository';
import { AccountDbRecord, OperationDbRecord } from '../../../../src/models/DBRecords';
import { postOperationController } from '../../../../src/apps/operations/controllers/postOperationController';
import { OperationRepository } from '../../../../src/apps/helpers/repositories/OperationRepository';
import { getOperationsController } from '../../../../src/apps/operations/controllers/getOperationsController';

describe('GET Operations Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  const request : APIGatewayProxyEvent = {
        pathParameters: {
            accountId: 'account'
        }
    } as unknown as APIGatewayProxyEvent;

  const account : AccountDbRecord = {
        id: 'account',
        balance: 1000
  }

  describe('getOperationsController', () => {
    let getOneAccountSpy: jest.SpyInstance;
    let getOperationsgetByAccountIdSpy: jest.SpyInstance;

    const operation : OperationDbRecord = {
        id: 'id',
        _accountId: 'accountId',
        date: 'date',
        balance: 1000,
        amount: 300,
        type: 'DEPOSIT'
      };

    beforeAll(() => {
        getOneAccountSpy = jest.spyOn(AccountRepository, 'getOne');
        getOperationsgetByAccountIdSpy = jest.spyOn(OperationRepository, 'getByAccountId');
    });

    it('should return 200 with list of operations', async () => {

      const expectedOutput = {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            date: operation.date,
            amount: operation.amount,
            balance: operation.balance,
            type: operation.type,
          }]
        }),
      };

      getOneAccountSpy.mockResolvedValue(account);
      getOperationsgetByAccountIdSpy.mockResolvedValue([operation]);

      const response = await getOperationsController(request);

      expect(response).toStrictEqual(expectedOutput);
      expect(getOneAccountSpy).toHaveBeenCalledTimes(1);
      expect(getOneAccountSpy).toHaveBeenCalledWith('account');
      expect(getOperationsgetByAccountIdSpy).toHaveBeenCalledTimes(1);
      expect(getOperationsgetByAccountIdSpy).toHaveBeenCalledWith('account');
    });

    it('should return 404 error when no account found', async () => {
        const expectedOutput = {
          statusCode: 404,
          body: JSON.stringify({
            message: 'ACCOUNT NOT FOUND',
          }),
        };
  
        getOneAccountSpy.mockResolvedValue(undefined);
  
        const response = await getOperationsController(request);
  
        expect(response).toStrictEqual(expectedOutput);
        
        expect(getOneAccountSpy).toHaveBeenCalledTimes(1);
        expect(getOneAccountSpy).toHaveBeenCalledWith('account');
        expect(getOperationsgetByAccountIdSpy).toHaveBeenCalledTimes(0);
      });
  });
});
