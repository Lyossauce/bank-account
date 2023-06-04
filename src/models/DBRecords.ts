import { OperationType } from "./operation"

export interface AccountDbRecord {
    id: string
    balance: number
}

export interface OperationDbRecord {
    id: string
    _accountId: string
    type: OperationType
    date: string
    amount: number
    balance: number
}
