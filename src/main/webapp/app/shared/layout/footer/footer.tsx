import './footer.scss';

import React from 'react';
import { Storage, Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';
import { LocaleMenu } from 'app/shared/layout/menus';

const Footer = ({ currentLocale, onLocaleChange, oneline = false }) => {
  const handleLocaleChange = value => {
    const langKey = value;
    Storage.session.set('locale', langKey);
    onLocaleChange(langKey);
  };

  if (oneline) {
    return (
      <footer style={{ margin: '0.5rem 0' }}>
        <LocaleMenu maxInline={3} currentLocale={currentLocale} onChange={handleLocaleChange} />
      </footer>
    );
  }
};
/*(
  <div className="footer page-content">
    <Row>
      <Col md="4">
        <span>LoanExchange © {new Date().getFullYear()}</span>
      </Col>
      <Col md="4">
        <span>
          Go Up | github
          <Translate contentKey="footer">Your footer</Translate>
        </span>
      </Col>
      <Col md="4">
        <span>
          <Translate contentKey="footer">Your footer</Translate>
        </span>
      </Col>
    </Row>
  </div>
);*/

export default Footer;
