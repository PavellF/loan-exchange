import * as React from "react";
import {useState} from "react";
import axios from "axios";
import {IUserVM} from "../model/user.model";

const initialState = {
  loading: false,
  registrationSuccess: false,
  registrationFailure: false,
  errorMessage: null as unknown as string,
  createAccount: (user: IUserVM, referal?: string) => {},
  reset: () => {}
};

export const Register = React.createContext(initialState);

const RegisterContext = (props: any) => {

  const [state, setState] = useState(initialState);

  const createAccount = (user: IUserVM, referal?: string) => {
    setState({...state, loading: true});

    axios.post('api/register', user).then(payload => {
      setState({...state, loading: false, registrationSuccess: true});
    }).catch(error => {
      setState({...state, loading: false, registrationFailure: true, errorMessage: error.response.data.errorKey});
    });
  };

  const reset = () => {
    setState(initialState);
  };

  const context = {
    ...state,
    createAccount,
    reset
  };

  return (
    <Register.Provider value={context}>
      {props.children}
    </Register.Provider>
  );
};

export default RegisterContext;
