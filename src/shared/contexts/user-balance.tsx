import * as React from "react";
import {useState} from "react";
import axios from "axios";
import {IBalanceLog} from "../model/balance-log.model";

const initialState = {
  balance: 0,
  amountChanged: 0,
  oldValue: 0,
  error: false,
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

      if (payload.data.length === 1) {
        setState(old => ({
          ...old,
          loading: false,
          errorMessage: null as unknown as string,
          balance: payload.data[0].oldValue + payload.data[0].amountChanged,
          amountChanged: payload.data[0].amountChanged,
          oldValue: payload.data[0].oldValue,
        }));
      } else {
        setState(initialState);
      }

    }).catch(error => {
      setState(old => ({...old, loading: false, error: true}));
    });
  };

  const context = {
    ...state,
    update
  };

  return <UserBalance.Provider value={context}>{props.children}</UserBalance.Provider>;

};

export default UserBalanceContext;
