import React, {useContext, useState} from 'react';
import {Form, message, Statistic, Steps} from 'antd';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import InputNumber from 'antd/lib/input-number';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import moment from 'moment';
import Icon from 'antd/lib/icon';
import {
  CREDIT_FEE_PERCENT,
  CREDIT_MIN_FEE,
  DEALS_API,
  ERROR_NO_MONEY,
  MIN_CREDIT_AMOUNT
} from "../../../config/constants";
import {PaymentInterval} from "../../../shared/model/payment-interval";
import {Translation} from "../../../shared/contexts/translation";
import {UserBalance} from "../../../shared/contexts/user-balance";
import {IDeal} from "../../../shared/model/deal.model";
import axios from "axios";
import {coinFormatter, coinParser} from "../../../shared/util/entity-utils";

const Step = Steps.Step;

const CreateLoanSteps = props => {
  const {getFieldDecorator, getFieldValue, validateFields} = props.form;
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const translation = useContext(Translation);
  const balance = useContext(UserBalance);
  const t = translation.translation.CreateLoanSteps;
  const steps = [t.amount, t.rate, t.term, t.summary];

  const goNext = () => {
    setCurrentStep(old => old + 1);
  };

  const goBack = () => {
    setCurrentStep(old => old - 1);
  };

  const handleFormSubmission = event => {
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {

        setLoading(true);

        const newDeal: IDeal = {};
        newDeal.startBalance = values.credit;
        newDeal.percent = values.rate;
        newDeal.term = values.term;
        newDeal.paymentEvery = values['rate-type'];

        axios.post(DEALS_API, newDeal).then(payload => {
          const id = payload.data.id;
          props.history.push(`/loan/${id}`);
        }).catch(error => {

          setLoading(false);

          if (error.response.data.errorKey === ERROR_NO_MONEY) {
            message.error(t.noMoney);
          } else {
            message.error(t.sendingError);
          }
        });

      }
    });
  };

  const isNextButtonDisabled = (): boolean => {
    if (currentStep === 0) {
      return balance.balance < MIN_CREDIT_AMOUNT;
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
    const rateType: PaymentInterval = getFieldValue('rate-type');
    let successRate = 100;

    // bigger term - bigger successRate
    const termModifier = 20;
    const termRate = Math.round(term / termModifier);
    if (termRate < termModifier) {
      successRate = successRate - (termModifier - termRate);
    }

    //bigger rate - lesser successRate
    let rateAtomic = 1;

    if (rateType === PaymentInterval.MONTH) {
      rateAtomic = 2;
    } else if (rateType === PaymentInterval.DAY) {
      rateAtomic = 18;
    }

    return Math.max(Math.floor(successRate - rateAtomic * rate), 1);
  };

  const getSuccessRateElement = (rate: number): JSX.Element => {
    let className;

    if (rate >= 75) {
      className = 'status_green';
    } else if (rate >= 35) {
      className = 'status_yellow';
    } else {
      className = 'status_red';
    }

    return (
      <span>
        {t.successRate}: <strong className={className}>{`${rate}%`}</strong>
      </span>
    );
  };

  const getExpectedProfit = () => {
    const credit = Number(getFieldValue('credit'));
    const rate = Number(getFieldValue('rate'));
    let term = Number(getFieldValue('term'));
    const rateType: PaymentInterval = getFieldValue('rate-type');

    if (rateType === undefined || rateType === PaymentInterval.ONE_TIME) {
      term = 1;
    }

    const overhead = term * (credit * (rate / 100));
    let profit = overhead + credit;
    const averagePayment = profit / term;
    const fee = profit * CREDIT_FEE_PERCENT;

    if (isNaN(profit)) {
      return {profit: credit, fee: 0, averagePayment: 0, profitInPercent: 0};
    }

    if (fee < CREDIT_MIN_FEE) {
      profit = profit - CREDIT_MIN_FEE;
    } else {
      profit = profit - fee;
    }

    const profitInPercent = (profit / credit) * 100 - 100;

    return {
      profit: Math.round(profit),
      fee: Math.round(fee),
      averagePayment: Math.round(averagePayment),
      profitInPercent
    };
  };

  const getTermSuffix = (): string => {
    const rateType: PaymentInterval = getFieldValue('rate-type');

    if (rateType === PaymentInterval.MONTH) {
      return 'month';
    }

    return 'day';
  };

  const getEndTermDate = () => {
    const term = Number(getFieldValue('term'));
    // @ts-ignore
    return moment().add(term, getTermSuffix());
  };

  const expectedProfit = getExpectedProfit();
  const successRateValue = getSuccessRate();
  const successRate = getSuccessRateElement(successRateValue);
  const termSuffix = getTermSuffix();
  const paymentInterval: PaymentInterval = getFieldValue('rate-type');

  return (
    <Card>
      <Form onSubmit={handleFormSubmission}>
        <Steps current={currentStep}>
          {steps.map(item => (<Step key={item} title={item}/>))}
        </Steps>
        <div className="Column Centered Margin-Top-Medium">

          <div className={currentStep === 0 ? 'Column' : 'Hidden'}>
            <Form.Item label={t.amountToLend}>
              {getFieldDecorator('credit', {initialValue: MIN_CREDIT_AMOUNT})(
                <InputNumber
                  formatter={coinFormatter}
                  parser={coinParser}
                  style={{width: '100%'}}
                  size="large"
                  precision={0}
                  min={MIN_CREDIT_AMOUNT}
                  max={Math.max(balance.balance, MIN_CREDIT_AMOUNT)}
                />
              )}
            </Form.Item>
            <p>{`${t.allowedToSpend}: ${balance.balance}¢`}</p>
            <Button type="primary">{t.refill}</Button>
          </div>

          <div className={currentStep === 1 ? 'Column' : 'Hidden'}>
            <Form.Item label={t.setRate}>
              {getFieldDecorator('rate', {initialValue: '1'})(
                <Input size="large" suffix="%"
                       addonAfter={getFieldDecorator('rate-type', {initialValue: PaymentInterval.ONE_TIME})(
                         <Select>
                           <Select.Option value={PaymentInterval.ONE_TIME}>{t.oneTime}</Select.Option>
                           <Select.Option value={PaymentInterval.DAY}>{t.day}</Select.Option>
                           <Select.Option value={PaymentInterval.MONTH}>{t.month}</Select.Option>
                         </Select>
                       )}/>
              )}
            </Form.Item>
            <p>{`${t.expectedProfit}: ${expectedProfit.profit}¢. ${t.fee} ${expectedProfit.fee}¢.`}</p>
            <p>{successRate}</p>
          </div>

          <div className={currentStep === 2 ? 'Column' : 'Hidden'}>
            <Form.Item label={t.lengthOfTerm(termSuffix)}>
              {getFieldDecorator('term', {initialValue: 1})
              (<InputNumber style={{width: '100%'}} size="large" precision={0} min={1} max={999}/>)}
            </Form.Item>
            <p>{`${t.endDate}: ${getEndTermDate().calendar()}`}</p>
            <p>{`${t.expectedProfit}: ${expectedProfit.profit}¢. ${t.fee} ${expectedProfit.fee}¢.`}</p>
            <p>{`${t.averagePayment}: ${expectedProfit.averagePayment}¢.`}</p>
            <p>{successRate}</p>
          </div>

          <div className={currentStep === 3 ? 'Row Around Width-Full Height-Medium' : 'Hidden'}>
            <div className="Column Between">
              <Statistic title={t.amount} value={getFieldValue('credit')} suffix={`¢`}/>
              <Statistic
                title={t.revenue}
                value={`${expectedProfit.profit}¢`}
                suffix={
                  <Statistic
                    value={expectedProfit.profitInPercent}
                    precision={2}
                    valueStyle={{color: expectedProfit.profitInPercent > 0 ? '#3f8600' : '#cf1322'}}
                    prefix={expectedProfit.profitInPercent > 0 ? <Icon type="arrow-up"/> : <Icon type="arrow-down"/>}
                    suffix="%"
                  />
                }
              />
            </div>
            <div className="Column Between">
              <Statistic title={t.rate} value={getFieldValue('rate')} suffix={`% ${t.perTemporal(paymentInterval)}`}/>
              <Statistic title={t.term} value={getFieldValue('term')} suffix={`${t.temporal(paymentInterval)}`}/>
            </div>
            <div className="Column Between">
              <Statistic title={t.averagePayment} value={expectedProfit.averagePayment}
                         suffix={`¢ ${t.perTemporal(paymentInterval)}`}/>
              <Statistic title={t.successRate} value={successRateValue} suffix={`%`}/>
            </div>
          </div>

        </div>

        <div className="Margin-Top Text-Right">
          {currentStep > 0 &&
          (<Button disabled={loading} style={{marginRight: 8}} onClick={goBack}>{t.previous}</Button>)}
          {currentStep < steps.length - 1 &&
          (<Button type="primary" disabled={isNextButtonDisabled()} onClick={goNext}>{t.next}</Button>
          )}
          {currentStep === steps.length - 1 &&
          (<Button loading={loading} htmlType="submit" type="primary">{t.done}</Button>)}
        </div>
      </Form>
    </Card>
  );
};

export default Form.create({name: 'create_loan'})(CreateLoanSteps);
