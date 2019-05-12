import { Card, Statistic } from 'antd';
import React, { useState } from 'react';
import './loan.scss';
import PageHeader from 'antd/lib/page-header';
import Tag from 'antd/lib/tag';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import { LoanLog } from 'app/modules/loan/loan-log/loan-log';

export const Loan = props => {
  const [activeTab, setActiveTab] = useState(0);

  const tabListNoTitle = [
    {
      key: 'history',
      tab: 'History'
    },
    {
      key: 'graph',
      tab: 'Graph'
    }
  ];

  const contentListNoTitle = {
    history: <LoanLog />,
    graph: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  };

  const onTabChange = key => {
    const nextActiveTab = tabListNoTitle.findIndex(tab => tab.key === key);
    if (nextActiveTab !== -1) {
      setActiveTab(nextActiveTab);
    }
  };

  return (
    <React.Fragment>
      <PageHeader
        onBack={() => props.history.push('/loan')}
        title="Loan Details"
        subTitle="id214324"
        tags={<Tag color="red">Pending</Tag>}
        extra={[
          <Button key="1" type="danger">
            Delete
          </Button>
        ]}
      >
        <div>
          <div className="loan-entry">
            <div className="loan-entry__left">
              <span className="loan-entry__entry">Date Open: 18 April 2020</span>
              <span className="loan-entry__entry">Expected fullfillment date: 31 April 2020</span>
              <span className="loan-entry__entry">(No) early repayment</span>
              <span className="loan-entry__entry">Start amount: 500</span>
              <span className="loan-entry__entry">Success rate: 3%</span>
            </div>
            <div className="loan-entry__right">
              <Statistic title="Percent" value="3.4% Per Month" />
              <Statistic title="Balance" prefix="¢" value={568.08} />
            </div>
          </div>
        </div>
      </PageHeader>

      <Card
        style={{ width: '100%', marginTop: '1rem' }}
        tabList={tabListNoTitle}
        activeTabKey={tabListNoTitle[activeTab].key}
        onTabChange={key => {
          onTabChange(key);
        }}
        bordered={false}
      >
        {contentListNoTitle[tabListNoTitle[activeTab].key]}
      </Card>
    </React.Fragment>
  );
};
