import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'antd/dist/antd.css';

import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { hot } from 'react-hot-loader';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import AuthFlow from 'app/shared/layout/authFlow/authFlow';
import Register from 'app/modules/account/register/register';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

const baseHref = document
  .querySelector('base')
  .getAttribute('href')
  .replace(/\/$/, '');

export interface IAppProps extends StateProps, DispatchProps {}

export class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getProfile();
  }

  render() {
    const paddingTop = '60px';

    let pageBody = null;

    if (this.props.isAuthenticated) {
      pageBody = (
        <div className="app-container" style={{ paddingTop }}>
          <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
          <ErrorBoundary>
            <Header
              isAuthenticated={this.props.isAuthenticated}
              isAdmin={this.props.isAdmin}
              currentLocale={this.props.currentLocale}
              onLocaleChange={this.props.setLocale}
              ribbonEnv={this.props.ribbonEnv}
              isInProduction={this.props.isInProduction}
              isSwaggerEnabled={this.props.isSwaggerEnabled}
            />
          </ErrorBoundary>
          <div className="container-fluid view-container" id="app-view-container">
            <Card className="jh-card">
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Card>
            <Footer />
          </div>
        </div>
      );
    } else {
      pageBody = (
        <div className="login-flow-container">
          <ErrorBoundary>
            <Switch>
              <ErrorBoundaryRoute path="/auth" component={AuthFlow} />
              <Redirect to="/auth" />
            </Switch>
            <footer>this is footer</footer>
          </ErrorBoundary>
        </div>
      );
    }

    return <Router basename={baseHref}>{pageBody}</Router>;
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(App));
