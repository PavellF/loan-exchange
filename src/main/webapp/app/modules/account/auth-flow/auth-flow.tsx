import React, { useEffect, useReducer, useState } from 'react';
import { Card } from 'antd';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import { AUTHORITIES } from 'app/config/constants';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Checkbox from 'antd/lib/checkbox';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { IRootState } from 'app/shared/reducers';
import { handleRegister, reset } from 'app/modules/account/register/register.reducer';
import { connect } from 'react-redux';
import { IUser } from 'app/shared/model/user.model';
import { handlePasswordResetFinish, handlePasswordResetInit } from 'app/modules/account/password/password-reset.reducer';
import { login } from 'app/shared/reducers/authentication';
import { getUrlParameter } from 'app/shared/util/url-utils';
import { translate } from 'app/shared/language';
import Translate from 'app/shared/language/translate';

const ENTER_EMAIL = 'ENTER_EMAIL';
const SELECT_ROLE = 'SELECT_ROLE';
const ENTER_PASSWORD = 'ENTER_PASSWORD';
const CREATE_DEBTOR_ACCOUNT = 'CREATE_DEBTOR_ACCOUNT';
const CREATE_CREDITOR_ACCOUNT = 'CREATE_CREDITOR_ACCOUNT';
const LEGAL = 'LEGAL';
const RESET_PASSWORD = 'RESET_PASSWORD';

const GO_BACK = 'GO_BACK';
const GO_FORWARD = 'GO_FORWARD';

