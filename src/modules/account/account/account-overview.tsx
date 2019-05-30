import React, {useContext} from 'react';
import Overview from "./overview/overview";
import NumericLogCard from "../../../shared/numeric-log-card/account-logs";
import {Authentication} from "../../../shared/contexts/authentication";

const AccountOverview = props => {
  const auth = useContext(Authentication);
  return (
    <div>
      <Overview />
      <div className="Margin-Top">
        <NumericLogCard location={props.location} userId={auth.account.id} />
      </div>
    </div>
  );
};

export default AccountOverview;
