import React, { useState } from 'react';
import { Form, Steps } from 'antd';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import './create-loan-steps.scss';
import InputNumber from 'antd/lib/input-number';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Switch from 'antd/lib/switch';

const Step = Steps.Step;
const steps = ['Amount', 'Term', 'Rate', 'Options', 'Review'];

const CreateLoanSteps = props => {
  const { getFieldDecorator, getFieldValue } = props.form;
  const { balance = 1000 } = props;

  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    setCurrentStep(old => old + 1);
  };

  const validateTerm = (rule, value, callback) => {
    const number = parseInt(value || 0);

    if (Number.isNaN(number) || number <= 0) {
      callback('Price must greater than zero!');
      return;
    }

    callback();
  };

  return (
    <Card>
      <Form onSubmit={null}>
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item} title={item} />
          ))}
        </Steps>
        <div className="steps-content">
          <div className={currentStep === 0 ? 'active' : 'hidden'}>
            <Form.Item label="Amount to lend ¢">
              {getFieldDecorator('credit', { initialValue: balance })(
                <InputNumber style={{ width: '100%' }} size="large" precision={0} min={0} max={balance} />
              )}
            </Form.Item>
            <p>Allowed to spend: 1000¢</p>
            <Button type="primary">Recharge</Button>
          </div>

          <div className={currentStep === 1 ? 'active' : 'hidden'}>
            <Form.Item label="Length of term">
              {getFieldDecorator('term', { initialValue: 1, rules: [{ validator: validateTerm }] })(
                <Input
                  size="large"
                  addonAfter={
                    <Select defaultValue=".com">
                      <Select.Option value=".com">days</Select.Option>
                      <Select.Option value=".jp">months</Select.Option>
                      <Select.Option value=".cn">years</Select.Option>
                    </Select>
                  }
                />
              )}
            </Form.Item>
            <div>
              <p>Expected end date: 2020-29-02</p>
              <p>Minamal profit: 1000</p>
              <p>Overall profit: 1000 tooltip here</p>
              <p>Success rate: 1000</p>
            </div>
          </div>

          <div className={currentStep === 2 ? 'active' : 'hidden'}>
            <Form.Item label="Set your rate">
              {getFieldDecorator('rate', { initialValue: 1, rules: [{ validator: validateTerm }] })(
                <Input
                  size="large"
                  suffix="%"
                  addonAfter={
                    <Select defaultValue=".com">
                      <Select.Option value=".com">all time (adjust it based on prev tab - no sense show year)</Select.Option>
                      <Select.Option value=".com">per day</Select.Option>
                      <Select.Option value=".jp">per month</Select.Option>
                      <Select.Option value=".cn">per year</Select.Option>
                    </Select>
                  }
                />
              )}
            </Form.Item>
            <div>
              <p>Minamal profit: 1000</p>
              <p>Overall profit: 1000 tooltip here</p>
              <p>Success rate: 1000</p>
            </div>
          </div>

          <div className={currentStep === 3 ? 'active' : 'hidden'}>
            <Form.Item label="Set fine (not recommended)">
              {getFieldDecorator('fine', { initialValue: 1, rules: [{ validator: validateTerm }] })(
                <Input
                  size="large"
                  suffix="%"
                  addonAfter={
                    <Select defaultValue=".com">
                      <Select.Option value=".com">all time (adjust it based on prev tab - no sense show year)</Select.Option>
                      <Select.Option value=".com">per day</Select.Option>
                      <Select.Option value=".jp">per month</Select.Option>
                      <Select.Option value=".cn">per year</Select.Option>
                    </Select>
                  }
                />
              )}
            </Form.Item>
            <p>Fine if debtor could not pay in time.</p>
            <Form.Item label="Early payment is allowed">
              {getFieldDecorator('earlyPayment', { valuePropName: 'checked' })(<Switch defaultChecked />)}
            </Form.Item>
            <div>
              <p>Minamal profit: 1000</p>
              <p>Overall profit: 1000 tooltip here</p>
              <p>Success rate: 1000</p>
            </div>
          </div>
        </div>
        <div className="steps-action">
          {currentStep < steps.length - 1 && (
            <Button type="primary" disabled={getFieldValue('credit') <= 0} onClick={goNext}>
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
