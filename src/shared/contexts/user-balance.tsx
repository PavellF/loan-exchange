import * as React from "react";
import {useState} from "react";
import axios from "axios";
import {IBalanceLog} from "../model/balance-log.model";

const initialState = {
  balance: 0,
  entry: {} as IBalanceLog,
  errorMessage: null as unknown as string,
  loading: false,
  update: () => {}
};

export const UserBalance = React.createContext(initialState);
const requestUrl = `api/balance-logs?page=0&size=1&sort=id,DESC`;

const UserBalanceContext = (props) => {

  const [state, setState] = useState(initialState);

  const update = () => {

    setState(old => Object.assign({}, old, {loading: true}));

    axios.get<IBalanceLog[]>(requestUrl).then(payload => {
      let newValue = state.balance;

      if (payload.data.length === 1) {
        newValue = Math.round(payload.data[0].amountChanged + payload.data[0].oldValue);
      }

      setState(old => ({
        ...old,
        loading: false,
        errorMessage: null as unknown as string,
        balance: newValue,
        entry: payload.data[0],
      }));

    }).catch(error => {
      setState(old => ({...old, loading: false, errorMessage: error}));
    });
  };

  const context = {
    ...state,
    update
  };

  return <UserBalance.Provider value={context}>{props.children}</UserBalance.Provider>;

};

export default UserBalanceContext;
