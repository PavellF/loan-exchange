import React from 'react';
import { Card, Statistic } from 'antd';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import LoanListCard from 'app/modules/loan/loan-list-card/loan-list-card';
import LoanStatistics from 'app/modules/loan/loan-statistics/loan-statistics';

const LoanOverview = () => {
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
              <Statistic title="Allowed to spend balance" value={112893} suffix={'¢'} />
              <Button style={{ marginTop: 16 }} type="primary">
                Recharge
              </Button>
            </div>
            <div>
              <Statistic title="Your average credit percent per year" value={83.83} precision={2} suffix="%" />
            </div>
          </div>
        </Card>
        <Card title="Credit statistic" bordered={false} style={{ width: '49%' }}>
          <LoanStatistics />
        </Card>
      </div>

      <LoanListCard />
    </div>
  );
};

export default LoanOverview;
