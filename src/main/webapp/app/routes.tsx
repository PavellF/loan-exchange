import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import LoanOverview from 'app/modules/loan/loan-overview';
import { Loan } from 'app/modules/loan/loan/loan';
import CreateLoanSteps from 'app/modules/loan/create-loan-steps/create-loan-steps';
import AccountOverview from 'app/modules/account/account/account-overview';
import NotificationOverview from 'app/modules/notification/notification-overview';

const Routes = () => (
  <div className="view-routes">
    <Switch>
      <ErrorBoundaryRoute path="/logout" component={AccountOverview} />
      <ErrorBoundaryRoute path="/account" component={AccountOverview} />
      <ErrorBoundaryRoute path="/notifications" component={NotificationOverview} />
      <ErrorBoundaryRoute path="/loan/new" component={CreateLoanSteps} />
      <ErrorBoundaryRoute path="/loan/:id" component={Loan} />
      <ErrorBoundaryRoute path="/loan" component={LoanOverview} />
      <Redirect to="/account" />
    </Switch>
  </div>
);

export default Routes;
