import {Card, message, Statistic} from 'antd';
import React, {useContext, useEffect, useState} from 'react';
import Tag from 'antd/lib/tag';
import Button from 'antd/lib/button';
import LoanStatistics from "../loan-statistics/loan-statistics";
import NumericLogCard from "../../../shared/numeric-log-card/account-logs";
import {Translation} from "../../../shared/contexts/translation";
import {Authentication} from "../../../shared/contexts/authentication";
import {AUTHORITIES, DEALS_API} from "../../../config/constants";
import {defaultValue, getSuccessRateForDeal, IDeal} from "../../../shared/model/deal.model";
import axios from "axios";
import {DealStatus, getStatusColor} from "../../../shared/model/deal-status";
import {getExpectedProfitForDeal} from "../../../shared/util/math-utils";
import moment from "moment";
import classes from './loan.module.css';

export const Loan = props => {
  const t = useContext(Translation).translation;
  const auth = useContext(Authentication);
  const authorities = auth.account.authorities as string[];
  const isCreditor = authorities.find(a => a === AUTHORITIES.CREDITOR);
  const [state, setState] = useState({
    loading: false,
    deal: defaultValue as IDeal
  });

  useEffect(() => {

    setState(old => ({...old, loading: true}));
    const id = props.match.params.id;

    /*const deal: IDeal = {
      id: 666,
      dateOpen: moment(),
      dateBecomeActive: moment().add(700, 'days'),
      endDate: moment().add(1000, 'days'),
      startBalance: 9786,
      percent: 7,
      successRate: 77,
      term: 60,
      paymentEvery: PaymentInterval.ONE_TIME,
      status: DealStatus.PENDING,
    };

    setState(old => ({
      ...old,
      deal: deal,
      loading: false
    }));*/

    axios.get<IDeal>(`${DEALS_API}/${id}`).then(payload => {
      setState(old => ({
        ...old,
        deal: payload.data,
        loading: false,
      }));
    }).catch(_ => {
      message.error(t.dealFetchError, 6);
      props.history.push('/loan');
    });
  }, []);

  let cardBottom;

  if (state.deal.status === DealStatus.PENDING) {
    if (isCreditor) {

      const handleDealDeletion = () => {
        setState(old => ({...old, loading: true}));

        const deal: IDeal = state.deal;
        deal.status = DealStatus.CLOSED;

        axios.put<IDeal>(DEALS_API, deal).then(_ => {
          message.success(t.dealDeletionSuccess, 6);
          props.history.push('/loan');
        }).catch(_ => {
          setState(old => ({...old, loading: false}));
          message.error(t.dealDeletionFail, 6);
        });
      };

      cardBottom = (
        <div className="Margin-Top-Medium Text-Right">
          <Button loading={state.loading} onClick={handleDealDeletion} type="danger">{t.remove}</Button>
        </div>
      );
    } else {

      const handleTakeDeal = () => {
        setState(old => ({...old, loading: true}));

        axios.put<IDeal>(DEALS_API, state.deal).then(_ => {
          message.success(t.loanTakenSuccess, 6);
          props.history.push('/account');
        }).catch(_ => {
          message.error(t.loanTakeFail, 6);
          props.history.push('/loan');
        });
      };

      cardBottom = (
        <div className="Margin-Top-Medium Text-Right">
          <Button onClick={handleTakeDeal} loading={state.loading} type="primary">{t.takeLoan}</Button>
        </div>
      );
    }
  }

  const getTag = () => {
    const status = state.deal.status;
    const color = getStatusColor(status);
    if (!status) {
      return null;
    }

    return <Tag color={color}>{t.DealStatus[status]}</Tag>;
  };

  const profit = getExpectedProfitForDeal(state.deal);
  const successRate = getSuccessRateForDeal(state.deal);

  return (
    <React.Fragment>
      <div className={classes.Cards}>
        <Card title={t.loanDetails} className={classes.DetailsCard} extra={getTag()}>
          <div className="Row Between Wrap">
            <div className="Column">
              {state.deal.dateOpen ?
                <Statistic className="Height-Small" title={t.dateOpen} value={moment(state.deal.dateOpen).calendar()}/> : null
              }
              {state.deal.paymentEvery && state.deal.percent ?
                <Statistic className="Height-Small" title={t.rate} suffix={t.perTemporal(state.deal.paymentEvery)}
                           value={`${state.deal.percent}%`}/> : null
              }
              {state.deal.startBalance ?
                <Statistic className="Height-Small" title={t.amount} prefix="¢" value={state.deal.startBalance}/> : null
              }
              {state.deal.dateBecomeActive ?
                <Statistic className="Height-Small" title={t.dateBecomeActive}
                           value={moment(state.deal.dateBecomeActive).calendar()}/> : null
              }
            </div>
            <div className="Column">
              {state.deal.paymentEvery ?
                <Statistic className="Height-Small" title={t.averagePayment} value={profit.averagePayment}
                           suffix={`¢ ${t.perTemporal(state.deal.paymentEvery)}`}/> : null
              }
              <Statistic className="Height-Small" title={t.successRate} value={successRate} suffix={`%`}/>
              {state.deal.term && state.deal.paymentEvery ?
                <Statistic className="Height-Small" title={t.term} value={state.deal.term}
                           suffix={t.day}/> : null
              }
            </div>
          </div>

          {cardBottom}

        </Card>
        <Card title={t.creditStatistic} className={classes.StatisticsCard}>
          <LoanStatistics startBalance={state.deal.startBalance || 0}
                          averagePayment={profit.averagePayment}
                          profit={profit.profit}/>
        </Card>
      </div>

      { state.deal.id ? <NumericLogCard location={props.location} dealId={state.deal.id}/> : null}

    </React.Fragment>
  );
};
