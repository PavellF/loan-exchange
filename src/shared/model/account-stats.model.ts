export interface IAccountStats {
  allTimeIncoming?: number;
  allTimePaymentForLoan?: number;
}

export const defaultValue: Readonly<IAccountStats> = {};
