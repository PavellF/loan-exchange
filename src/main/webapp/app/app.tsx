import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'antd/dist/antd.css';

import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Link, Redirect, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import AuthFlow from 'app/modules/account/authFlow/authFlow';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import { AppHeader } from 'app/shared/layout/header/header';
import { Layout, Menu } from 'antd';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';

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
            <Sider width={200} style={{ background: 'transparent', margin: '18px 0' }}>
              <div className="side-menu">
                <Link to="/loan">
                  <Button type="link" size="large" icon="dollar">
                    My Loans
                  </Button>
                </Link>
                <Button type="link" size="large" icon="wallet">
                  My Account
                </Button>
                <Button type="link" size="large" icon="user">
                  My Profile
                </Button>
                <Button type="link" size="large" icon="message">
                  My Messages
                </Button>
                <Button type="link" size="large" icon="fire">
                  Rating
                </Button>
              </div>
            </Sider>

            <Layout style={{ padding: '18px', paddingRight: '0', minHeight: 'calc(100vh - 64px - 108px)' }}>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Layout>
          </Layout>

          <Layout className="container">
            <Footer currentLocale={this.props.currentLocale} onLocaleChange={this.props.setLocale} />
          </Layout>
        </Layout>
      ); //footer: copyright   up logout gitpage   langs... alivbaba box hsadow
      //HEADER: LOGO     MONEY NOTIFICATIONS PROFILE
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
