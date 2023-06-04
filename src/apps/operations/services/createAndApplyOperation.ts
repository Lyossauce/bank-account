import { AccountDbRecord, OperationDbRecord } from '../../../models/DBRecords';
import { OperationType, postOperationInput } from '../../../models/operation';
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
  const newBalance = type === 'DEPOSIT' ? input.amount + account.balance : account.balance - input.amount;

  const operation : OperationDbRecord = {
    id: randomUUID(),
    _accountId: input.accountId,
    type,
    date: new Date().toISOString(),
    amount: input.amount,
    balance: newBalance,
  };

  // Eventuellement retourner la balance
  await AccountRepository.updateBalance(operation.amount, type);

  await OperationRepository.createOne(operation);

  return operation.id;
};
