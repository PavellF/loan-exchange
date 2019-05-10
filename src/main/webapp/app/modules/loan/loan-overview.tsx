import React, { useState } from 'react';
import { Card, Statistic } from 'antd';
import Empty from 'antd/lib/empty';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import './loan-overview.scss';
import { Doughnut } from 'react-chartjs-2';
import { Loan } from 'app/modules/loan/loan/loan';

const tabListNoTitle = [
  {
    key: 'article',
    tab: 'article'
  },
  {
    key: 'app',
    tab: 'app'
  },
  {
    key: 'project',
    tab: 'project'
  }
];

const contentListNoTitle = {
  article: (
    <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '24px', width: '100%' }}>
        <Button size="large" type="dashed" icon="plus">
          New loan
        </Button>
      </div>
      <Loan style={{ marginBottom: '24px', width: '100%' }} />
    </div>
  ),
  app: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
  project: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
};

const LoanOverview = () => {
  const [activeTab, setActiveTab] = useState(0);

  const onTabChange = key => {
    const nextActiveTab = tabListNoTitle.findIndex(tab => tab.key === key);
    if (nextActiveTab !== -1) {
      setActiveTab(nextActiveTab);
    }
  };

  return (
    <div>
      <div className="loan-overview">
        <Card style={{ marginRight: '2%', width: '49%' }} title="Active Deals Statistic" bordered={false}>
          <div style={{ marginBottom: '24px' }}>
            <Statistic
              title="Expected revenue"
              value={112893}
              valueStyle={{ fontSize: '3rem' }}
              suffix={
                <Statistic value={11.28} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<Icon type="arrow-up" />} suffix="%" />
              }
            />
          </div>
          <div className="loan-overview__bottom">
            <div style={{ marginRight: '24px' }}>
              <Statistic title="Allowed to spend balance" value={112893} />
              <Button style={{ marginTop: 16 }} type="primary">
                Recharge
              </Button>
            </div>
            <div>
              <Statistic title="Your average credit percent per year" value={83.83} precision={2} suffix="%" />
            </div>
          </div>
        </Card>
        <Card style={{ width: '49%' }} title="Credit statistic" bordered={false}>
          <Doughnut
            options={{
              rotation: 1 * Math.PI,
              circumference: 1 * Math.PI
            }}
            data={{
              labels: ['Red', 'Blue', 'Yellow', 'Green'],
              datasets: [
                {
                  label: '# of Votes',
                  data: [12, 19, 3, 5],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                  ],
                  borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                  borderWidth: 1
                }
              ]
            }}
          />
          <div className="credit-statistic__bottom">
            <Statistic className="credit-statistic__count" title="Active" value={93} suffix="/ 100" />
            <Statistic className="credit-statistic__count" title="Pending" value={93} suffix="/ 100" />
            <Statistic className="credit-statistic__count" title="Success" value={93} suffix="/ 100" />
            <Statistic className="credit-statistic__count" title="Fail" value={93} suffix="/ 100" />
          </div>
        </Card>
      </div>

      <Card
        style={{ width: '100%' }}
        tabList={tabListNoTitle}
        activeTabKey={tabListNoTitle[activeTab].key}
        onTabChange={key => {
          onTabChange(key);
        }}
        bordered={false}
      >
        {contentListNoTitle[tabListNoTitle[activeTab].key]}
      </Card>
    </div>
  );
};

export default LoanOverview;
