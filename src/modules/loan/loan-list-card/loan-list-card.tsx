import React, {useState} from 'react';
import {Button, Card, Typography} from 'antd';
import Empty from 'antd/lib/empty';
import LoanSearchForm from '../loan-search-form/loan-search-form';
import LoanList from "./loan-list/loan-list";

const tabListNoTitle = [
  {
    key: 'new',
    tab: (
      <React.Fragment>
        Подбор <Typography.Text type="secondary">+1</Typography.Text>
      </React.Fragment>
    )
  },
  {
    key: 'active',
    tab: (
      <React.Fragment>
        Active <Typography.Text type="secondary">5</Typography.Text>
      </React.Fragment>
    )
  },
  {
    key: 'pending',
    tab: (
      <React.Fragment>
        Pending <Typography.Text type="secondary">7</Typography.Text>
      </React.Fragment>
    )
  },
  {
    key: 'repaid',
    tab: (
      <React.Fragment>
        Repaid <Typography.Text type="secondary">19</Typography.Text>
      </React.Fragment>
    )
  },
  {
    key: 'rejected',
    tab: (
      <React.Fragment>
        Rejected <Typography.Text type="secondary">1</Typography.Text>
      </React.Fragment>
    )
  },
  {
    key: 'all',
    tab: (
      <React.Fragment>
        All <Typography.Text type="secondary">32</Typography.Text>
      </React.Fragment>
    )
  }
];

const LoanListCard = props => {
  const [activeTab, setActiveTab] = useState(tabListNoTitle[0].key);

  const onTabChange = key => {
    setActiveTab(key);
  };

  let tabBody = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  if (activeTab === 'new') {
    let searchFrom;
    if (props.isCreditor || true) {
      searchFrom = (
        <div className="loan-list__tab-body-head">
          <LoanSearchForm />
        </div>
      );
    }
    tabBody = (
      <div className="loan-list__tab-body">
        {searchFrom}
        <LoanList />
      </div>
    );
  } else if (activeTab === 'active') {
    let newLoanButton;
    if (props.isCreditor || true) {
      newLoanButton = (
        <div className="loan-list__tab-body-head">
          <Button size="large" type="dashed" icon="plus">
            New loan
          </Button>
        </div>
      );
    }
    tabBody = (
      <div className="loan-list__tab-body">
        {newLoanButton}
        <LoanList />
      </div>
    );
  }

  return (
    <Card tabList={tabListNoTitle} activeTabKey={activeTab} onTabChange={onTabChange} bordered={false}>
      {tabBody}
    </Card>
  );
};

export default LoanListCard;
