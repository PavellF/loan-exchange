import React, {useContext, useEffect, useReducer, useState} from 'react';
import {Card, message} from 'antd';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Checkbox from 'antd/lib/checkbox';
import {getUrlParameter} from "../../../shared/util/url-utils";
import {AUTHORITIES} from "../../../config/constants";
import {IUserVM} from "../../../shared/model/user.model";
import {BrandIcon} from "../../../shared/layout/header/header-components";
import PasswordStrengthBar from "../../../shared/layout/password/password-strength-bar";
import {Authentication} from "../../../shared/contexts/authentication";
import {Translation} from "../../../shared/contexts/translation";
import {Register} from "../../../shared/contexts/register";
import {PasswordReset} from "../../../shared/contexts/password-reset";

const ENTER_EMAIL = 'ENTER_EMAIL';
const SELECT_ROLE = 'SELECT_ROLE';
const ENTER_PASSWORD = 'ENTER_PASSWORD';
const CREATE_DEBTOR_ACCOUNT = 'CREATE_DEBTOR_ACCOUNT';
const CREATE_CREDITOR_ACCOUNT = 'CREATE_CREDITOR_ACCOUNT';
const LEGAL = 'LEGAL';
const RESET_PASSWORD = 'RESET_PASSWORD';

const GO_BACK = 'GO_BACK';
const GO_FORWARD = 'GO_FORWARD';

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

