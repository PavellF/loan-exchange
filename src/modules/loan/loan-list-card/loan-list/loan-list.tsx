import React from 'react';
import Empty from 'antd/lib/empty';
import {LoanCard} from "../../loan-card/loan-card";

const LoanList = props => {
  let list;

  if (false) {
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
