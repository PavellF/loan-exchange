import './footer.scss';

import React from 'react';
import { Storage } from 'react-jhipster';
import { LocaleMenu } from 'app/shared/layout/menus';
import { Button } from 'antd';

const Footer = ({ currentLocale, onLocaleChange, oneline = false, style = { margin: '0.5rem 0' } }) => {
  const handleLocaleChange = value => {
    const langKey = value;
    Storage.session.set('locale', langKey);
    onLocaleChange(langKey);
  };

  if (oneline) {
    return (
      <footer className="footer_oneline" style={style}>
        <LocaleMenu maxInline={3} currentLocale={currentLocale} onChange={handleLocaleChange} />
      </footer>
    );
  } else {
    return (
      <footer className="footer" style={style}>
        <div>
          <span>LoanExchange © {new Date().getFullYear()}</span>
        </div>
        <div>
          <a>Go Up</a>
          <a>Logout</a>
        </div>
        <div>
          <Button icon="github" shape="circle" />
          <Button icon="github" shape="circle" />
          <Button icon="github" shape="circle" />
        </div>
        <div>
          <LocaleMenu maxInline={3} currentLocale={currentLocale} onChange={handleLocaleChange} />
        </div>
      </footer>
    );
  }
};

export default Footer;
