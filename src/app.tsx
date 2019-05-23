import './app.css';
import 'antd/dist/antd.css';

import React, {useContext, useEffect} from 'react';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import Spin from 'antd/lib/spin';
import {Authentication} from "./shared/contexts/authentication";
import Footer from "./shared/layout/footer/footer";
import {Route, RouteProps} from 'react-router-dom';
import AuthFlow from "./modules/account/auth-flow/auth-flow"
import setupAxiosInterceptors from "./config/axios-interceptor";
import {Translation} from "./shared/contexts/translation";

// @ts-ignore
const baseHref = document.querySelector('base').getAttribute('href')
  .replace(/\/$/, '');

export const App = (props: any) => {

  const auth = useContext(Authentication);
  const translation = useContext(Translation);

  setupAxiosInterceptors(() => auth.clearAuthentication());

  useEffect(() => {
    auth.getSession();
  }, []);

  let pageBody;

  if (!auth.sessionHasBeenFetched) {
    return (
      <div className="page-loading">
        <Spin/>
      </div>
    );
  }

  if (auth.isAuthenticated || false) {

    if (auth.account && auth.account.langKey) {
      translation.setLanguage(auth.account.langKey);
    }

    /*pageBody = (
      <Layout>
        <AppHeader/>

        <Layout className="container">
          <Layout style={{padding: '18px 0px', minHeight: 'calc(100vh - 64px - 108px)'}}>
            <Routes/>
          </Layout>
        </Layout>

        <Layout className="container">
          <Footer/>
        </Layout>
      </Layout>
    );*/
  } else {
    pageBody = (
      <div className="login-flow-container">
        <Switch>
            <Route path="/auth" component={AuthFlow}/>
            <Redirect to="/auth"/>
          </Switch>
          <Footer oneline/>
      </div>
    );
  }

  return <Router basename={baseHref}>{pageBody}</Router>;
};

export default (hot(module)(App));
