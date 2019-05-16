import './header.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';

import { Brand } from './header-components';
import { Layout, Menu } from 'antd';
import Avatar from 'antd/lib/avatar';
import { Link } from 'react-router-dom';
import Badge from 'antd/lib/badge';
import Icon from 'antd/lib/icon';

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
      <Header style={{ boxShadow: '2px 2px 3px rgba(0,0,0,.1)', background: 'white', zIndex: 1 }}>
        <div className="container header">
          <Brand />
          <Menu mode="horizontal" defaultSelectedKeys={['2']} style={{ height: '65px', lineHeight: '64px' }}>
            <Menu.Item key="1">
              <Link to="/loan">8 967 ¢</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Badge count={5}>
                <a href="#" className="head-example">
                  <Icon type="notification" />
                </a>
              </Badge>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/account">
                Your Name <Avatar style={{ marginLeft: '0.5rem' }}>Y</Avatar>
              </Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
    </React.Fragment>
  );
};