const AuthFlow = (props: any) => {
  const {getFieldDecorator, validateFields, getFieldValue} = props.form;
  const {location} = props;
  const auth = useContext(Authentication);
  const register = useContext(Register);
  const resetPassword = useContext(PasswordReset);
  const translation = useContext(Translation);
  const t = translation.translation.AuthFlow;
  const stack: string[] = [];
  const [flowStack, dispatch] = useReducer(reducer, stack);
  const [showPassword, setShowPassword] = useState(true);
  const [confirmDirty, setConfirmDirty] = useState(false);
  const startCard = getUrlParameter('card', props.location.search);
  const resetKey = getUrlParameter('key', props.location.search);

  useEffect(() => {
    const {from} = location.state || {from: {pathname: '/', search: location.search}};

    if (auth.isAuthenticated) {
      props.history.push(from);
    }

    return () => {
      register.reset();
      resetPassword.reset();
    };
  }, []);

  useEffect(() => {
    if (register.registrationSuccess) {
      message.success(t.registrationSuccess);
      auth.login(getFieldValue('email'), getFieldValue('password'), true);
    }
  }, [register.registrationSuccess]);

  if (register.registrationFailure) {
    message.error(t.registrationFailure);
  }

  if (resetPassword.resetPasswordSuccess) {
    message.success(t.resetPasswordSuccess);
    if (resetKey) {
      dispatch({type: GO_FORWARD, payload: ENTER_EMAIL});
    } else {
      dispatch({type: GO_FORWARD, payload: RESET_PASSWORD});
    }
  }

  if (resetPassword.resetPasswordFailure) {
    message.error(t.resetPasswordFailure);
  }

  if (auth.loginError) {
    message.error(t.loginError);
  }

  if (resetKey) {
    stack.push(RESET_PASSWORD);
  } else if (startCard) {
    stack.push(startCard);
  } else {
    stack.push(ENTER_EMAIL);
  }

  const handleLogin = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        auth.login(values.email, values.password, values.rememberMe);
      }
    });
  };

  const handleSignUp = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const ref = getUrlParameter('ref', props.location.search);
        const newUser: IUserVM = {};

        newUser.login = values.email;
        newUser.firstName = values.firstName;
        newUser.lastName = values.lastName;
        newUser.email = values.email;
        newUser.langKey = translation.currentLanguage;
        newUser.password = values.password;
        newUser.role = AUTHORITIES.CREDITOR;

        if (flowStack[flowStack.length - 1] === CREATE_DEBTOR_ACCOUNT) {
          newUser.role = AUTHORITIES.DEBTOR;
        }

        register.createAccount(newUser, ref);
      }
    });
  };

  const handlePasswordResetStart = event => {
    validateFields(['email'], (err, values) => {
      if (!err) {
        resetPassword.resetPasswordInit(getFieldValue('email'));
      }
    });
  };

  const handlePasswordReset = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        resetPassword.resetPasswordFinish(resetKey, values.password);
      }
    });
  };

  const validateToNextPassword = (rule, value, callback) => {
    const form = props.form;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const form = props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(t.passwordEquality);
    } else {
      callback();
    }
  };

  const getCaptcha = () => {
  };

  const validateAndGoForward = (fieldsToValidate: string[], to: string) => {
    validateFields(fieldsToValidate).then(_ => dispatch({type: GO_FORWARD, payload: to}));
  };

  const handleConfirmBlur = e => {
    const value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
  };

  if (flowStack[flowStack.length - 1] === ENTER_EMAIL || flowStack[flowStack.length - 1] === ENTER_PASSWORD) {
    return (
      <Card style={{width: 400}}>
        <Form onSubmit={handleLogin}>
          <div className={flowStack[flowStack.length - 1] === ENTER_EMAIL ? 'Fade-In' : 'Hidden'}>

            <div className="Column Centered">
              <BrandIcon/>
              <h1>{t.signIn}</h1>
              <p>{t.usingAccount}</p>
            </div>

            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  {required: true, message: t.emailRequired},
                  {type: 'email', message: t.emailPattern}
                ]
              })(<Input size="large" type={'email'} placeholder="E-mail"/>)}
            </Form.Item>
            <p>{t.orLoginWith + ':'}</p>
            <div className="Brands">
              <Button shape="circle" icon="facebook"/>
              <Button shape="circle" icon="instagram"/>
              <Button shape="circle" icon="google"/>
            </div>

            <div className="Row Between">
              <a onClick={() => dispatch({type: GO_FORWARD, payload: SELECT_ROLE})}>
                {t.createAccount}
              </a>
              <Button type="primary" onClick={() => validateAndGoForward(['email'], ENTER_PASSWORD)}>
                {t.next}
              </Button>
            </div>
          </div>

          <div className={flowStack[flowStack.length - 1] === ENTER_PASSWORD ? 'Fade-In' : 'Hidden'}>
            <a onClick={() => dispatch({type: GO_BACK})}>
              <Icon type="arrow-left"/>
            </a>

            <div className="Column Centered">
              <BrandIcon/>
              <h1>{t.welcome}</h1>
              <p><Icon type="user"/> {getFieldValue('email')}</p>
            </div>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {required: true, message: t.passwordRequired},
                  {validator: null},
                  {min: 6, message: t.passwordMin(6)},
                  {max: 64, message: t.passwordMax(64)}
                ]
              })(<Input.Password size="large" placeholder={t.passwordPlaceholder}/>)}
            </Form.Item>

            <div className="Row Between">
              <a onClick={handlePasswordResetStart}>
                {t.forgotPassword}
              </a>
              <Button loading={auth.loading} type="primary" htmlType="submit">
                {t.signIn}
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
      <Card style={{maxWidth: 450}}>
        <Form onSubmit={handleSignUp}>
          <div className={flowStack[flowStack.length - 1] === SELECT_ROLE ? 'Fade-In' : 'Hidden'}>
            <a onClick={() => dispatch({type: GO_BACK})}>
              <Icon type="arrow-left"/>
            </a>

            <div className="Column Centered">
              <BrandIcon/>
              <h1>{t.selectRole}</h1>
            </div>

            <Button size="large" block onClick={() => validateAndGoForward([], CREATE_CREDITOR_ACCOUNT)}>
              {t.creditor}
              <Icon type="right"/>
            </Button>
            <p>{t.creditorDesc}</p>
            <Button size="large" block onClick={() => validateAndGoForward([], CREATE_DEBTOR_ACCOUNT)}>
              {t.debtor}
              <Icon type="right"/>
            </Button>
            <p>{t.debtorDesc}</p>
          </div>

          <div className={
            flowStack[flowStack.length - 1] === CREATE_DEBTOR_ACCOUNT
            || flowStack[flowStack.length - 1] === CREATE_CREDITOR_ACCOUNT ? 'Fade-In' : 'Hidden'
          }>
            <a onClick={() => dispatch({type: GO_BACK})}>
              <Icon type="arrow-left"/>
            </a>

            <div className="Column">
              <BrandIcon/>
              <h1>{t.createAccountLabel}</h1>
            </div>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label={t.firstName}>
                  {getFieldDecorator('firstName', {
                    rules: [
                      {required: true, message: t.firstNameRequired},
                      {min: 1, message: t.firstNameMin(1)},
                      {max: 64, message: t.firstNameMax(64)}
                    ]
                  })(<Input type={'text'} placeholder={t.firstName}/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t.lastName}>
                  {getFieldDecorator('lastName', {
                    rules: [
                      {required: true, message: t.lastNameRequired},
                      {min: 1, message: t.lastNameMin(1)},
                      {max: 64, message: t.lastNameMax(64)}
                    ]
                  })(<Input type={'text'} placeholder={t.lastName}/>)}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t.email}>
              {getFieldDecorator('email', {
                rules: [
                  {required: true, message: t.emailRequired},
                  {type: 'email', message: t.emailPattern}
                ]
              })(<Input type={'email'} placeholder="E-mail"/>)}
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t.passwordPlaceholder}>
                  {getFieldDecorator('password', {
                    rules: [
                      {required: true, message: t.passwordRequired},
                      {validator: validateToNextPassword},
                      {min: 6, message: t.passwordMin(6)},
                      {max: 64, message: t.passwordMax(64)}
                    ]
                  })(<Input type={showPassword ? 'text' : 'password'} placeholder={t.passwordPlaceholder}/>)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label={t.confirmPassword}>
                  {getFieldDecorator('confirm', {
                    rules: [
                      {required: true, message: t.passwordRequired},
                      {validator: compareToFirstPassword},
                      {min: 6, message: t.passwordMin(6)},
                      {max: 64, message: t.passwordMax(64)}
                    ]
                  })(
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      onBlur={handleConfirmBlur}
                      placeholder={t.confirmPassword}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={12}>
                <PasswordStrengthBar password={getFieldValue('password') || ''}/>
              </Col>

              <Col span={4}>
                <Button onClick={() => setShowPassword(s => !s)} shape="circle"
                        icon={showPassword ? 'eye' : 'eye-invisible'}/>
              </Col>
            </Row>

            <p>{t.passwordStrengthMessage}</p>

            <Form.Item label={t.captcha} extra={t.captchaExtra}>
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('captcha', {
                    rules: [{required: true, message: t.captchaRequired}]
                  })(<Input/>)}
                </Col>
                <Col span={12}>
                  <Button onClick={getCaptcha}>
                    {t.getCaptcha}
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('agreement', {valuePropName: 'checked'})(
                <Checkbox>
                  {t.iHaveRead}
                  <a onClick={() => dispatch({type: GO_FORWARD, payload: LEGAL})}>
                    {t.agreement}
                  </a>
                </Checkbox>
              )}
            </Form.Item>

            <div className="Row Between">
              <a onClick={() => dispatch({type: GO_FORWARD, payload: ENTER_EMAIL})}>
                {t.signInInstead}
              </a>
              <Button type="primary" htmlType="submit" loading={register.loading}
                      disabled={!Boolean(getFieldValue('agreement'))}>
                {t.register}
              </Button>
            </div>
          </div>

          <div className={flowStack[flowStack.length - 1] === LEGAL ? 'Fade-In' : 'Hidden'}>
            <a onClick={() => dispatch({type: GO_BACK})}>
              <Icon type="arrow-left"/>
            </a>

            <div className="Column">
              <BrandIcon/>
              <h1>{t.legalLabel}</h1>
            </div>

            <p style={{overflowY: 'scroll', maxHeight: '600px'}}>{t.legal}</p>
          </div>
        </Form>
      </Card>
    );
  } else if (flowStack[flowStack.length - 1] === RESET_PASSWORD) {
    let payload;

    if (resetKey) {
      payload = (
        <Form onSubmit={handlePasswordReset}>
          <div className="Column Centered">
            <BrandIcon/>
            <h1>
              {t.resetPassword}
            </h1>
          </div>

          <Form.Item label={t.passwordPlaceholder}>
            {getFieldDecorator('password', {
              rules: [
                {required: true, message: t.passwordRequired},
                {validator: validateToNextPassword},
                {min: 6, message: t.passwordMin(6)},
                {max: 64, message: t.passwordMax(64)}
              ]
            })(<Input.Password size="large" placeholder={t.passwordPlaceholder}/>)}
          </Form.Item>

          <Form.Item label={t.confirmPassword}>
            {getFieldDecorator('confirm', {
              rules: [
                {required: true, message: t.confirmPassword},
                {validator: compareToFirstPassword},
                {min: 6, message: t.passwordMin(6)},
                {max: 64, message: t.passwordMax(64)}
              ]
            })(<Input.Password size="large" onBlur={handleConfirmBlur} placeholder={t.confirmPassword}/>)}
          </Form.Item>

          <div className="Row End">
            <Button loading={resetPassword.loading} type="primary" htmlType="submit">
              {t.resetPassword}
            </Button>
          </div>
        </Form>
      );
    } else {
      payload = (
        <div className="Column Centered">
          <BrandIcon/>
          <h1>{t.resetRequest}</h1>
          <p>
            <Icon type="user"/> {getFieldValue('email')}
          </p>
          <p>
            {t.resetPasswordSuccess}
          </p>
        </div>
      );
    }

    return <Card style={{width: 400}}>{payload}</Card>;
  } else {
    return (
      <Card>
        <a onClick={() => dispatch({type: GO_BACK})}>
          <Icon type="arrow-left"/>
        </a>
      </Card>
    );
  }
};

export default (Form.create({name: 'auth_flow'})(AuthFlow));
