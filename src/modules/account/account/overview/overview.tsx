import {PageHeader, Statistic} from 'antd';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import React, {useContext} from 'react';
import Icon from 'antd/lib/icon';
import {IAccountStats} from "../../../../shared/model/account-stats.model";
import {IBalanceLog} from "../../../../shared/model/balance-log.model";
import {IUser} from "../../../../shared/model/user.model";
import {Translation} from "../../../../shared/contexts/translation";
import {percentageDifference} from "../../../../shared/util/math-utils";

interface OverviewProps {
  stats: IAccountStats;
  currentBalance: IBalanceLog;
  user: IUser;
}

const Overview = (props: OverviewProps) => {
  const t = useContext(Translation).translation;
  const balance = props.currentBalance.amountChanged + props.currentBalance.oldValue;
  const percentChange = percentageDifference(props.currentBalance.oldValue, balance);

  return (
    <PageHeader
      title={`${props.user.firstName} ${props.user.lastName}`}
      subTitle={`id${props.user.id}`}
      tags={<Tag color="green">{t.active}</Tag>}
      extra={[
        <Button key="2">{t.requestToWithdraw}</Button>,
        <Button key="1" type="primary">{t.refill}</Button>
      ]}>
      <div className="Row Evenly Margin-Top Margin-Bottom">
        <Statistic
          valueStyle={{fontSize: '2.2rem', color: balance < 0 ? '#cf1322' : 'inherit'}}
          title={t.balance}
          prefix="¢"
          value={balance}
          suffix={percentChange !== 0 ?
            <Statistic
              value={percentChange}
              precision={2}
              valueStyle={{color: percentChange > 0 ? '#3f8600' : '#cf1322'}}
              prefix={percentChange > 0 ? <Icon type="arrow-up"/> : <Icon type="arrow-down"/>}
              suffix="%"
            /> : null
          }
        />
        <Statistic title={t.overallIncoming} value={props.stats.allTimeIncoming} prefix="¢" valueStyle={{fontSize: '2.2rem'}}/>
        <Statistic valueStyle={{fontSize: '2.2rem'}} title={t.loanPayments} prefix="¢" value={props.stats.allTimePaymentForLoan}/>
      </div>
    </PageHeader>
  );
};

export default Overview;
