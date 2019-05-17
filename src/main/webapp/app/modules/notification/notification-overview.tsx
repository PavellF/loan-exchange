import React from 'react';
import { Card } from 'antd';
import Button from 'antd/lib/button';
import List from 'antd/lib/list';
import Skeleton from 'antd/lib/skeleton';
import Icon from 'antd/lib/icon';
import Typography from 'antd/lib/typography';

enum NotificationType {
  DELAY_IN_PAYMENT,
  DEAL_BECOME_ACTIVE
}

class Notification {
  id: number;
  haveRead: boolean;
  type: NotificationType;
  dealId: number;
  recipientId: number;
}

const ListItem = (item: Notification) => {
  let text = 'Ant Design, a design language for background applications, is refined by Ant UED Team';
  let icon = null;

  if (item.type === NotificationType.DEAL_BECOME_ACTIVE) {
    icon = <Icon style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: '#a0d911' }} type="check-circle" />;
  } else if (item.type === NotificationType.DELAY_IN_PAYMENT) {
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
  const notification = new Notification();
  notification.id = 1;
  notification.haveRead = false;
  notification.type = NotificationType.DEAL_BECOME_ACTIVE;

  const notification2 = new Notification();
  notification2.id = 2;
  notification2.haveRead = true;
  notification2.type = NotificationType.DELAY_IN_PAYMENT;

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
