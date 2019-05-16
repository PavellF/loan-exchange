import React from 'react';
import Overview from 'app/modules/account/account/overview/overview';
import AccountLogs from 'app/shared/numeric-log-card/account-logs';

const AccountOverview = props => {
  return (
    <div>
      <Overview />
      <div style={{ marginTop: '1rem' }}>
        <AccountLogs />
      </div>
    </div>
  );
};

export default AccountOverview;
