import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Icon } from 'antd';

export const BrandIcon = props => (
  <div className="Brand" {...props}>
    <Icon type="stock" /> loanExchange
  </div>
);

export const Brand = props => (
  <Link to="/">
    <BrandIcon {...props} />
  </Link>
);

export const BrandIconLink = props => (
  <Link to="/">
    <div className="Brand" {...props}>
      <Icon type="stock" />
    </div>
  </Link>
);
