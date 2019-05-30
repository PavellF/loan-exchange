import {Moment} from 'moment';
import {BalanceLogEvent} from "./balance-log-event";
import {IUser} from "./user.model";

export interface INotification {
  id?: number;
  date?: Moment;
  type?: BalanceLogEvent;
  recipient?: IUser;
  associatedDeal?: number;
}

export const defaultValue: Readonly<INotification> = {};
