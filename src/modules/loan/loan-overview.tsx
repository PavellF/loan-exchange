import React, {useContext, useEffect, useState} from 'react';
import {message} from 'antd';
import LoanListCard from "./loan-list-card/loan-list-card";
import {Translation} from "../../shared/contexts/translation";
import {UserBalance} from "../../shared/contexts/user-balance";
import axios from "axios";
import {DEALS_API} from "../../config/constants";
import {IDeal} from "../../shared/model/deal.model";

const dealState = {
  deals: [] as ReadonlyArray<IDeal>,
  error: false,
  loading: false
};

const LoanOverview = (props) => {

  const translation = useContext(Translation);
  const balance = useContext(UserBalance);
  const [deals, setDeals] = useState(dealState);
  const t = translation.translation.LoanOverview;

  useEffect(() => {
    setDeals(old => ({...old, loading: true}));

    axios.get<IDeal[]>(DEALS_API).then(payload => {

      if (payload.data.length === 0) {
        props.history.push('/deal/new');
      } else {
        setDeals(old => ({...old, loading: false, deals: payload.data, error: false}));
      }

    }).catch(_ => {
      message.error(t.dealsFetchError);
      setDeals(old => ({...old, loading: false, error: true}));
    });

  }, []);

  return (<LoanListCard />);
};

export default LoanOverview;
