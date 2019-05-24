import moment, {Moment} from 'moment';
import {IDeal} from "./deal.model";
import {IUser} from "./user.model";
import {BalanceLogEvent} from "./balance-log-event";

export interface IBalanceLog {
  id: number;
  date: Moment;
  oldValue: number;
  amountChanged: number;
  type: BalanceLogEvent;
  account?: IUser;
  deal?: IDeal;
}

export const defaultValue: Readonly<IBalanceLog> = {
  id: 0,
  date: moment(),
  oldValue: 0,
  amountChanged: 0,
  type: BalanceLogEvent.PERCENT_CHARGE
};
