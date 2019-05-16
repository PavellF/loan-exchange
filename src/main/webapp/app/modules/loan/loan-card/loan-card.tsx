import { Card, Statistic } from 'antd';
import React from 'react';
import Icon from 'antd/lib/icon';
// TODO rename to entry
export const LoanCard = props => {
  const gridStyle = {
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer'
  };

  return (
    <React.Fragment>
      <Card.Grid style={gridStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Statistic title="Percent" suffix="Per Month" value="3.4%" />

          <div style={{ display: 'flex', justifyContent: 'space-between', flexGrow: 0.2 }}>
            <Statistic title="Start amount" prefix="¢" value={227.08} />
            <Statistic
              title="Earn"
              value={1128}
              prefix="¢"
              suffix={
                <Statistic value={11.28} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<Icon type="arrow-up" />} suffix="%" />
              }
            />
          </div>
        </div>
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Statistic title="Percent" suffix="Per Month" value="3.4%" />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Statistic title="Success rate" suffix="%" value={3} />
          </div>
        </div>
      </Card.Grid>
    </React.Fragment>
  );
};
