import {Moment} from 'moment';
import {IUser} from "./user.model";
import {DealStatus} from "./deal-status";
import {PaymentInterval} from "./payment-interval";

export interface IDeal {
  id?: number;
  dateOpen?: Moment;
  dateBecomeActive?: Moment;
  endDate?: Moment;
  startBalance?: number;
  percent?: number;
  successRate?: number;
  term?: number;
  paymentEvery?: PaymentInterval;
  status?: DealStatus;
  emitter?: IUser;
  recipient?: IUser;
}

export const defaultValue: Readonly<IDeal> = {};

export const getSuccessRateForDeal = (deal: IDeal): number => {
  return getSuccessRate(
    deal.term || 0,
    deal.percent ||0,
    deal.paymentEvery || PaymentInterval.ONE_TIME
  );
};

export const getSuccessRate = (term: number, rate: number, rateType: PaymentInterval): number => {
  let successRate = 100;

  // bigger term - bigger successRate
  const termModifier = 20;
  const termRate = Math.round(term / termModifier);
  if (termRate < termModifier) {
    successRate = successRate - (termModifier - termRate);
  }

  //bigger rate - lesser successRate
  let rateAtomic = 1;

  if (rateType === PaymentInterval.MONTH) {
    rateAtomic = 2;
  } else if (rateType === PaymentInterval.DAY) {
    rateAtomic = 18;
  }

  return Math.max(Math.floor(successRate - rateAtomic * rate), 1);
};


