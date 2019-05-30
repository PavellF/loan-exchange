import {PaymentInterval} from "../model/payment-interval";
import {CREDIT_FEE_PERCENT, CREDIT_MIN_FEE} from "../../config/constants";
import {IDeal} from "../model/deal.model";

/**
 * Computes difference in relative unit.
 * Example:
 * beforeChange = 500
 * afterChange = 400
 * After being changed value became 500 - 100 = 400; function returns percent representation of -100: -20%
 * 'Value became 20% lesser'
 * */
export const percentageDifference = (beforeChange: number, afterChange: number): number => {
  return ((afterChange - beforeChange) / beforeChange) * 100;
};

export interface IExpectedProfit {
  profit: number,
  fee: number,
  averagePayment: number,
  profitInPercent: number
}

export const getExpectedProfitForDeal = (deal: IDeal): IExpectedProfit => {
  return getExpectedProfit(
    deal.startBalance || 0,
    deal.percent || 0,
    deal.term || 0,
    deal.paymentEvery || PaymentInterval.ONE_TIME
  );
};

export const getExpectedProfit = (credit: number, rate: number,
                                  term: number, rateType: PaymentInterval): IExpectedProfit => {
  if (rateType === undefined || rateType === PaymentInterval.ONE_TIME) {
    term = 1;
  }

  const overhead = term * (credit * (rate / 100));
  let profit = overhead + credit;
  const averagePayment = profit / term;
  const fee = profit * CREDIT_FEE_PERCENT;

  if (isNaN(profit)) {
    return {profit: credit, fee: 0, averagePayment: 0, profitInPercent: 0};
  }

  if (fee < CREDIT_MIN_FEE) {
    profit = profit - CREDIT_MIN_FEE;
  } else {
    profit = profit - fee;
  }

  const profitInPercent = (profit / credit) * 100 - 100;

  return {
    profit: Math.round(profit),
    fee: Math.round(fee),
    averagePayment: Math.round(averagePayment),
    profitInPercent
  };
};
