import {Statistic} from 'antd';
import React from 'react';
import {Doughnut} from 'react-chartjs-2';

const options = {
  rotation: 1 * Math.PI,
  circumference: 1 * Math.PI
};

const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5],
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1
    }
  ]
};

const LoanStatistics = props => {
  return (
    <React.Fragment>
      <Doughnut options={options} data={data} />
      <div className="loan-statistics">
        <Statistic className="loan-statistics__entry" prefix="¢" title="Всего выплат" value={933} />
        <Statistic className="loan-statistics__entry" prefix="¢" title="Всего выдано" value={9003} />
        <Statistic className="loan-statistics__entry" title="Общий долг" value={637} prefix="¢" />
        <Statistic className="loan-statistics__entry" title="Начислено штрафов" value={37} prefix="¢" />
      </div>
    </React.Fragment>
  );
};

export default LoanStatistics;
