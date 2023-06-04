import { AccountDbRecord, OperationDbRecord } from '../../../models/DBRecords';
import { OperationType, postOperationInput } from '../../../models/operation';
import { AccountRepository } from '../../helpers/repositories/AccountRepository';
import { OperationRepository } from '../../helpers/repositories/OperationRepository';
import { randomUUID } from 'crypto';

/**
 * @name createAndApplyOperation
 * @description Create the operation and apply the balance change to the account
 * @param {postOperationInput} input
 * @param {OperationType} type
 * @param {AccountDbRecord} account
 *
 */
export const createAndApplyOperation = async (input: postOperationInput, type: OperationType, account: AccountDbRecord): Promise<string> => {
  const newBalance = await AccountRepository.updateBalance(account.id, input.amount, type);

  const operation : OperationDbRecord = {
    id: randomUUID(),
    _accountId: input.accountId,
    type,
    date: new Date().toISOString(),
    amount: input.amount,
    balance: newBalance,
  };

  await OperationRepository.createOne(operation);

  return operation.id;
};
