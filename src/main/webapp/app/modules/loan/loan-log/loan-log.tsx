import React from 'react';
import Empty from 'antd/lib/empty';
import List from 'antd/lib/list';

const Log = item => (
  <List.Item key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>{`Payment from ${item.date}`}</span>
    <span style={{ color: '#3f8600' }}>{`+ ${item.amount}¢`}</span>
    <span>{`Left ${item.amount}¢`}</span>
  </List.Item>
);

class LoanLogEntity {
  id: number;
  date: Date;
  amount: number;
  type: string;
}

export const LoanLog = ({
  logs = [
    { id: 1, date: new Date(), amount: '-2', type: 'штраф' },
    { id: 3, date: new Date(), amount: '76', type: 'плата' },
    {
      id: 2,
      date: new Date('2017-08-06'),
      amount: '-25',
      type: 'процент'
    }
  ],
  initialAmount
}) => {
  let content = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  //TODO implement infinite scrolling
  if (logs.length) {
    content = <List size="large" bordered dataSource={logs} renderItem={Log} />;
  }

  return content;
};
