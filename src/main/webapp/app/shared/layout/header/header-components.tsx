import React from 'react';
import { NavLink as Link } from 'react-router-dom';

export const BrandIcon = props => (
  <div {...props}>
    <span className="brand">loanExchange</span>
  </div>
);

export const Brand = props => (
  <Link to="/">
    <BrandIcon />
  </Link>
);
