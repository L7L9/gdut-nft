import React from 'react'
import { Button, Form, Input } from 'antd';
import Selectnft from './Selectnft'
import './index.css'

export default function Mynft() {
  const onFinish = (values) => {
    // console.log('Success:', values);
    nftModel.create(values.name,values.des)
  };
  return (
    <div>
      <h1>铸造我的NFT</h1>
      <div className='out'>
        <div style={{ float: 'left', width: '300px', height: '300px'}}>
          <Selectnft/>
        </div>
        <div style={{ float: 'right', width: '300px', height: '300px'}}>
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
      style={{marginLeft:'-30px',marginTop:'50px'}}
    >
      <Form.Item
        label="名字："
        name="username"
        rules={[
          {
            required: true,
            message: '请输入名字!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="描述："
        name="des"
        rules={[
          {
            required: true,
            message: '请输入描述!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          确认铸造
        </Button>
      </Form.Item>
        </Form>
        </div>
      </div>
    </div>
  )
}