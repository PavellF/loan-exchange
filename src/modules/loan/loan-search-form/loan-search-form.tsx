import React, {useEffect} from 'react';
import {DatePicker, Form} from 'antd';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const LoanSearchForm = props => {
  useEffect(() => {
    props.form.validateFields();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;

  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('amount', { initialValue: 100 })(
          <Input type="number" prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Credit amount" />
        )}
      </Form.Item>
      <Form.Item>{getFieldDecorator('minDays')(<DatePicker placeholder="For days" />)}</Form.Item>
      <Form.Item>{getFieldDecorator('password', { initialValue: true })(<Checkbox>Досрочное погашение</Checkbox>)}</Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: 'search_loan_form' })(LoanSearchForm);
