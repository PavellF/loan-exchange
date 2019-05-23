import React, {useContext, useEffect, useReducer, useState} from 'react';
import {Card} from 'antd';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Checkbox from 'antd/lib/checkbox';
import {getUrlParameter} from "../../../shared/util/url-utils";
import {AUTHORITIES} from "../../../config/constants";
import {IUser} from "../../../shared/model/user.model";
import {BrandIcon} from "../../../shared/layout/header/header-components";
import PasswordStrengthBar from "../../../shared/layout/password/password-strength-bar";
import {Authentication} from "../../../shared/contexts/authentication";
import {Translation} from "../../../shared/contexts/translation";

const ENTER_EMAIL = 'ENTER_EMAIL';
const SELECT_ROLE = 'SELECT_ROLE';
const ENTER_PASSWORD = 'ENTER_PASSWORD';
const CREATE_DEBTOR_ACCOUNT = 'CREATE_DEBTOR_ACCOUNT';
const CREATE_CREDITOR_ACCOUNT = 'CREATE_CREDITOR_ACCOUNT';
const LEGAL = 'LEGAL';
const RESET_PASSWORD = 'RESET_PASSWORD';

const GO_BACK = 'GO_BACK';
const GO_FORWARD = 'GO_FORWARD';

const AuthFlow = (props: any) => {
  const { getFieldDecorator, validateFields, getFieldValue } = props.form;
  const { location } = props;
  const auth = useContext(Authentication);
  const translation = useContext(Translation);
  const t = translation.translation.authFlow;

  /*useEffect(() => {
    if (props.registrationSuccess) {
      props.login(getFieldValue('email'), getFieldValue('password'), true);
    }
  }, [props.registrationSuccess]);*/

  useEffect(() => {
    const { from } = location.state || { from: { pathname: '/', search: location.search } };

    if (auth.isAuthenticated) {
      props.history.push(from);
    }

    return () => {
      //props.reset();
    };
  }, []);

  /*useEffect(() => {
    if (props.resetPasswordSuccess) {
      if (resetKey) {
        dispatch({ type: GO_FORWARD, payload: ENTER_EMAIL });
      } else {
        dispatch({ type: GO_FORWARD, payload: RESET_PASSWORD });
      }
    }
  }, [props.resetPasswordSuccess]);*/

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
  const stack: string[] = [];

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
        //props.login(values.email, values.password, values.rememberMe);
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
        //newUser.langKey = props.currentLocale;
        newUser.authorities = [role];
        newUser.password = values.password;

        //props.handleRegister(newUser, ref);
      }
    });
  };

  const handlePasswordResetStart = event => {
    validateFields(['email'], (err, values) => {
      if (!err) {
        //props.handlePasswordResetInit(getFieldValue('email'));
      }
    });
  };

  const handlePasswordReset = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        //props.handlePasswordResetFinish(resetKey, values.password);
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
      callback('register.messages.validate.password.equality');
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
                {t.signIn}
              </h1>
              <p>
                Using loanExchange account
              </p>
            </div>

            <div className="email-card__main">
              <Form.Item>
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: 'register.messages.validate.email.required' },
                    { type: 'email', message: 'register.messages.validate.email.pattern' }
                  ]
                })(<Input size="large" type={'email'} placeholder="E-mail" />)}
              </Form.Item>
              <p>
                Or login with:
              </p>
              <div className="brands">
                <Button shape="circle" icon="facebook" />
                <Button shape="circle" icon="instagram" />
                <Button shape="circle" icon="google" />
              </div>
            </div>

            <div className="email-card__row">
              <a onClick={() => dispatch({ type: GO_FORWARD, payload: SELECT_ROLE })}>
                Create Account
              </a>
              <Button type="primary" onClick={() => validateAndGoForward(['email'], ENTER_PASSWORD)}>
                Next
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
                Welcome
              </h1>
              <p>
                <Icon type="user" /> {getFieldValue('email')}
              </p>
            </div>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'register.messages.validate.password.required' },
                  { validator: null },
                  { min: 6, message: 'register.messages.validate.password.minlength' },
                  { max: 64, message: 'register.messages.validate.password.maxlength' }
                ]
              })(<Input.Password size="large" placeholder={'register.form.password'} />)}
            </Form.Item>

            <div className="email-card__row">
              <a onClick={handlePasswordResetStart}>
                Forgot password?
              </a>
              <Button loading={/*props.loginLoading*/false} type="primary" htmlType="submit">
                Next
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
                Select account type
              </h1>
            </div>

            <Button size="large" block onClick={() => validateAndGoForward([], CREATE_DEBTOR_ACCOUNT)}>
              selectCreditor
              <Icon type="right" />
            </Button>
            <p>
              creditorDescription
            </p>
            <Button size="large" block onClick={() => validateAndGoForward([], CREATE_CREDITOR_ACCOUNT)}>
              selectDebtor
              <Icon type="right" />
            </Button>
            <p>
              debtorDescription
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
                Create loanExchange account
              </h1>
            </div>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label={'register.form.firstName'}>
                  {getFieldDecorator('firstName', {
                    rules: [
                      { required: true, message: 'register.messages.validate.firstName.required' },
                      { min: 1, message: 'register.messages.validate.firstName.minlength' },
                      { max: 64, message: 'register.messages.validate.firstName.maxlength' }
                    ]
                  })(<Input type={'text'} placeholder={'register.form.firstName'} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={'register.form.lastName'}>
                  {getFieldDecorator('lastName', {
                    rules: [
                      { required: true, message: 'register.messages.validate.lastName.required' },
                      { min: 1, message: 'register.messages.validate.lastName.minlength' },
                      { max: 64, message: 'register.messages.validate.lastName.maxlength' }
                    ]
                  })(<Input type={'text'} placeholder={'register.form.lastName'} />)}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={'register.form.email'}>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'register.messages.validate.email.required' },
                  { type: 'email', message: 'register.messages.validate.email.pattern' }
                ]
              })(<Input type={'email'} placeholder="E-mail" />)}
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={'register.form.password'}>
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: 'register.messages.validate.password.required' },
                      { validator: validateToNextPassword },
                      { min: 6, message: 'register.messages.validate.password.minlength' },
                      { max: 64, message: 'register.messages.validate.password.maxlength' }
                    ]
                  })(<Input type={showPassword ? 'text' : 'password'} placeholder={'register.form.password'} />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label={'register.form.confirmPassword'}>
                  {getFieldDecorator('confirm', {
                    rules: [
                      { required: true, message: 'register.messages.validate.password.confirm' },
                      { validator: compareToFirstPassword },
                      { min: 6, message: 'register.messages.validate.password.minlength' },
                      { max: 64, message: 'register.messages.validate.password.maxlength' }
                    ]
                  })(
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      onBlur={handleConfirmBlur}
                      placeholder={'register.form.confirmPassword'}
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
              passwordStrengthMessage
            </p>

            <Form.Item label={'register.captcha'} extra={'register.captchaExtra'}>
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: 'register.messages.validate.captcha.required' }]
                  })(<Input />)}
                </Col>
                <Col span={12}>
                  <Button onClick={getCaptcha}>
                    etCaptcha
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('agreement', { valuePropName: 'checked' })(
                <Checkbox>
                  I have read the
                  <a onClick={() => dispatch({ type: GO_FORWARD, payload: LEGAL })}>
                    agreement
                  </a>
                </Checkbox>
              )}
            </Form.Item>

            <div className="email-card__row">
              <a onClick={() => dispatch({ type: GO_FORWARD, payload: ENTER_EMAIL })}>
                Sign in instead
              </a>
              <Button type="primary" htmlType="submit" loading={/*props.registrationLoading*/false}
                      disabled={!Boolean(getFieldValue('agreement'))}>
                Next
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
                Legal
              </h1>
            </div>

            <p style={{ overflowY: 'scroll', maxHeight: '600px' }}>
              Legal
            </p>
          </div>
        </Form>
      </Card>
    );
  } else if (flowStack[flowStack.length - 1] === RESET_PASSWORD) {
    let payload;

    if (resetKey) {
      payload = (
        <Form onSubmit={handlePasswordReset}>
          <div className="email-card__head">
            <BrandIcon />
            <h1>
              Reset password
            </h1>
          </div>

          <Form.Item label={'register.form.password'}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'register.messages.validate.password.required' },
                { validator: validateToNextPassword },
                { min: 6, message: 'register.messages.validate.password.minlength' },
                { max: 64, message: 'register.messages.validate.password.maxlength' }
              ]
            })(<Input.Password size="large" placeholder={'register.form.password'} />)}
          </Form.Item>

          <Form.Item label={'register.form.confirmPassword'}>
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, message: 'register.messages.validate.password.confirm' },
                { validator: compareToFirstPassword },
                { min: 6, message: 'register.messages.validate.password.minlength' },
                { max: 64, message: 'register.messages.validate.password.maxlength' }
              ]
            })(<Input.Password size="large" onBlur={handleConfirmBlur} placeholder={'register.form.confirmPassword'} />)}
          </Form.Item>

          <div className="email-card__row card__row_end">
            <Button loading={/*props.passwordResetLoading*/false} type="primary" htmlType="submit">
              reset.request.form.button
            </Button>
          </div>
        </Form>
      );
    } else {
      payload = (
        <div className="email-card__head">
          <BrandIcon />
          <h1>
            reset.request.title
          </h1>
          <p>
            <Icon type="user" /> {getFieldValue('email')}
          </p>
          <p>
            reset.request.messages.success
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

export default (Form.create({ name: 'auth_flow' })(AuthFlow));
