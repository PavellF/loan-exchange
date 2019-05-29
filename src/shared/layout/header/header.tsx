import React, {useContext} from 'react';

import {Brand} from './header-components';
import {Layout, Menu} from 'antd';
import Avatar from 'antd/lib/avatar';
import {Link} from 'react-router-dom';
import Badge from 'antd/lib/badge';
import Icon from 'antd/lib/icon';
import {UserBalance} from "../../contexts/user-balance";
import {Notifications} from "../../contexts/notification";
import {Authentication} from "../../contexts/authentication";
import {coinFormatter} from "../../util/entity-utils";

const {Header} = Layout;

export enum HeaderLink {
  USER = 'USER',
  DEALS = 'DEALS',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export const AppHeader = (props) => {

  let startLinkActive = HeaderLink.USER;

  if (props.location.pathname.startsWith('/notifications')) {
    startLinkActive = HeaderLink.NOTIFICATIONS;
  } else if (props.location.pathname.startsWith('/loan')) {
    startLinkActive = HeaderLink.DEALS;
  }

  const balance = useContext(UserBalance);
  const notifications = useContext(Notifications);
  const auth = useContext(Authentication);
  const firstName: string = auth.account.firstName || '';
  const lastName: string = auth.account.lastName || '';
  const firstLetter = firstName.charAt(0);

  return (
    <React.Fragment>
      <Header style={{boxShadow: '2px 2px 3px rgba(0,0,0,.1)', background: 'white', zIndex: 1}}>
        <div className="Container Header">
          <Brand/>
          <Menu mode="horizontal" defaultSelectedKeys={[startLinkActive]} style={{height: '65px', lineHeight: '64px'}}>
            <Menu.Item key={HeaderLink.DEALS}>
              <Link to="/loan">{coinFormatter(balance.balance)}</Link>
            </Menu.Item>
            <Menu.Item key={HeaderLink.NOTIFICATIONS}>
              <Link to="/notifications">
                <Badge count={notifications.totalItems}>
                  <Icon type="notification"/>
                </Badge>
              </Link>
            </Menu.Item>
            <Menu.Item key={HeaderLink.USER}>
              <Link to="/account">
                {`${firstName} ${lastName}`}<Avatar style={{marginLeft: '0.5rem'}}>{firstLetter}</Avatar>
              </Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
    </React.Fragment>
  );
};
