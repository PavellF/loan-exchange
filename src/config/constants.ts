export const SERVER_API_URL = 'https://loan-exchange-backend.herokuapp.com/';
//export const SERVER_API_URL = 'http://localhost:8080/';
export const AUTH_TOKEN_KEY = 'authenticationToken';

export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  CREDITOR: 'ROLE_CREDITOR',
  DEBTOR: 'ROLE_DEBTOR'
};

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error'
};

export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
export const CREDIT_FEE_PERCENT = 0.02;
export const CREDIT_MIN_FEE = 10;
export const ITEMS_PER_PAGE = 20;
export const MIN_CREDIT_AMOUNT = 500;

export const DEALS_API = 'api/deals';
export const LOGS_API = 'api/balance-logs';
export const STATS_API = 'api/account/stats';
export const NOTIFICATIONS_API = 'api/notifications';

export const ERROR_NO_MONEY = 'nomoney';
