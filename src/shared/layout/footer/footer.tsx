import React from 'react';
import {Button} from 'antd';
import LocaleMenu from "../menus/locale";

const Footer = ({ oneline = false, style = { margin: '0.5rem 0' } }) => {

  if (oneline) {
    return (
      <footer className="footer_oneline" style={style}>
        <LocaleMenu maxInline={3} />
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
          <LocaleMenu maxInline={3} />
        </div>
      </footer>
    );
  }
};

export default Footer;
