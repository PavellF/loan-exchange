import React from 'react';
import {Card} from 'antd';
import Button from 'antd/lib/button';
import List from 'antd/lib/list';
import Skeleton from 'antd/lib/skeleton';
import Icon from 'antd/lib/icon';
import Typography from 'antd/lib/typography';
import {INotification} from "../../shared/model/notification.model";
import {BalanceLogEvent} from "../../shared/model/balance-log-event";
import moment from "moment";

const ListItem = (item: INotification) => {
  let text = 'Ant Design, a design language for background applications, is refined by Ant UED Team';
  let icon;

  if (item.type === BalanceLogEvent.LOAN_TAKEN) {
    icon = <Icon style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: '#a0d911' }} type="check-circle" />;
  } else if (item.type === BalanceLogEvent.DEAL_CLOSED) {
    icon = <Icon style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: '#faad14' }} type="exclamation-circle" />;
  }

  return (
    <List.Item actions={[<a>See problem</a>, <a>MArk as read</a>]}>
      <Skeleton avatar title={false} loading={false} active>
        <div className="notification-card__content">
          {icon}
          <Typography.Text type="secondary">{text}</Typography.Text>
        </div>
      </Skeleton>
    </List.Item>
  );
};

const NotificationOverview = props => {
  const notification: INotification = {};
  notification.id = 1;
  notification.date = moment();
  notification.type = BalanceLogEvent.LOAN_TAKEN;

  const notification2: INotification = {};
  notification2.id = 2;
  notification2.date = moment();
  notification2.type = BalanceLogEvent.DEAL_CLOSED;

  const list = [notification, notification2];

  return (
    <Card>
      <List itemLayout="horizontal" dataSource={list} renderItem={ListItem} />
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Button>Load More</Button>
      </div>
    </Card>
  );
};

export default NotificationOverview;
