import React from 'react';
import Empty from 'antd/lib/empty';
import List from 'antd/lib/list';
import {Statistic} from 'antd';
import Icon from 'antd/lib/icon';
import {APP_DATE_FORMAT} from "../../config/constants";
import {IBalanceLog} from "../model/balance-log.model";
import {percentageDifference} from "../util/math-utils";

const getPercentageDifference = percent =>
  percent > 0 ? (
    <Statistic value={Math.abs(percent)} precision={2} valueStyle={{color: '#3f8600'}}
               prefix={<Icon type="arrow-up"/>} suffix="%"/>
  ) : (
    <Statistic value={Math.abs(percent)} precision={2} valueStyle={{color: '#cf1322'}}
               prefix={<Icon type="arrow-down"/>} suffix="%"/>
  );

export interface NumericLogListProps {
  logs?: IBalanceLog[];
}

export const NumericLog = (item: IBalanceLog) => {
  const typeAndDate = `${item.type} from `;
  const newValue = item.amountChanged + item.oldValue;
  const percentageChange = percentageDifference(item.oldValue, newValue);

  return (
    <List.Item key={item.id} style={{display: 'flex', justifyContent: 'space-between'}}>
      <Statistic title={typeAndDate} value={item.date.format(APP_DATE_FORMAT)}/>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Statistic title={'Account'} value={newValue + '¢'}
                   suffix={getPercentageDifference(percentageChange)}/>
        <Statistic
          style={{marginLeft: '1rem'}}
          title="Absolute Change"
          value={item.amountChanged + '¢'}
          valueStyle={{color: item.amountChanged < 0 ? '#cf1322' : '#3f8600'}}
        />
      </div>
    </List.Item>
  );
};


export const NumericLogList = ({logs = []}: NumericLogListProps) => {
  let content;
  //TODO implement infinite scrolling
  if (logs.length > 0) {
    content = <List size="large" bordered dataSource={logs} renderItem={NumericLog}/>;
  } else {
    content = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
  }

  return content;
};
