import './footer.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';
import { LocaleMenu } from 'app/shared/layout/menus';

const Footer = props => (
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
);

export default Footer;
