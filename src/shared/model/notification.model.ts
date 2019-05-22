import {Moment} from 'moment';
import {BalanceLogEvent} from "./balance-log-event";
import {IUser} from "./user.model";
import {IDeal} from "./deal.model";

export interface INotification {
  id?: number;
  date?: Moment;
  type?: BalanceLogEvent;
  recipient?: IUser;
  associatedDeal?: IDeal;
}

export const defaultValue: Readonly<INotification> = {};
