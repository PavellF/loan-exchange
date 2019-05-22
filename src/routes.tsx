import React from 'react';
import {Redirect, Switch} from 'react-router-dom';
import ErrorBoundaryRoute from "./shared/error/error-boundary-route";
import AccountOverview from "./modules/account/account/account-overview";
import NotificationOverview from "./modules/notification/notification-overview";
import {Loan} from "./modules/loan/loan/loan";
import LoanOverview from "./modules/loan/loan-overview";
import CreateLoanSteps from "./modules/loan/create-loan-steps/create-loan-steps";

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
