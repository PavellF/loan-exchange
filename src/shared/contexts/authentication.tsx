import React, {useState} from 'react';
import axios from "axios";
import {StorageUtils} from "../util/storage-util";
import {IUser} from "../model/user.model";

const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  account: {} as IUser,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  idToken: null as unknown as string,
  logoutUrl: null as unknown as string,
  clearAuthentication: () => {},
  logout: () => {},
  getSession: () => {},
  login: (username: string, password: string, rememberMe?: boolean) => {}
};

export const Authentication = React.createContext(initialState);
const AUTH_TOKEN_KEY = 'jhi-authenticationToken';

const AuthenticationContext = (props) => {

  const [auth, setAuth] = useState(initialState);

  const login = (username: string, password: string, rememberMe = false) => {

    setAuth(Object.assign({}, auth, {loading: true}));

    axios.post('api/authenticate', { username, password, rememberMe }).then(payload => {
      setAuth(Object.assign({}, auth, {
        loading: false,
        loginError: false,
        loginSuccess: true
      }));

      const bearerToken = payload.headers.authorization;
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwt = bearerToken.slice(7, bearerToken.length);
        if (rememberMe) {
          StorageUtils.local.set(AUTH_TOKEN_KEY, jwt);
        } else {
          StorageUtils.session.set(AUTH_TOKEN_KEY, jwt);
        }
      }

    }).catch(error => {
      setAuth(Object.assign({}, auth, {
        errorMessage: error,
        loginError: true
      }));
    });

    getSession();
  };

  const getSession = () => {

    setAuth(Object.assign({}, auth, {loading: true}));

    axios.get('api/account').then(payload => {
      const isAuthenticated = payload && payload.data && payload.data.activated;
      setAuth(Object.assign({}, auth, {
        loading: false,
        isAuthenticated,
        sessionHasBeenFetched: true,
        account: payload.data
      }));
    }).catch(error => {
      setAuth(Object.assign({}, auth, {
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        errorMessage: error
      }));
    });
  };

  const clearAuthToken = () => {
    if (StorageUtils.local.get(AUTH_TOKEN_KEY)) {
      StorageUtils.local.remove(AUTH_TOKEN_KEY);
    }
    if (StorageUtils.session.get(AUTH_TOKEN_KEY)) {
      StorageUtils.session.remove(AUTH_TOKEN_KEY);
    }
  };

  const logout = () => {
    clearAuthToken();
  };

  const clearAuthentication = () => {
    clearAuthToken();
    setAuth(Object.assign({}, auth, {
      loading: false,
      isAuthenticated: false
    }));
  };

  const context = {
    ...auth,
    clearAuthentication,
    logout,
    getSession,
    login
  };

  return (
    <Authentication.Provider value={context}>
      {props.children}
    </Authentication.Provider>
  );

};

export default AuthenticationContext;
