import {Radio} from 'antd';
import React, {useContext, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {IBalanceLog} from "../model/balance-log.model";
import moment from "moment";
import {Translation} from "../contexts/translation";

interface NumericLogGraphProps {
  logs: ReadonlyArray<IBalanceLog>;
  onPeriodChange: (startDaysAgo?: number) => void;
}

enum Period {
  THIRTY_DAYS = 'THIRTY_DAYS',
  YEAR = 'YEAR',
  ALL_TIME = 'ALL_TIME'
}

const NumericLogGraph = (props: NumericLogGraphProps) => {
  const t = useContext(Translation).translation;
  const [selectedPeriod, setSelectedPeriod] = useState(null as unknown as Period);
  const data = {
    labels: props.logs.map(l => moment(l.date).calendar()),
    datasets: [
      {
        label: t.balance,
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
        data: props.logs.map(l => l.oldValue + l.amountChanged)
      }
    ]
  };

  const handlePeriodChange = event => {
    const value = event.target.value;
    if (value === Period.THIRTY_DAYS) {
      props.onPeriodChange(30);
    } else if (value === Period.YEAR) {
      props.onPeriodChange(365);
    } else if (value === Period.ALL_TIME) {
      props.onPeriodChange();
    }
    setSelectedPeriod(value as Period);
  };

  return (
    <React.Fragment>
      <div className="Margin-Bottom">
        <Radio.Group value={selectedPeriod} onChange={handlePeriodChange}>
          <Radio.Button value={Period.ALL_TIME}>{t.allTime}</Radio.Button>
          <Radio.Button value={Period.YEAR}>{t.year}</Radio.Button>
          <Radio.Button value={Period.THIRTY_DAYS}>{t.thirtyDays}</Radio.Button>
        </Radio.Group>
      </div>
      <Line data={data} />
    </React.Fragment>
  );
};

export default NumericLogGraph;
