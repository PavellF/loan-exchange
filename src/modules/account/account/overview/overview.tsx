import {PageHeader, Statistic} from 'antd';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import React, {useContext} from 'react';
import Icon from 'antd/lib/icon';
import {IAccountStats} from "../../../../shared/model/account-stats.model";
import {IUser} from "../../../../shared/model/user.model";
import {Translation} from "../../../../shared/contexts/translation";
import {percentageDifference} from "../../../../shared/util/math-utils";
import {UserBalance} from "../../../../shared/contexts/user-balance";

interface OverviewProps {
  stats: IAccountStats;
  user: IUser;
}

const Overview = (props: OverviewProps) => {
  const t = useContext(Translation).translation;
  const balance = useContext(UserBalance);
  const percentChange = percentageDifference(balance.oldValue, balance.balance);

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
          valueStyle={{fontSize: '2.2rem', color: balance.balance < 0 ? '#cf1322' : 'inherit'}}
          title={t.balance}
          prefix="¢"
          value={balance.balance}
          suffix={percentChange !== 0 && !isNaN(percentChange) ?
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
