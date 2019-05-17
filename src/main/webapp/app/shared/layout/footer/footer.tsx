import React from 'react';
import { Button } from 'antd';
import { Storage } from 'app/shared/util/storage-util';
import { LocaleMenu } from 'app/shared/layout/menus/locale';

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
          <a style={{ marginRight: '12px' }}>Go Up</a>
          <a>Logout</a>
        </div>
        <div>
          <Button style={{ marginRight: '6px' }} icon="github" shape="circle" />
          <Button style={{ marginRight: '6px' }} icon="github" shape="circle" />
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
