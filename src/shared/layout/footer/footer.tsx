import React, {useContext} from 'react';
import {Button} from 'antd';
import LocaleMenu from "../menus/locale";
import {Translation} from "../../contexts/translation";
import {Authentication} from "../../contexts/authentication";

const Footer = ({oneline = false}) => {

  const translation = useContext(Translation);
  const auth = useContext(Authentication);

  const doLogout = () => {
    auth.logout();
    auth.getSession();
  };

  const scrollTop = () => {
    window.scrollTo({top: 0})
  };

  if (oneline) {
    return (
      <footer style={{margin: '0.5rem 0'}}>
        <LocaleMenu maxInline={3}/>
      </footer>
    );
  } else {
    return (
      <footer style={{borderTop: '1px solid #e4e8ed', padding: '24px 15px 35px', margin: '0.5rem 0'}}
              className="Row Between Centered">
        <div>
          <span>LoanExchange © {new Date().getFullYear()}</span>
        </div>
        <div>
          <Button type="link" onClick={scrollTop}>{translation.translation.Footer.goUp}</Button>
          <Button type="link" onClick={doLogout}>{translation.translation.Footer.logout}</Button>
        </div>
        <div>
          <a href="https://github.com/PavellF?tab=repositories">
            <Button style={{marginRight: '6px'}} icon="github" shape="circle"/>
          </a>
          <a href="https://github.com/PavellF?tab=repositories">
            <Button style={{marginRight: '6px'}} icon="github" shape="circle"/>
          </a>
          <a href="https://github.com/PavellF?tab=repositories">
            <Button icon="github" shape="circle"/>
          </a>
        </div>
        <div>
          <LocaleMenu maxInline={3}/>
        </div>
      </footer>
    );
  }
};

export default Footer;
