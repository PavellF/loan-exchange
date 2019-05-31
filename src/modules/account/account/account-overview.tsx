import React, {useContext, useEffect, useState} from 'react';
import Overview from "./overview/overview";
import NumericLogCard from "../../../shared/numeric-log-card/account-logs";
import {Authentication} from "../../../shared/contexts/authentication";
import axios from "axios";
import {IAccountStats} from "../../../shared/model/account-stats.model";
import {STATS_API} from "../../../config/constants";
import {UserBalance} from "../../../shared/contexts/user-balance";

const AccountOverview = props => {
  const auth = useContext(Authentication);
  const balance = useContext(UserBalance);
  const [state, setState] = useState({
    stats: {
      allTimeIncoming: 0,
      allTimePaymentForLoan: 0
    } as IAccountStats
  });

  useEffect(() => {
    axios.get<IAccountStats>(STATS_API).then(payload => {
      setState(old => ({
        ...old,
        stats: {
          allTimeIncoming: payload.data.allTimeIncoming || 0,
          allTimePaymentForLoan: payload.data.allTimePaymentForLoan || 0
        }}));
    });
  }, []);

  return (
    <div>
      <Overview currentBalance={balance.entry} stats={state.stats} user={auth.account}/>
      <div className="Margin-Top">
        <NumericLogCard location={props.location} userId={auth.account.id}/>
      </div>
    </div>
  );
};

export default AccountOverview;
