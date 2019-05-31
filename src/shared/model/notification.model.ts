import {Moment} from 'moment';
import {BalanceLogEvent} from "./balance-log-event";

export interface INotification {
  id?: number;
  date?: Moment;
  type?: BalanceLogEvent;
  associatedDealId?: number;
}

export const defaultValue: Readonly<INotification> = {};
