import {Statistic} from 'antd';
import React, {useContext} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Translation} from "../../../shared/contexts/translation";

const options = {
  rotation: 1 * Math.PI,
  circumference: 1 * Math.PI
};

interface LoanStatisticsProps {
  startBalance: number;
  profit: number,
  averagePayment: number,
}

const LoanStatistics = (props: LoanStatisticsProps) => {
  const t = useContext(Translation).translation;

  const data = {
    labels: [t.difference, t.paymentsOverall, t.amount, t.averagePayment],
    datasets: [
      {
        data: [props.profit - props.startBalance, props.profit, props.startBalance, props.averagePayment],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <React.Fragment>
      <Doughnut options={options} data={data} />
      <div className="Row Between Wrap Margin-Top">
        <Statistic className="Width-Half Line-Centered" prefix="¢" title={t.paymentsOverall} value={props.profit} />
        <Statistic className="Width-Half Line-Centered" prefix="¢" title={t.difference}
                   value={props.profit - props.startBalance} />
        <Statistic className="Width-Half Line-Centered" title={t.amount} value={props.startBalance} prefix="¢" />
        <Statistic className="Width-Half Line-Centered" title={t.averagePayment} value={props.averagePayment} prefix="¢" />
      </div>
    </React.Fragment>
  );
};

export default LoanStatistics;
