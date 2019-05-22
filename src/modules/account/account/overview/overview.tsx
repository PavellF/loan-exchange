import {PageHeader, Statistic} from 'antd';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import React from 'react';
import Icon from 'antd/lib/icon';

const Overview = props => {
  return (
    <PageHeader
      title="Имя Фамилия"
      subTitle="ид аккаунта"
      tags={<Tag color="red">Активен</Tag>}
      extra={[
        <Button key="2">запрос на вывод</Button>,
        <Button key="1" type="primary">
          пополнить
        </Button>
      ]}
    >
      <div className="account-overview">
        <Statistic
          valueStyle={{ fontSize: '2.2rem' }}
          title="Доступный остаток"
          prefix="$"
          value={568.08}
          suffix={
            <Statistic
              value={12.34}
              precision={2}
              valueStyle={{ color: 2 > 0 ? '#3f8600' : '#cf1322' }}
              prefix={2 > 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}
              suffix="%"
            />
          }
        />
        <Statistic
          valueStyle={{ fontSize: '2.2rem' }}
          title="Поступлений за месяц (май)"
          prefix="$"
          value={568.08}
          suffix={
            <Statistic
              value={12.34}
              precision={2}
              valueStyle={{ color: 2 > 0 ? '#3f8600' : '#cf1322' }}
              prefix={2 > 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}
              suffix="%"
            />
          }
        />
        <Statistic valueStyle={{ fontSize: '2.2rem' }} title="Поступлений за весь период" prefix="$" value={568.08} />
      </div>
    </PageHeader>
  );
};

export default Overview;
