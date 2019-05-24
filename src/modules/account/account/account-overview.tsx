import React from 'react';
import Overview from "./overview/overview";
import NumericLogCard from "../../../shared/numeric-log-card/account-logs";

const AccountOverview = props => {
  return (
    <div>
      <Overview />
      <div style={{ marginTop: '1rem' }}>
        <NumericLogCard />
      </div>
    </div>
  );
};

export default AccountOverview;
