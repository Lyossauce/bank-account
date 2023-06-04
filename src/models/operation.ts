export type OperationType = "DEPOSIT" | "WITHDRAWAL";

export interface postOperationInput {
    amount: number
    accountId: string
}