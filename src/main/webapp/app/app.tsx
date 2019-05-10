import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'antd/dist/antd.css';

import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
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
import AuthFlow from 'app/shared/layout/authFlow/authFlow';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import { AppHeader } from 'app/shared/layout/header/header';
import { Layout, Menu } from 'antd';

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
            <Sider width={200} style={{ background: '#fff', margin: '18px 0' }}>
              <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} style={{ height: '100%', borderRight: 0 }}>
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </Menu>
            </Sider>

            <Layout style={{ padding: '18px', paddingRight: '0' }}>
              <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: '80vh' }}>
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </Content>
            </Layout>
          </Layout>

          <Footer oneline currentLocale={this.props.currentLocale} onLocaleChange={this.props.setLocale} />
        </Layout>
      ); //footer: copyright   up logout gitpage   langs...
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
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(App));
