import React, {useContext, useEffect} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import AccountOverview from "./modules/account/account/account-overview";
import NotificationOverview from "./modules/notification/notification-overview";
import {Loan} from "./modules/loan/loan/loan";
import LoanOverview from "./modules/loan/loan-overview";
import CreateLoanSteps from "./modules/loan/create-loan-steps/create-loan-steps";
import {UserBalance} from "./shared/contexts/user-balance";
import {Notifications} from "./shared/contexts/notification";

const Routes = () => {
  const balance = useContext(UserBalance);
  const notifications = useContext(Notifications);

  useEffect(() => {
    balance.update();
    notifications.fetchNotificationsCount();

    const updateInterval = setInterval(() => {
      balance.update();
      notifications.fetchNotificationsCount();
    }, 60000); // 60 sec.
    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <div className="view-routes">
      <Switch>
        <Route path="/logout" component={AccountOverview} />
        <Route path="/account" component={AccountOverview} />
        <Route path="/notifications" component={NotificationOverview} />
        <Route path="/loan/new" component={CreateLoanSteps} />
        <Route path="/loan/:id" component={Loan} />
        <Route path="/loan" component={LoanOverview} />
        <Redirect to="/account" />
      </Switch>
    </div>
  );
};

export default Routes;
