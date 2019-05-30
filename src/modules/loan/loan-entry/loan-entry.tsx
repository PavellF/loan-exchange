import {Statistic} from 'antd';
import React, {useContext} from 'react';
import {Translation} from "../../../shared/contexts/translation";
import {PaymentInterval} from "../../../shared/model/payment-interval";

interface EntryProps {
  paymentEvery: PaymentInterval;
  percent: number;
  term: number;
  startBalance: number;
  clickHandler: (event: React.MouseEvent<HTMLElement>) => void;
}

const LoanEntry = (props: EntryProps) => {
  const translation = useContext(Translation);
  const t = translation.translation;
  return (
    <div className="Row Between" onClick={props.clickHandler}>
      <Statistic title={t.rate} suffix={t.perTemporal(props.paymentEvery)} value={`${props.percent}%`} />

      <div style={{flexGrow: 0.1}} className="Row Between">
        <Statistic title={t.amount} prefix="¢" value={props.startBalance} />
        <Statistic title={t.term} value={props.term} suffix={t.temporal(props.paymentEvery)}/>
      </div>
    </div>
  );
};

export default LoanEntry;
