import React from 'react';
import { LoanCard } from 'app/modules/loan/loan-card/loan-card';
import Empty from 'antd/lib/empty';

const LoanList = props => {
  let list = null;

  if (1 === 0) {
    list = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  } else {
    list = null;
  }

  return (
    <div>
      {list}
      <LoanCard />
    </div>
  );
};

export default LoanList;