const AuthFlow = props => {
  const { getFieldDecorator, validateFields, getFieldValue } = props.form;
  const { location, isAuthenticated } = props;

  useEffect(() => {
    if (props.registrationSuccess) {
      props.login(getFieldValue('email'), getFieldValue('password'), true);
    }
  }, [props.registrationSuccess]);

  useEffect(() => {
    const { from } = location.state || { from: { pathname: '/', search: location.search } };

    if (isAuthenticated) {
      props.history.push(from);
    }

    return () => {
      props.reset();
    };
  }, []);

  useEffect(() => {
    if (props.resetPasswordSuccess) {
      if (resetKey) {
        dispatch({ type: GO_FORWARD, payload: ENTER_EMAIL });
      } else {
        dispatch({ type: GO_FORWARD, payload: RESET_PASSWORD });
      }
    }
  }, [props.resetPasswordSuccess]);

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

  const startCard = getUrlParameter('card', props.location.search);
  const resetKey = getUrlParameter('key', props.location.search);
  const stack = [];

  if (resetKey) {
    stack.push(RESET_PASSWORD);
  } else {
    stack.push(ENTER_EMAIL);
    if (startCard) {
      stack.push(startCard);
    }
  }

  const [flowStack, dispatch] = useReducer(reducer, stack);
  const [showPassword, setShowPassword] = useState(true);
  const [confirmDirty, setConfirmDirty] = useState(false);

  const handleLogin = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        props.login(values.email, values.password, values.rememberMe);
      }
    });
  };

  const handleSignUp = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const ref = getUrlParameter('ref', props.location.search);
        let role = AUTHORITIES.CREDITOR;

        if (flowStack[flowStack.length - 1] === CREATE_DEBTOR_ACCOUNT) {
          role = AUTHORITIES.DEBTOR;
        }

        const newUser: IUser = {};
        newUser.login = values.email;
        newUser.firstName = values.firstName;
        newUser.lastName = values.lastName;
        newUser.email = values.email;
        newUser.langKey = props.currentLocale;
        newUser.authorities = [role];
        newUser.password = values.password;

        props.handleRegister(newUser, ref);
      }
    });
  };

  const handlePasswordResetStart = event => {
    validateFields(['email'], (err, values) => {
      if (!err) {
        props.handlePasswordResetInit(getFieldValue('email'));
      }
    });
  };

  const handlePasswordReset = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        props.handlePasswordResetFinish(resetKey, values.password);
      }
    });
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
        <Form onSubmit={handleLogin}>
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
              <div className="brands">
                <Button shape="circle" icon="facebook" />
                <Button shape="circle" icon="instagram" />
                <Button shape="circle" icon="google" />
              </div>
            </div>

            <div className="email-card__row">
              <a onClick={() => dispatch({ type: GO_FORWARD, payload: SELECT_ROLE })}>
                <Translate contentKey="register.form.button">Create Account</Translate>
              </a>
              <Button type="primary" onClick={() => validateAndGoForward(['email'], ENTER_PASSWORD)}>
                <Translate contentKey="entity.action.next">Next</Translate>
              </Button>
            </div>
          </div>

          <div className={flowStack[flowStack.length - 1] === ENTER_PASSWORD ? 'active' : 'hidden'}>
            <a onClick={() => dispatch({ type: GO_BACK })}>
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
              <a onClick={handlePasswordResetStart}>
                <Translate contentKey="register.forgotPassword">Forgot password?</Translate>
              </a>
              <Button loading={props.loginLoading} type="primary" htmlType="submit">
                <Translate contentKey="entity.action.next">Next</Translate>
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    );
  } else if (
    flowStack[flowStack.length - 1] === CREATE_DEBTOR_ACCOUNT ||
    flowStack[flowStack.length - 1] === CREATE_CREDITOR_ACCOUNT ||
    flowStack[flowStack.length - 1] === SELECT_ROLE ||
    flowStack[flowStack.length - 1] === LEGAL
  ) {
    return (
      <Card style={{ maxWidth: 450 }}>
        <Form onSubmit={handleSignUp}>
          <div className={flowStack[flowStack.length - 1] === SELECT_ROLE ? 'active' : 'hidden'}>
            <a onClick={() => dispatch({ type: GO_BACK })}>
              <Icon type="arrow-left" />
            </a>

            <div className="email-card__head">
              <BrandIcon />
              <h1>
                <Translate contentKey="register.accountType">Select account type</Translate>
              </h1>
            </div>

            <Button size="large" block onClick={validateAndGoForward.bind(this, [], CREATE_DEBTOR_ACCOUNT)}>
              <Translate contentKey="register.selectCreditor">selectCreditor</Translate>
              <Icon type="right" />
            </Button>
            <p>
              <Translate contentKey="register.creditorDescription">creditorDescription</Translate>
            </p>
            <Button size="large" block onClick={validateAndGoForward.bind(this, [], CREATE_CREDITOR_ACCOUNT)}>
              <Translate contentKey="register.selectDebtor">selectDebtor</Translate>
              <Icon type="right" />
            </Button>
            <p>
              <Translate contentKey="register.debtorDescription">debtorDescription</Translate>
            </p>
          </div>

          <div
            className={
              flowStack[flowStack.length - 1] === CREATE_DEBTOR_ACCOUNT || flowStack[flowStack.length - 1] === CREATE_CREDITOR_ACCOUNT
                ? 'active'
                : 'hidden'
            }
          >
            <a onClick={() => dispatch({ type: GO_BACK })}>
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

            <Row gutter={16}>
              <Col span={12}>
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

              <Col span={12}>
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
            </Row>

            <Row gutter={8}>
              <Col span={12}>
                <PasswordStrengthBar password={getFieldValue('password') || ''} />
              </Col>

              <Col span={4}>
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
                  <a onClick={() => dispatch({ type: GO_FORWARD, payload: LEGAL })}>
                    <Translate contentKey="register.agreement">agreement</Translate>
                  </a>
                </Checkbox>
              )}
            </Form.Item>

            <div className="email-card__row">
              <a onClick={() => dispatch({ type: GO_FORWARD, payload: ENTER_EMAIL })}>
                <Translate contentKey="register.signInInstead">Sign in instead</Translate>
              </a>
              <Button type="primary" htmlType="submit" loading={props.registrationLoading} disabled={!Boolean(getFieldValue('agreement'))}>
                <Translate contentKey="entity.action.next">Next</Translate>
              </Button>
            </div>
          </div>

          <div className={flowStack[flowStack.length - 1] === LEGAL ? 'active' : 'hidden'}>
            <a onClick={() => dispatch({ type: GO_BACK })}>
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
  } else if (flowStack[flowStack.length - 1] === RESET_PASSWORD) {
    let payload = null;

    if (resetKey) {
      payload = (
        <Form onSubmit={handlePasswordReset}>
          <div className="email-card__head">
            <BrandIcon />
            <h1>
              <Translate contentKey="reset.request.title">Reset password</Translate>
            </h1>
          </div>

          <Form.Item label={translate('register.form.password')}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: translate('register.messages.validate.password.required') },
                { validator: validateToNextPassword },
                { min: 6, message: translate('register.messages.validate.password.minlength') },
                { max: 64, message: translate('register.messages.validate.password.maxlength') }
              ]
            })(<Input.Password size="large" placeholder={translate('register.form.password')} />)}
          </Form.Item>

          <Form.Item label={translate('register.form.confirmPassword')}>
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, message: translate('register.messages.validate.password.confirm') },
                { validator: compareToFirstPassword },
                { min: 6, message: translate('register.messages.validate.password.minlength') },
                { max: 64, message: translate('register.messages.validate.password.maxlength') }
              ]
            })(<Input.Password size="large" onBlur={handleConfirmBlur} placeholder={translate('register.form.confirmPassword')} />)}
          </Form.Item>

          <div className="email-card__row card__row_end">
            <Button loading={props.passwordResetLoading} type="primary" htmlType="submit">
              <Translate contentKey="reset.request.form.button" />
            </Button>
          </div>
        </Form>
      );
    } else {
      payload = (
        <div className="email-card__head">
          <BrandIcon />
          <h1>
            <Translate contentKey="reset.request.title" />
          </h1>
          <p>
            <Icon type="user" /> {getFieldValue('email')}
          </p>
          <p>
            <Translate contentKey="reset.request.messages.success" />
          </p>
        </div>
      );
    }

    return <Card style={{ width: 400 }}>{payload}</Card>;
  } else {
    return (
      <Card>
        <a onClick={() => dispatch({ type: GO_BACK })}>
          <Icon type="arrow-left" />
        </a>
      </Card>
    );
  }
};

const mapStateToProps = ({ locale, register, passwordReset, authentication }: IRootState) => ({
  currentLocale: locale.currentLocale,
  registrationLoading: register.loading,
  registrationSuccess: register.registrationSuccess,
  passwordResetLoading: passwordReset.loading,
  resetPasswordSuccess: passwordReset.resetPasswordSuccess,
  loginLoading: authentication.loading
});

const mapDispatchToProps = { handleRegister, reset, handlePasswordResetInit, handlePasswordResetFinish, login };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'auth_flow' })(AuthFlow));
