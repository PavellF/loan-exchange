import * as React from "react";
import {useState} from "react";
import axios from "axios";

const initialState = {
  loading: false,
  resetPasswordSuccess: false,
  resetPasswordFailure: false,
  resetPasswordInit: (mail: string) => {},
  resetPasswordFinish: (key: string, newPassword: string) => {},
  reset: () => {}
};

export const PasswordReset = React.createContext(initialState);
const apiUrl = 'api/account/reset-password';

const PasswordResetContext = (props) => {

  const [state, setState] = useState(initialState);

  const resetPasswordInit = (mail: string) => {

    setState(state => ({...state, loading: true}));

    // If the content-type isn't set that way, axios will try to encode the body and thus modify the data sent to the server.
    axios.post(`${apiUrl}/init`, mail, {headers: {['Content-Type']: 'text/plain'}}).then(payload => {
        setState(state => ({...state, loading: false, resetPasswordSuccess: true}));
    }).catch(_ => {
        setState(state => ({...state, loading: false, resetPasswordFailure: true}));
    });

  };

  const resetPasswordFinish = (key: string, newPassword: string) => {

    setState(state => ({...state, loading: true}));

    axios.post(`${apiUrl}/finish`, { key, newPassword }).then(payload => {
      setState(state => ({...state, loading: false, resetPasswordSuccess: true}));
    }).catch(error => {
      setState(state => ({...state, loading: false, resetPasswordFailure: true}));
    });
  };

  const reset = () => {
    setState(initialState);
  };

  const context = {
    ...state,
    resetPasswordInit,
    resetPasswordFinish,
    reset
  };

  return (<PasswordReset.Provider value={context}>{props.children}</PasswordReset.Provider>);

};

export default PasswordResetContext;
