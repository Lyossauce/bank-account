import { APIGatewayProxyEvent } from 'aws-lambda';
import * as postDepositValidator from '../../../../src/apps/helpers/validators/postDepositValidator';
import * as createAndApplyOperation from '../../../../src/apps/operations/services/createAndApplyOperation';
import { AccountRepository } from '../../../../src/apps/helpers/repositories/AccountRepository';
import { AccountDbRecord } from '../../../../src/models/DBRecords';
import { postDepositController } from '../../../../src/apps/operations/controllers/postOperationController';

describe('Post Operation Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  let request: APIGatewayProxyEvent;

  const input = {
    accountId: 'account',
    amount: 300,
  };

  const account : AccountDbRecord = {
        id: 'account',
        balance: 1000
  }

  describe('postOperationController', () => {
    let postDepositValidatorSpy: jest.SpyInstance;
    let getOneAccountSpy: jest.SpyInstance;
    let createAndApplyOperationSpy: jest.SpyInstance;

    beforeAll(() => {
        postDepositValidatorSpy = jest.spyOn(postDepositValidator, 'postDepositValidator');
        getOneAccountSpy = jest.spyOn(AccountRepository, 'getOne');
        createAndApplyOperationSpy = jest.spyOn(createAndApplyOperation, 'createAndApplyOperation');
        createAndApplyOperationSpy.mockResolvedValue('id');
    });

    it('should return 201 with operation id', async () => {
      request = {
      } as APIGatewayProxyEvent;

      const expectedOutput = {
        statusCode: 201,
        body: JSON.stringify({
          id: 'id',
        }),
      };

      postDepositValidatorSpy.mockResolvedValue(input);
      getOneAccountSpy.mockResolvedValue(account);

      const response = await postDepositController(request);

      expect(response).toStrictEqual(expectedOutput);
      expect(postDepositValidatorSpy).toHaveBeenCalledTimes(1);
      expect(postDepositValidatorSpy).toHaveBeenCalledWith(request);
      expect(getOneAccountSpy).toHaveBeenCalledTimes(1);
      expect(getOneAccountSpy).toHaveBeenCalledWith(input.accountId);
      expect(createAndApplyOperationSpy).toHaveBeenCalledTimes(1);
      expect(createAndApplyOperationSpy).toHaveBeenCalledWith(input, 'DEPOSIT', account);
    });

    it('should return 400 error when postDepositValidator throw error', async () => {
      request = {
      } as APIGatewayProxyEvent;

      const error = new Error('error message');

      const expectedOutput = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'error message',
        }),
      };

      postDepositValidatorSpy.mockRejectedValue(error);

      const response = await postDepositController(request);

      expect(response).toStrictEqual(expectedOutput);
      expect(postDepositValidatorSpy).toHaveBeenCalledTimes(1);
      expect(postDepositValidatorSpy).toHaveBeenCalledWith(request);
      expect(getOneAccountSpy).toHaveBeenCalledTimes(0);
      expect(createAndApplyOperationSpy).toHaveBeenCalledTimes(0);
    });

    it('should return 404 error when no account found', async () => {
        request = {
        } as APIGatewayProxyEvent;
  
        const expectedOutput = {
          statusCode: 404,
          body: JSON.stringify({
            message: 'ACCOUNT NOT FOUND',
          }),
        };
  
        postDepositValidatorSpy.mockResolvedValue(input);
        getOneAccountSpy.mockResolvedValue(undefined);
  
        const response = await postDepositController(request);
  
        expect(response).toStrictEqual(expectedOutput);
        expect(postDepositValidatorSpy).toHaveBeenCalledTimes(1);
        expect(postDepositValidatorSpy).toHaveBeenCalledWith(request);
        expect(getOneAccountSpy).toHaveBeenCalledTimes(1);
        expect(getOneAccountSpy).toHaveBeenCalledWith(input.accountId);
        expect(createAndApplyOperationSpy).toHaveBeenCalledTimes(0);
      });
  });
});
