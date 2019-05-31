import React, {useContext, useEffect, useState} from 'react';
import {Card} from 'antd';
import List from 'antd/lib/list';
import Icon from 'antd/lib/icon';
import Typography from 'antd/lib/typography';
import {INotification} from "../../shared/model/notification.model";
import {BalanceLogEvent} from "../../shared/model/balance-log-event";
import {Notifications} from "../../shared/contexts/notification";
import {getSortState} from "../../shared/util/pagination-utils";
import {ITEMS_PER_PAGE} from "../../config/constants";
import InfiniteScroll from 'react-infinite-scroller';
import Empty from "antd/lib/empty";
import {Translation} from "../../shared/contexts/translation";
import Spin from "antd/lib/spin";
import {Link} from "react-router-dom";

const NotificationOverview = props => {
  const notifications = useContext(Notifications);
  const [state, setState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const t = useContext(Translation).translation;

  const ListItem = (item: INotification) => {
    const text = t.BalanceLogEvent[item.type as BalanceLogEvent];
    let icon;

    if (item.type === BalanceLogEvent.LOAN_TAKEN) {
      icon = <Icon style={{fontSize: '1.5rem', marginRight: '0.5rem', color: '#a0d911'}} type="check-circle"/>;
    } else if (item.type === BalanceLogEvent.DEAL_CLOSED) {
      icon = <Icon style={{fontSize: '1.5rem', marginRight: '0.5rem', color: '#faad14'}} type="exclamation-circle"/>;
    } else {
      icon = <Icon style={{fontSize: '1.5rem', marginRight: '0.5rem', color: '#a0d911'}} type="check-circle"/>;
    }

    const actions: JSX.Element[] = [];

    if (item.associatedDealId != null) {
      actions.push(<Link to={`/loan/${item.associatedDealId}`}>{t.seeProblem}</Link>);
    }

    if (item.id != null) {
      // @ts-ignore
      actions.push(<a onClick={() => notifications.deleteNotification(item.id)}>{t.remove}</a>);
    }

    return (
      <List.Item actions={actions}>
        <div style={{flexGrow: 1}} className="Row Centered">
          {icon}
          <Typography.Text type="secondary">{text}</Typography.Text>
        </div>
      </List.Item>
    );
  };

  useEffect(() => {
    notifications.fetchNotifications(0, state.itemsPerPage, `${state.sort},${state.order}`);
  }, []);

  const handleInfiniteOnLoad = () => {
    setState(old => {
      const newOne = {...old, activePage: old.activePage + 1};
      notifications.fetchNotifications(old.activePage, newOne.itemsPerPage, `${newOne.sort},${newOne.order}`);
      return newOne;
    });
  };

  let body;

  if (notifications.notifications.length > 0) {
    body = (<List itemLayout="horizontal" dataSource={[...notifications.notifications]} renderItem={ListItem}/>);
  } else {
    body = <Empty description={t.noItems} image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
  }

  return (
    <Card title={t.notifications}>
      <InfiniteScroll
        pageStart={state.activePage}
        loadMore={handleInfiniteOnLoad}
        hasMore={state.activePage - 1 < notifications.links.next}
        threshold={0}
        useWindow={true}
      >
        <Spin spinning={notifications.loading}>
          {body}
        </Spin>
      </InfiniteScroll>
    </Card>
  );
};

export default NotificationOverview;
