import React, {useContext, useState} from 'react';
import Button from "antd/lib/button";
import Typography from "antd/lib/typography";
import {UserBalance} from "../../../shared/contexts/user-balance";
import {Translation} from "../../../shared/contexts/translation";
import {IDeal} from "../../../shared/model/deal.model";
import axios from "axios";
import {DEALS_API, ERROR_NO_MONEY} from "../../../config/constants";
import {message, Statistic} from "antd";
import {PaymentInterval} from "../../../shared/model/payment-interval";
import {getExpectedProfit} from "../../../shared/util/math-utils";
import Icon from "antd/lib/icon";

const {Title} = Typography;

interface LoanSuggestionProps {
  percent: number;
  term: number;
  paymentEvery: PaymentInterval;
  title?: JSX.Element;
  onSuccess?: (id: number) => void;
}

const LoanSuggestion = (props: LoanSuggestionProps) => {
  const balance = useContext(UserBalance);
  const translation = useContext(Translation);
  const [loading, setLoading] = useState(false);
  const startBalance = Math.max(500, Math.round(balance.balance * 0.33));
  const t = translation.translation.CreateLoanSteps;
  const {percent, term, paymentEvery} = props;
  const firstProfit = getExpectedProfit(startBalance, percent, term, paymentEvery);

  const create = () => {
    setLoading(true);
    const deal: IDeal = {percent, term, paymentEvery, startBalance};

    if (paymentEvery === PaymentInterval.MONTH) {
      deal.term = Math.round(term / 30);
    }

    axios.post(DEALS_API, deal).then(payload => {
      const id = payload.data.id;

      if (props.onSuccess) {
        props.onSuccess(id);
      } else {
        setLoading(false);
      }
    }).catch(error => {
      setLoading(false);
      if (error.response.data.errorKey === ERROR_NO_MONEY) {
        message.error(t.noMoney);
      } else {
        message.error(t.sendingError);
      }
    });
  };

  return (
    <div style={{minHeight: 350, minWidth: 200}} className="Column Between">
      <Title level={3}>{props.title}</Title>
      <Statistic title={t.rate} value={percent} suffix={`% ${t.perTemporal(paymentEvery)}`}/>
      <Statistic title={t.term} value={term} suffix={translation.translation.day}/>
      <Statistic
        title={t.revenue}
        value={`${firstProfit.profit}¢`}
        suffix={
          <Statistic
            value={firstProfit.profitInPercent}
            precision={2}
            valueStyle={{color: firstProfit.profitInPercent > 0 ? '#3f8600' : '#cf1322'}}
            prefix={firstProfit.profitInPercent > 0 ? <Icon type="arrow-up"/> : <Icon type="arrow-down"/>}
            suffix="%"
          />
        }
      />
      <Statistic title={t.averagePayment} value={firstProfit.averagePayment}
                 suffix={`¢ ${t.perTemporal(paymentEvery)}`}/>
      <Button style={{marginTop: 18}} block loading={loading} onClick={create} type="primary">{t.next}</Button>
    </div>
  );
};

export default LoanSuggestion;
