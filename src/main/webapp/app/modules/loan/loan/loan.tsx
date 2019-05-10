import { Card, Statistic } from 'antd';
import React from 'react';
import './loan.scss';

export const Loan = props => {
  return (
    <Card title="id" extra={<a>More</a>}>
      <div className="loan-entry">
        <div className="loan-entry__left">
          <span className="loan-entry__entry">Date Open: 18 April 2020</span>
          <span className="loan-entry__entry">Expected fullfill date: 31 April 2020</span>
          <span className="loan-entry__entry">(No) early repayment</span>
          <span className="loan-entry__entry">Start amount: 500</span>
        </div>
        <div className="loan-entry__right">
          <Statistic title="Status" value="Pending" />
          <Statistic title="Percent" value="3.4% Per Month" />
          <Statistic title="Balance" prefix="¢" value={568.08} />
        </div>
      </div>
    </Card>
  );
};
