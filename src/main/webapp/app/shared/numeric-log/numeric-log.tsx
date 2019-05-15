import React from 'react';
import Empty from 'antd/lib/empty';
import List from 'antd/lib/list';
import { Statistic } from 'antd';
import Icon from 'antd/lib/icon';

const getPercentageDifference = percent =>
  percent > 0 ? (
    <Statistic value={Math.abs(percent)} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<Icon type="arrow-up" />} suffix="%" />
  ) : (
    <Statistic value={Math.abs(percent)} precision={2} valueStyle={{ color: '#cf1322' }} prefix={<Icon type="arrow-down" />} suffix="%" />
  );

export const NumericLog = (item: NumericLogEntity) => {
  const typeAndDate = `${item.type} from `;

  return (
    <List.Item key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Statistic title={typeAndDate} value={item.date.toDateString()} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Statistic title={'Account'} value={item.difference + '¢'} suffix={getPercentageDifference(item.percentageChange)} />
        <Statistic
          style={{ marginLeft: '1rem' }}
          title="Absolute Change"
          value={item.amountChanged + '¢'}
          valueStyle={{ color: item.amountChanged < 0 ? '#cf1322' : '#3f8600' }}
        />
      </div>
    </List.Item>
  );
};

enum PaymentType {
  PERCENT,
  REPAYMENT,
  FINE
}

export class NumericLogEntity {
  id: number;
  date: Date;
  amountChanged: number;
  amountBeforeChange: number;
  type: string;

  get percentageChange() {
    return ((this.difference - this.amountBeforeChange) / Math.abs(this.amountBeforeChange)) * 100;
  }

  get difference() {
    return this.amountBeforeChange + this.amountChanged;
  }
}

export const NumericLogList = props => {
  const logs: NumericLogEntity[] = [];
  const a = new NumericLogEntity();
  a.id = 1;
  a.date = new Date();
  a.amountChanged = -2;
  a.type = 'fine';
  a.amountBeforeChange = 1000;
  logs.push(a);

  let content = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  //TODO implement infinite scrolling
  if (logs.length) {
    content = <List size="large" bordered dataSource={logs} renderItem={NumericLog} />;
  }

  return content;
};
