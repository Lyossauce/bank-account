export interface AccountDbRecord {
    id: string
    balance: number
}

export interface OperationDbRecord {
    id: string
    _accountId: string
    type: 'DEPOSIT' | 'WITHDRAWAL'
    date: string
    amount: number
    balance: number
}
