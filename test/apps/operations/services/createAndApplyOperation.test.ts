import { AccountRepository } from "../../../../src/apps/helpers/repositories/AccountRepository";
import { OperationRepository } from "../../../../src/apps/helpers/repositories/OperationRepository";
import { createAndApplyOperation } from "../../../../src/apps/operations/services/createAndApplyOperation";
import { OperationDbRecord } from "../../../../src/models/DBRecords";

describe('Create and Apply Operation Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAndApplyOperation', () => {
    let updateBalanceSpy: jest.SpyInstance;
    let createOneOperationSpy: jest.SpyInstance;

    beforeAll(() => {
        updateBalanceSpy = jest.spyOn(AccountRepository, 'updateBalance');
        createOneOperationSpy = jest.spyOn(OperationRepository, 'createOne');
    });

    it('create one operation', async () => {
        const input = {
            amount: 300,
            accountId: 'account'
        }

        const account = {
            id: 'account',
            balance: 1000
        }

        const type = 'DEPOSIT';

      const expectedOutput = expect.any(String);

      const newBalance = 1000;

      const operation: OperationDbRecord =  {
        id: expect.any(String),
        _accountId: input.accountId,
        type,
        amount: input.amount,
        balance: newBalance,
        date: expect.any(String),
      }

      updateBalanceSpy.mockResolvedValue(newBalance);
      createOneOperationSpy.mockResolvedValue(undefined);

      const response = await createAndApplyOperation(input, type, account);

      expect(response).toStrictEqual(expectedOutput);
      expect(updateBalanceSpy).toHaveBeenCalledTimes(1);
      expect(updateBalanceSpy).toHaveBeenCalledWith(account.id, input.amount, type);
      expect(createOneOperationSpy).toHaveBeenCalledTimes(1);
      expect(createOneOperationSpy).toHaveBeenCalledWith(operation);
    });

  });
});
