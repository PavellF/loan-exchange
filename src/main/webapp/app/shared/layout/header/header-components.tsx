import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Icon } from 'antd';

export const BrandIcon = props => (
  <div className="brand" {...props}>
    <Icon type="stock" /> loanExchange
  </div>
);

export const Brand = props => (
  <Link to="/">
    <BrandIcon />
  </Link>
);
