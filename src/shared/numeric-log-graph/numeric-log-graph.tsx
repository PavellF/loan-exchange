import {Radio} from 'antd';
import React from 'react';
import {Line} from 'react-chartjs-2';

const NumericLogGraph = props => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: '30 days',
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  const handlePeriodChange = value => {};

  return (
    <React.Fragment>
      <div style={{ marginBottom: '1rem' }}>
        <Radio.Group value={'large'} onChange={handlePeriodChange}>
          <Radio.Button value="large">All time</Radio.Button>
          <Radio.Button value="default">365 days</Radio.Button>
          <Radio.Button value="small">30 days</Radio.Button>
        </Radio.Group>
      </div>
      <Line data={data} />
    </React.Fragment>
  );
};

export default NumericLogGraph;
