import React, {useState} from 'react';
import {Form, Statistic, Steps} from 'antd';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import InputNumber from 'antd/lib/input-number';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Switch from 'antd/lib/switch';
import moment from 'moment';
import Icon from 'antd/lib/icon';
import {CREDIT_FEE_PERCENT, CREDIT_MIN_FEE} from "../../../config/constants";

enum Term {
  DAY,
  MONTH,
  YEAR,
  ALL_PERIOD
}

const Step = Steps.Step;
const steps = ['Amount', 'Rate', 'Term', 'Options', 'Summary'];

const CreateLoanSteps = props => {
  const { getFieldDecorator, getFieldValue, validateFields } = props.form;
  const { balance = 1000 } = props;

  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    if (currentStep === 2) {
      setCurrentStep(4);
    } else {
      setCurrentStep(old => old + 1);
    }
  };

  const goBack = () => {
    setCurrentStep(old => old - 1);
  };

  const handleFormSubmission = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        alert(values.valueOf());
      }
    });
  };

  const isNextButtonDisabled = (): boolean => {
    if (currentStep === 0) {
      return getFieldValue('credit') <= 0;
    } else if (currentStep === 1) {
      const number = Number(getFieldValue('rate'));
      return isNaN(number) || number <= 0;
    } else if (currentStep === 2) {
      return getFieldValue('term') <= 0;
    }

    return false;
  };

  const getSuccessRate = () => {
    const term = Number(getFieldValue('term'));
    const rate = Number(getFieldValue('rate'));
    const fine = Number(getFieldValue('fine'));
    const rateType = getFieldValue('rate-type');
    const earlyPayment: boolean = getFieldValue('earlyPayment');
    const capitalization: boolean = getFieldValue('capitalization');
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

    successRate = successRate - rateAtomic * rate;

    if (fine > 0) {
      successRate = successRate - (rateAtomic + 9) * fine;
    }

    if (!earlyPayment) {
      successRate = successRate - 5;
    }

    if (!capitalization) {
      successRate = successRate - 19;
    }

    let className;

    if (successRate >= 75) {
      className = 'status_green';
    } else if (successRate >= 35) {
      className = 'status_yellow';
    } else {
      className = 'status_red';
    }

    return (
      <span>
        Success rate: <strong className={className}>{`${Math.max(Math.floor(successRate), 1)}%`}</strong>
      </span>
    );
  };

  const getExpectedProfit = () => {
    const credit = Number(getFieldValue('credit'));
    const rate = Number(getFieldValue('rate'));
    let term = Number(getFieldValue('term'));
    const capitalization: boolean = getFieldValue('capitalization');
    const rateType: Term = getFieldValue('rate-type');

    if (rateType === undefined || rateType === Term.ALL_PERIOD) {
      term = 1;
    }

    let averagePayment;
    let profit;
    const percentInPeriod = 1 + rate / 100;

    if (capitalization) {
      averagePayment = (credit * percentInPeriod ** term * (percentInPeriod - 1)) / (percentInPeriod ** term - 1);
      profit = averagePayment * term;
    } else {
      profit = credit * percentInPeriod ** term;
      averagePayment = profit / term;
    }

    const fee = profit * CREDIT_FEE_PERCENT;

    if (isNaN(profit)) {
      return { profit: credit, fee: 0, averagePayment: 0, profitInPercent: 0 };
    }

    if (fee < CREDIT_MIN_FEE) {
      profit = profit - CREDIT_MIN_FEE;
    } else {
      profit = profit - fee;
    }

    const profitInPercent = (profit / credit) * 100 - 100;

    return { profit: Math.round(profit), fee: Math.round(fee), averagePayment: Math.round(averagePayment), profitInPercent };
  };

  const getTermSuffix = (): string => {
    const rateType = getFieldValue('rate-type');
    let suffix = '';

    if (rateType === Term.ALL_PERIOD || rateType === Term.DAY) {
      suffix = 'day';
    } else if (rateType === Term.YEAR) {
      suffix = 'year';
    } else if (rateType === Term.MONTH) {
      suffix = 'month';
    }

    return suffix;
  };

  const getEndTermDate = () => {
    const term = Number(getFieldValue('term'));
    // @ts-ignore
    return moment().add(term, getTermSuffix());
  };

  const expectedProfit = getExpectedProfit();
  const successRate = getSuccessRate();
  const termSuffix = getTermSuffix();

  return (
    <Card>
      <Form onSubmit={handleFormSubmission}>
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
                  parser={value => Number(value ? value.replace(/\¢\s?|(,*)/g, '') : 0)}
                  style={{ width: '100%' }}
                  size="large"
                  precision={0}
                  min={500}
                  max={balance}
                />
              )}
            </Form.Item>
            <p>Allowed to spend: {balance}¢</p>
            <Button type="primary">Recharge</Button>
          </div>

          <div className={currentStep === 1 ? 'create-loan-active' : 'hidden'}>
            <Form.Item label="Set your rate">
              {getFieldDecorator('rate', { initialValue: '1' })(
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
            <p>
              Expected profit: {expectedProfit.profit}¢. Fee is {expectedProfit.fee}¢.
            </p>
            <p>{successRate}</p>
          </div>

          <div className={currentStep === 2 ? 'create-loan-active' : 'hidden'}>
            <Form.Item label={`Length of term ${termSuffix}s`}>
              {getFieldDecorator('term', { initialValue: 1 })(<InputNumber style={{ width: '100%' }} size="large" precision={0} min={1} />)}
            </Form.Item>
            <p>{`End date: ${getEndTermDate().calendar()}`}</p>
            <p>
              Expected profit: {expectedProfit.profit}¢. Fee is {expectedProfit.fee}¢.
            </p>
            <p>{successRate}</p>
          </div>

          <div className={currentStep === 3 ? 'create-loan-active' : 'hidden'}>
            <Form.Item label={`Set fine (not recommended)`}>
              {getFieldDecorator('fine', { initialValue: 0 })(<InputNumber style={{ width: '100%' }} size="large" precision={2} min={0} />)}
            </Form.Item>

            <p>Some % if debtor could not pay in time.</p>

            <Form.Item label="Capitalization">
              {getFieldDecorator('capitalization', { valuePropName: 'checked', initialValue: true })(<Switch />)}
            </Form.Item>

            <Form.Item label="Early payment">
              {getFieldDecorator('earlyPayment', { valuePropName: 'checked', initialValue: true })(<Switch />)}
            </Form.Item>

            <p>
              Expected profit: {expectedProfit.profit}¢. Fee is {expectedProfit.fee}¢.
            </p>
            <p>Average payment: {expectedProfit.averagePayment}¢.</p>
            <p>{successRate}</p>
          </div>

          <div className={currentStep === 4 ? 'create-loan-active create-loan-summary' : 'hidden'}>
            <div className="create-loan-summary__column">
              <Statistic title="Amount" value={getFieldValue('credit')} suffix={`¢`} />
              <Statistic
                title="Revenue"
                value={expectedProfit.profit}
                suffix={
                  <Statistic
                    value={expectedProfit.profitInPercent}
                    precision={2}
                    valueStyle={{ color: expectedProfit.profitInPercent > 0 ? '#3f8600' : '#cf1322' }}
                    prefix={expectedProfit.profitInPercent > 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}
                    suffix="%"
                  />
                }
              />
              <Statistic title="Rate" value={getFieldValue('rate')} suffix={`% per ${termSuffix}`} />
            </div>

            <div className="create-loan-summary__column">
              <Statistic title="Term" value={getFieldValue('term')} suffix={`${termSuffix}`} />
              <Statistic title="Fee" value={expectedProfit.fee} suffix={`¢`} />
              <Statistic title="Average payment" value={expectedProfit.averagePayment} suffix={`¢ in ${termSuffix}`} />
            </div>

            <div className="create-loan-summary__column">
              <Statistic title="Capitalization" value={getFieldValue('capitalization') ? 'Yes' : 'No'} />
              <Statistic title="Early payment" value={getFieldValue('earlyPayment') ? 'Yes' : 'No'} />
              <Statistic title="Fine" value={getFieldValue('fine')} suffix={`%`} />
            </div>
          </div>
        </div>
        <div className="create-loan-actions">
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={goBack}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" disabled={isNextButtonDisabled()} onClick={goNext}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button htmlType="submit" type="primary">
              Done
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default Form.create({ name: 'create_loan' })(CreateLoanSteps);
