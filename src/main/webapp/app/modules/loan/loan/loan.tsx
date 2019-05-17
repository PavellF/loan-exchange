import { Card, Statistic } from 'antd';
import React from 'react';
import Tag from 'antd/lib/tag';
import Button from 'antd/lib/button';
import NumericLogCard from 'app/shared/numeric-log-card/account-logs';
import LoanStatistics from 'app/modules/loan/loan-statistics/loan-statistics';
import Switch from 'antd/lib/switch';

export const Loan = props => {
  let cardBottom = null;

  if (true) {
    cardBottom = (
      <>
        <span style={{ marginRight: '0.5rem' }}>Автоплатеж</span>
        <Switch defaultChecked onChange={null} />
        <Button style={{ marginLeft: '1rem' }} type="primary">
          Оплатить
        </Button>
      </>
    );
  } else {
    cardBottom = <Button type="danger">Delete</Button>;
  }

  return (
    <React.Fragment>
      <div className="loan-overview">
        <Card bordered={false} title="Loan Details" style={{ marginRight: '2%', width: '49%' }} extra={<Tag color="red">Pending</Tag>}>
          <div className="loan-details__card-row">
            <div className="loan-details__card-column">
              <Statistic className="loan-details__card-ceil" title="Взято" value="12 апрель 2020" />
              <Statistic className="loan-details__card-ceil" title="капитализация" value={'да'} />
              <Statistic className="loan-details__card-ceil" title="Ставка" value="3.4%" suffix="в месяц" />
              <Statistic className="loan-details__card-ceil" title="Штраф" value="3.4" suffix="%" />
            </div>

            <div className="loan-details__card-column">
              <Statistic className="loan-details__card-ceil" title="Дата открытия" value="10 май 2012" />
              <Statistic className="loan-details__card-ceil" title="досрочное погашение" value="да" />
              <Statistic className="loan-details__card-ceil" title="Успех" value="88" suffix="%" />
              <Statistic className="loan-details__card-ceil" title="продолжифтеность" value="8" suffix="месяцев" />
            </div>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'right' }}>{cardBottom}</div>
        </Card>

        <Card title="Credit statistic" bordered={false} style={{ width: '49%' }}>
          <LoanStatistics />
        </Card>
      </div>

      <NumericLogCard />
    </React.Fragment>
  );
};
