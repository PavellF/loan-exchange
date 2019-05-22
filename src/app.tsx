import './app.scss';
import 'antd/dist/antd.css';

import React from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';
import {hot} from 'react-hot-loader';

import {IRootState} from 'app/shared/reducers';
import {getSession} from 'app/shared/reducers/authentication';
import {getProfile} from 'app/shared/reducers/application-profile';
import {setLocale} from 'app/shared/reducers/locale';
import Footer from 'app/shared/layout/footer/footer';
import {hasAnyAuthority} from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import {AUTHORITIES} from 'app/config/constants';
import AppRoutes from 'app/routes';
import AuthFlow from 'app/modules/account/auth-flow/auth-flow';
import {AppHeader} from 'app/shared/layout/header/header';
import {Layout, Menu} from 'antd';
import Spin from 'antd/lib/spin';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

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
    let pageBody = null;

    if (!this.props.sessionHasBeenFetched) {
      return (
        <div className="page-loading">
          <Spin />
        </div>
      );
    }

    if (this.props.isAuthenticated) {
      pageBody = (
        <Layout>
          <ErrorBoundary>
            <AppHeader
              isAuthenticated={this.props.isAuthenticated}
              isAdmin={this.props.isAdmin}
              ribbonEnv={this.props.ribbonEnv}
              isInProduction={this.props.isInProduction}
              isSwaggerEnabled={this.props.isSwaggerEnabled}
            />
          </ErrorBoundary>

          <Layout className="container">
            <Layout style={{ padding: '18px 0px', minHeight: 'calc(100vh - 64px - 108px)' }}>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Layout>
          </Layout>

          <Layout className="container">
            <Footer currentLocale={this.props.currentLocale} onLocaleChange={this.props.setLocale} />
          </Layout>
        </Layout>
      );
    } else {
      pageBody = (
        <div className="login-flow-container">
          <ErrorBoundary>
            <Switch>
              <ErrorBoundaryRoute path="/auth" component={AuthFlow} />
              <Redirect to="/auth" />
            </Switch>
            <Footer oneline currentLocale={this.props.currentLocale} onLocaleChange={this.props.setLocale} />
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
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  sessionHasBeenFetched: authentication.sessionHasBeenFetched
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(App));