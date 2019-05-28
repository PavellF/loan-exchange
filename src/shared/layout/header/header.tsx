import React from 'react';

import {Brand} from './header-components';
import {Layout, Menu} from 'antd';
import Avatar from 'antd/lib/avatar';
import {Link} from 'react-router-dom';
import Badge from 'antd/lib/badge';
import Icon from 'antd/lib/icon';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

export const AppHeader = (props) => {

  return (
    <React.Fragment>
      {/*{`loading bar ?`}*/}
      <Header style={{boxShadow: '2px 2px 3px rgba(0,0,0,.1)', background: 'white', zIndex: 1}}>
        <div className="Container Header">
          <Brand/>
          <Menu mode="horizontal" defaultSelectedKeys={['2']} style={{height: '65px', lineHeight: '64px'}}>
            <Menu.Item key="1">
              <Link to="/loan">8 967 ¢</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/notifications">
                <Badge count={5}>
                  <Icon type="notification"/>
                </Badge>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/account">
                Your Name <Avatar style={{marginLeft: '0.5rem'}}>Y</Avatar>
              </Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
    </React.Fragment>
  );
};
