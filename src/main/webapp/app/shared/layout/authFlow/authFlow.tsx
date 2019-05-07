import React, { useReducer, useState } from 'react';
import { Card, Typography } from 'antd';
import { Brand, BrandIcon } from 'app/shared/layout/header/header-components';
import { translate, Translate } from 'react-jhipster';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import './authFlow.scss';
import { AUTHORITIES } from 'app/config/constants';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Checkbox from 'antd/lib/checkbox';

const ENTER_EMAIL = 'ENTER_EMAIL';
const SELECT_ROLE = 'SELECT_ROLE';
const ENTER_PASSWORD = 'ENTER_PASSWORD';
const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
const LEGAL = 'LEGAL';

const GO_BACK = 'GO_BACK';
const GO_FORWARD = 'GO_FORWARD';
const DO_LOGIN = 'DO_LOGIN';
const DO_REGISTER = 'DO_REGISTER';

const AuthFlow = props => {
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = props.form;

  const reducer = (currentState, action) => {
    if (action.type === GO_BACK && currentState.length > 0) {
      const copy = [...currentState];
      copy.pop();
      return copy;
    } else if (action.type === GO_FORWARD) {
      return currentState.concat(action.payload);
    }

    return currentState;
  };

  const [flowStack, dispatch] = useReducer(reducer, [ENTER_EMAIL]);
  const [showPassword, setShowPassword] = useState(true);
  const [confirmDirty, setConfirmDirty] = useState(false);

  const handleSignIn = event => {
    event.preventDefault();
    validateFields();
  };

  const validateToNextPassword = (rule, value, callback) => {
    const form = props.form;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const form = props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(translate('register.messages.validate.password.equality'));
    } else {
      callback();
    }
  };

  const handleRoleSelection = (role: string, goTo: string) => {
    setFieldsValue({ role: role });
    dispatch({ type: GO_FORWARD, payload: goTo });
  };

  const getCaptcha = () => {};

  const validateAndGoForward = (fieldsToValidate: string[], to: string) => {
    validateFields(fieldsToValidate).then(_ => dispatch({ type: GO_FORWARD, payload: to }));
  };

  const handleConfirmBlur = e => {
    const value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
  };

  if (flowStack[flowStack.length - 1] === ENTER_EMAIL || flowStack[flowStack.length - 1] === ENTER_PASSWORD) {
    return (
      <Card style={{ width: 400 }}>
        <Form onSubmit={handleSignIn}>
          <div className={flowStack[flowStack.length - 1] === ENTER_EMAIL ? 'active' : 'hidden'}>
            <div className="email-card__head">
              <BrandIcon />
              <h1>
                <Translate contentKey="register.loginTitle">Sign In</Translate>
              </h1>
              <p>
                <Translate contentKey="register.usingLoanExchange">Using loanExchange account</Translate>
              </p>
            </div>

            <div className="email-card__main">
              <Form.Item>
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: translate('register.messages.validate.email.required') },
                    { type: 'email', message: translate('register.messages.validate.email.pattern') }
                  ]
                })(<Input size="large" type={'email'} placeholder="E-mail" />)}
              </Form.Item>
              <p>
                <Translate contentKey="register.usingAnotherProvider">Or login with:</Translate>
              </p>
            </div>

            <div className="email-card__row">
              <a href="#" onClick={() => dispatch({ type: GO_FORWARD, payload: SELECT_ROLE })}>
                <Translate contentKey="register.form.button">Create Account</Translate>
              </a>
              <Button type="primary" onClick={() => validateAndGoForward(['email'], ENTER_PASSWORD)}>
                <Translate contentKey="entity.action.next">Next</Translate>
              </Button>
            </div>
          </div>

          <div className={flowStack[flowStack.length - 1] === ENTER_PASSWORD ? 'active' : 'hidden'}>
            <a href="#" onClick={() => dispatch({ type: GO_BACK })}>
              <Icon type="arrow-left" />
            </a>

            <div className="email-card__head">
              <BrandIcon />
              <h1>
                <Translate contentKey="register.welcome">Welcome</Translate>
              </h1>
              <p>
                <Icon type="user" /> {getFieldValue('email')}
              </p>
            </div>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: translate('register.messages.validate.password.required') },
                  { validator: null },
                  { min: 6, message: translate('register.messages.validate.password.minlength') },
                  { max: 64, message: translate('register.messages.validate.password.maxlength') }
                ]
              })(<Input.Password size="large" placeholder={translate('register.form.password')} />)}
            </Form.Item>

            <div className="email-card__row">
              <a href="#" onClick={() => validateAndGoForward(['email', 'password'], CREATE_ACCOUNT)}>
                <Translate contentKey="register.forgotPassword">Forgot password?</Translate>
              </a>
              <Button type="primary" htmlType="submit">
                <Translate contentKey="entity.action.next">Next</Translate>
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    );
  } else if (
    flowStack[flowStack.length - 1] === CREATE_ACCOUNT ||
    flowStack[flowStack.length - 1] === SELECT_ROLE ||
    flowStack[flowStack.length - 1] === LEGAL
  ) {
    return (
      <Card style={{ maxWidth: 450 }}>
        <Form onSubmit={handleSignIn}>
          <div className={flowStack[flowStack.length - 1] === SELECT_ROLE ? 'active' : 'hidden'}>
            <a href="#" onClick={() => dispatch({ type: GO_BACK })}>
              <Icon type="arrow-left" />
            </a>

            <div className="email-card__head">
              <BrandIcon />
              <h1>
                <Translate contentKey="register.accountType">Select account type</Translate>
              </h1>
            </div>

            <Button size="large" block onClick={handleRoleSelection.bind(this, AUTHORITIES.CREDITOR, CREATE_ACCOUNT)}>
              <Translate contentKey="register.selectCreditor">selectCreditor</Translate>
              <Icon type="right" />
            </Button>
            <p>
              <Translate contentKey="register.creditorDescription">creditorDescription</Translate>
            </p>
            <Button size="large" block onClick={handleRoleSelection.bind(this, AUTHORITIES.DEBTOR, CREATE_ACCOUNT)}>
              <Translate contentKey="register.selectDebtor">selectDebtor</Translate>
              <Icon type="right" />
            </Button>
            <p>
              <Translate contentKey="register.debtorDescription">debtorDescription</Translate>
            </p>
          </div>

          <div className={flowStack[flowStack.length - 1] === CREATE_ACCOUNT ? 'active' : 'hidden'}>
            <a href="#" onClick={() => dispatch({ type: GO_BACK })}>
              <Icon type="arrow-left" />
            </a>

            <div className="register-card__head">
              <BrandIcon />
              <h1>
                <Translate contentKey="register.title">Create loanExchange account</Translate>
              </h1>
            </div>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label={translate('register.form.firstName')}>
                  {getFieldDecorator('firstName', {
                    rules: [
                      { required: true, message: translate('register.messages.validate.firstName.required') },
                      { min: 1, message: translate('register.messages.validate.firstName.minlength') },
                      { max: 64, message: translate('register.messages.validate.firstName.maxlength') }
                    ]
                  })(<Input type={'text'} placeholder={translate('register.form.firstName')} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={translate('register.form.lastName')}>
                  {getFieldDecorator('lastName', {
                    rules: [
                      { required: true, message: translate('register.messages.validate.lastName.required') },
                      { min: 1, message: translate('register.messages.validate.lastName.minlength') },
                      { max: 64, message: translate('register.messages.validate.lastName.maxlength') }
                    ]
                  })(<Input type={'text'} placeholder={translate('register.form.lastName')} />)}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={translate('register.form.email')}>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: translate('register.messages.validate.email.required') },
                  { type: 'email', message: translate('register.messages.validate.email.pattern') }
                ]
              })(<Input type={'email'} placeholder="E-mail" />)}
            </Form.Item>

            <Row gutter={8}>
              <Col span={11}>
                <Form.Item label={translate('register.form.password')}>
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: translate('register.messages.validate.password.required') },
                      { validator: validateToNextPassword },
                      { min: 6, message: translate('register.messages.validate.password.minlength') },
                      { max: 64, message: translate('register.messages.validate.password.maxlength') }
                    ]
                  })(<Input type={showPassword ? 'text' : 'password'} placeholder={translate('register.form.password')} />)}
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item label={translate('register.form.confirmPassword')}>
                  {getFieldDecorator('confirm', {
                    rules: [
                      { required: true, message: translate('register.messages.validate.password.confirm') },
                      { validator: compareToFirstPassword },
                      { min: 6, message: translate('register.messages.validate.password.minlength') },
                      { max: 64, message: translate('register.messages.validate.password.maxlength') }
                    ]
                  })(
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      onBlur={handleConfirmBlur}
                      placeholder={translate('register.form.confirmPassword')}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={2}>
                <Button onClick={() => setShowPassword(s => !s)} shape="circle" icon={showPassword ? 'eye' : 'eye-invisible'} />
              </Col>
            </Row>

            <p>
              <Translate contentKey="register.passwordStrengthMessage">passwordStrengthMessage</Translate>
            </p>

            <Form.Item label={translate('register.captcha')} extra={translate('register.captchaExtra')}>
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: translate('register.messages.validate.captcha.required') }]
                  })(<Input />)}
                </Col>
                <Col span={12}>
                  <Button onClick={getCaptcha}>
                    <Translate contentKey="register.getCaptcha">getCaptcha</Translate>
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('agreement', { valuePropName: 'checked' })(
                <Checkbox>
                  <Translate contentKey="register.haveRead">I have read the </Translate>
                  <a onClick={() => dispatch({ type: GO_FORWARD, payload: LEGAL })} href="#">
                    <Translate contentKey="register.agreement">agreement</Translate>
                  </a>
                </Checkbox>
              )}
            </Form.Item>

            <div className="email-card__row">
              <a href="#" onClick={() => dispatch({ type: GO_FORWARD, payload: ENTER_EMAIL })}>
                <Translate contentKey="register.signInInstead">Sign in instead</Translate>
              </a>
              <Button type="primary" htmlType="submit" disabled={!Boolean(getFieldValue('agreement'))}>
                <Translate contentKey="entity.action.next">Next</Translate>
              </Button>
            </div>
          </div>

          <div className={flowStack[flowStack.length - 1] === LEGAL ? 'active' : 'hidden'}>
            <a href="#" onClick={() => dispatch({ type: GO_BACK })}>
              <Icon type="arrow-left" />
            </a>

            <div className="register-card__head">
              <BrandIcon />
              <h1>
                <Translate contentKey="register.legal">Legal</Translate>
              </h1>
            </div>

            <p style={{ overflowY: 'scroll', maxHeight: '600px' }}>
              <Translate contentKey="register.legalStatement">Legal</Translate>
            </p>
          </div>
        </Form>
      </Card>
    );
  }
};

export default Form.create({ name: 'normal_login' })(AuthFlow);
