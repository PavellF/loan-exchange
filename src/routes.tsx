import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import AccountOverview from "./modules/account/account/account-overview";
import NotificationOverview from "./modules/notification/notification-overview";
import {Loan} from "./modules/loan/loan/loan";
import LoanOverview from "./modules/loan/loan-overview";
import CreateLoanSteps from "./modules/loan/create-loan-steps/create-loan-steps";

const Routes = () => (
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

export default Routes;
