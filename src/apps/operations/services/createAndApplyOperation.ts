import { AccountDbRecord, OperationDbRecord } from '../../../models/DBRecords';
import { postOperationInput } from '../../../models/operation';
import { randomUUID } from 'crypto';

export const createAndApplyOperation = async (input: postOperationInput, type: 'DEPOSIT' | 'WITHDRAWAL', account: AccountDbRecord): Promise<string> => {
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
