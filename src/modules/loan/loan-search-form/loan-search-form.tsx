import React, {useContext} from 'react';
import {Form} from 'antd';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import {Translation} from "../../../shared/contexts/translation";
import {FormComponentProps} from "antd/lib/form";

interface LoanSearchFormProps extends FormComponentProps {
  onSearchClicked: (amount: number, minDays: number) => void;
}

const LoanSearchForm = props => {
  const t = useContext(Translation).translation;
  const { getFieldDecorator, validateFields, getFieldValue } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        props.onSearchClicked(values.amount, values.minDays);
      }
    });
  };

  const canNotSubmit = (): boolean => {
    const amount: number = getFieldValue('amount');
    const minDays: number = getFieldValue('minDays');
    return !amount || !minDays;
  };

  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('amount', { initialValue: 100 })(
          <Input min="100" type="number" size="large"
                 prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                 placeholder={t.amount} />
        )}
      </Form.Item>
      <Form.Item>{
        getFieldDecorator('minDays')(
          <Input min="1" type="number" size="large"
                 prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                 placeholder={t.term} />
          )
      }</Form.Item>
      <Form.Item>
        <Button size="large" type="primary" htmlType="submit" disabled={canNotSubmit()}>
          {t.search}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create<LoanSearchFormProps>({ name: 'search_loan_form' })(LoanSearchForm);
