import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button,Form, Input } from 'antd';

export default function Register() {
  const navigate = useNavigate();
  const onFinish = (values) => {
    // console.log('Success:', values);
    accountModel.register(values.username, values.password)
  };
  const back = () => {
    navigate(-1);
  }
  return (
    <div className="wrapper">
      <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
      >
      <div className="header">GDUT-NFT</div>
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          注册
        </Button>
        <Button
                type="link"
                htmlType="button"
                onClick={back}
                style={{marginLeft:'100px'}}>
            返回
          </Button>
      </Form.Item>
    </Form>
    </div>
  )
}
