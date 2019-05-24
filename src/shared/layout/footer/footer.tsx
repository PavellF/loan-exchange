import React, {useContext} from 'react';
import {Button} from 'antd';
import LocaleMenu from "../menus/locale";
import {Translation} from "../../contexts/translation";
import {Authentication} from "../../contexts/authentication";

const Footer = ({ oneline = false, style = { margin: '0.5rem 0' } }) => {

  const translation = useContext(Translation);
  const auth = useContext(Authentication);

  const doLogout = () => {
    auth.logout();
    auth.getSession();
  };

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
          <a href="#" style={{ marginRight: '12px' }}>{translation.translation.Footer.goUp}</a>
          <a onClick={doLogout}>{translation.translation.Footer.logout}</a>
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
