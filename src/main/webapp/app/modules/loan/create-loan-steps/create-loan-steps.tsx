import React, { useState } from 'react';
import { Form, Steps } from 'antd';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import InputNumber from 'antd/lib/input-number';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Switch from 'antd/lib/switch';
import moment from 'moment';
import { CREDIT_FEE_PERCENT, CREDIT_MIN_FEE } from 'app/config/constants';

enum Term {
  DAY,
  MONTH,
  YEAR,
  ALL_PERIOD
}

const Step = Steps.Step;
const steps = ['Amount', 'Rate', 'Term', 'Options', 'Review'];

const CreateLoanSteps = props => {
  const { getFieldDecorator, getFieldValue, setFields } = props.form;
  const { balance = 1000 } = props;

  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    setCurrentStep(old => old + 1);
  };

  const isNextButtonDisabled = (): boolean => {
    if (currentStep === 0) {
      return getFieldValue('credit') <= 0;
    } else if (currentStep === 1) {
      const number = Number(getFieldValue('rate') || 0);
      return Number.isNaN(number) || number <= 0;
    } else if (currentStep === 2) {
      return getFieldValue('term') <= 0;
    }
  };

  const getSuccessRate = () => {
    const term = Number(getFieldValue('term'));
    const rate = Number(getFieldValue('rate'));
    const rateType = getFieldValue('rate-type');
    let successRate = 100;

    // bigger term - bigger successRate
    const termModifier = 20;
    const termRate = Math.round(term / termModifier);
    if (termRate < termModifier) {
      successRate = successRate - (termModifier - termRate);
    }

    //bigger rate - lesser successRate
    let rateAtomic = 1;

    if (rateType === Term.ALL_PERIOD) {
      rateAtomic = 1;
    } else if (rateType === Term.YEAR) {
      rateAtomic = 1.5;
    } else if (rateType === Term.MONTH) {
      rateAtomic = 2;
    } else if (rateType === Term.DAY) {
      rateAtomic = 18;
    }

    const rateRate = Math.ceil(rateAtomic * rate);
    successRate = successRate - rateRate;

    let className = null;

    if (successRate >= 75) {
      className = 'status_green';
    } else if (successRate >= 35) {
      className = 'status_yellow';
    } else {
      className = 'status_red';
    }

    return (
      <span>
        Success rate: <strong className={className}>{`${Math.max(successRate, 0)}%`}</strong>
      </span>
    );
  };

  const getExpectedProfit = () => {
    const credit = Number(getFieldValue('credit'));
    const rate = Number(getFieldValue('rate'));
    let term = Number(getFieldValue('term'));
    const rateType = getFieldValue('rate-type');

    if (isNaN(term) || rateType === Term.ALL_PERIOD) {
      term = 1;
    }

    let profit = Math.round(term * credit * (1 + rate / 100));
    const fee = Math.round(profit * CREDIT_FEE_PERCENT);

    if (isNaN(profit)) {
      return;
    }

    if (fee < CREDIT_MIN_FEE) {
      profit = profit - CREDIT_MIN_FEE;
    } else {
      profit = profit - fee;
    }

    return (
      <span>
        Expected profit: {profit}¢. Fee is {fee}¢.
      </span>
    );
  };

  const getTermSuffix = (): string => {
    const rateType = getFieldValue('rate-type');
    let suffix = '';

    if (rateType === Term.ALL_PERIOD || rateType === Term.DAY) {
      suffix = 'days';
    } else if (rateType === Term.YEAR) {
      suffix = 'years';
    } else if (rateType === Term.MONTH) {
      suffix = 'months';
    }

    return suffix;
  };

  const getEndTermDate = () => {
    const term = Number(getFieldValue('term'));
    return moment().add(term, getTermSuffix());
  };

  return (
    <Card>
      <Form onSubmit={null}>
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item} title={item} />
          ))}
        </Steps>
        <div className="create-loan">
          <div className={currentStep === 0 ? 'create-loan-active' : 'hidden'}>
            <Form.Item label="Amount to lend">
              {getFieldDecorator('credit', { initialValue: balance })(
                <InputNumber
                  formatter={value => `¢ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¢\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                  size="large"
                  precision={0}
                  min={500}
                  max={balance}
                />
              )}
            </Form.Item>
            <p>Allowed to spend: 1000¢</p>
            <Button type="primary">Recharge</Button>
          </div>

          <div className={currentStep === 1 ? 'create-loan-active' : 'hidden'}>
            <Form.Item label="Set your rate">
              {getFieldDecorator('rate', { initialValue: 1 })(
                <Input
                  size="large"
                  suffix="%"
                  addonAfter={getFieldDecorator('rate-type', { initialValue: Term.ALL_PERIOD })(
                    <Select>
                      <Select.Option value={Term.ALL_PERIOD}>All Period</Select.Option>
                      <Select.Option value={Term.DAY}>Per Day</Select.Option>
                      <Select.Option value={Term.MONTH}>Per Months</Select.Option>
                      <Select.Option value={Term.YEAR}>Per Years</Select.Option>
                    </Select>
                  )}
                />
              )}
            </Form.Item>
            <p>{getExpectedProfit()}</p>
            <p>{getSuccessRate()}</p>
          </div>

          <div className={currentStep === 2 ? 'create-loan-active' : 'hidden'}>
            <Form.Item label={`Length of term ${getTermSuffix()}`}>
              {getFieldDecorator('term', {})(<InputNumber style={{ width: '100%' }} size="large" precision={0} min={1} />)}
            </Form.Item>
            <p>{`End date: ${getEndTermDate().calendar()}`}</p>
            <p>{getExpectedProfit()}</p>
            <p>{getSuccessRate()}</p>
          </div>

          <div className={currentStep === 3 ? 'create-loan-active' : 'hidden'}>
            <Form.Item label="Set fine (not recommended)">
              {getFieldDecorator('fine', { initialValue: 0 })(<InputNumber style={{ width: '100%' }} size="large" precision={0} min={0} />)}
            </Form.Item>
            <p>Fine if debtor could not pay in time.</p>
            <Form.Item label="Early payment is allowed">
              {getFieldDecorator('earlyPayment', { valuePropName: 'checked', initialValue: true })(<Switch />)}
            </Form.Item>
            <Form.Item label="Capitalization">
              {getFieldDecorator('capitalization', { valuePropName: 'checked', initialValue: true })(<Switch />)}
            </Form.Item>
            <div>
              <p>Minamal profit: 1000</p>
              <p>Overall profit: 1000 tooltip here</p>
              <p>Success rate: 1000</p>
            </div>
          </div>
        </div>
        <div className="create-loan-actions">
          {currentStep < steps.length - 1 && (
            <Button type="primary" disabled={isNextButtonDisabled()} onClick={goNext}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button htmlType="submit" type="primary" onClick={() => alert('Processing complete!')}>
              Done
            </Button>
          )}
          {currentStep > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => setCurrentStep(old => old - 1)}>
              Previous
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default Form.create({ name: 'create_loan' })(CreateLoanSteps);
