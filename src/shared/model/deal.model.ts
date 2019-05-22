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
  averagePayment?: number;
  paymentEvery?: PaymentInterval;
  status?: DealStatus;
  emitter?: IUser;
  recipient?: IUser;
}

export const defaultValue: Readonly<IDeal> = {};
