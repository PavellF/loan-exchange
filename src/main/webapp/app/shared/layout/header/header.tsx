import './header.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';

import { Brand } from './header-components';
import { Icon, Layout, Menu } from 'antd';
import Badge from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
}

export interface IHeaderState {
  menuOpen: boolean;
}

export const AppHeader = ({ isAuthenticated, isAdmin, isSwaggerEnabled, isInProduction, ribbonEnv }: IHeaderProps) => {
  const renderDevRibbon = () =>
    isInProduction === false ? (
      <div className="ribbon dev">
        <a>
          <Translate contentKey={`global.ribbon.${ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  return (
    <React.Fragment>
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <Header style={{ background: 'white' }}>
        <div className="container header">
          <Brand />
          <Menu mode="horizontal" defaultSelectedKeys={['2']} style={{ lineHeight: '64px' }}>
            <Menu.Item key="1">8 967 $</Menu.Item>
            <Menu.Item key="2">
              <Badge count={5}>
                <a href="#" className="head-example">
                  <Icon type="notification" />
                </a>
              </Badge>
            </Menu.Item>
            <Menu.Item key="3">
              Your Name <Avatar>Y</Avatar>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
    </React.Fragment>
  );
};
