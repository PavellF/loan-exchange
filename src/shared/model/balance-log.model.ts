import {Moment} from 'moment';
import {IDeal} from "./deal.model";
import {IUser} from "./user.model";
import {BalanceLogEvent} from "./balance-log-event";

export interface IBalanceLog {
  id?: number;
  date?: Moment;
  oldValue?: number;
  amountChanged?: number;
  type?: BalanceLogEvent;
  account?: IUser;
  deal?: IDeal;
}

export const defaultValue: Readonly<IBalanceLog> = {};
