import './app.css';
import 'antd/dist/antd.css';

import React, {useContext, useEffect} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import Spin from 'antd/lib/spin';
import {Authentication} from "./shared/contexts/authentication";
import Footer from "./shared/layout/footer/footer";
import AuthFlow from "./modules/account/auth-flow/auth-flow"
import setupAxiosInterceptors, {setOnUnauthenticated} from "./config/axios-interceptor";
import {Translation} from "./shared/contexts/translation";
import RegisterContext from "./shared/contexts/register";
import PasswordResetContext from "./shared/contexts/password-reset";
import {Layout} from "antd";
import {AppHeader} from "./shared/layout/header/header";
import Routes from "./routes";
import {UserBalance} from "./shared/contexts/user-balance";

setupAxiosInterceptors();

// @ts-ignore
const baseHref = document.querySelector('base').getAttribute('href')
  .replace(/\/$/, '');

export const App = (props: any) => {

  const auth = useContext(Authentication);
  const translation = useContext(Translation);
  const balance = useContext(UserBalance);

  useEffect(() => {
    auth.getSession();
    balance.update();
    setOnUnauthenticated(() => auth.clearAuthentication);
    const balanceUpdateInterval = setInterval(balance.update, 60000); // 60 sec.
    return () => {
      clearInterval(balanceUpdateInterval);
    };
  }, []);

  let pageBody;

  if (!auth.sessionHasBeenFetched) {
    return (
      <div className="page-loading">
        <Spin/>
      </div>
    );
  }

  if (auth.isAuthenticated) {

    if (auth.account && auth.account.langKey) {
      translation.setLanguage(auth.account.langKey);
    }

    pageBody = (
      <Layout>
        <AppHeader/>

        <Layout className="Container">
          <Layout style={{padding: '18px 0px', minHeight: 'calc(100vh - 64px - 108px)'}}>
            <Routes/>
          </Layout>
        </Layout>

        <Layout className="Container">
          <Footer/>
        </Layout>
      </Layout>
    );
  } else {
    pageBody = (
      <RegisterContext>
        <PasswordResetContext>
          <div className="login-flow-container">
            <Switch>
              <Route path="/auth" component={AuthFlow}/>
              <Redirect to="/auth"/>
            </Switch>
            <Footer oneline/>
          </div>
        </PasswordResetContext>
      </RegisterContext>
    );
  }

  return <Router basename={baseHref}>{pageBody}</Router>;
};

export default (hot(module)(App));
