import React from 'react'
import { Button, Form, Input,message } from 'antd';
import { useNavigate } from 'react-router-dom'
import Selectnft from './Selectnft'
import './index.css'


export default function Mynft() {
  const navigate = useNavigate();
  const onFinish = (values) => {
    nftModel.create(values.userName, values.des).then(() => {
      setTimeout(() => {
        message.success("创建成功", 1);
        navigate('/GDUT-nft/home')
      }, 2000)
    }, () => {
      message.error('未选择文件，铸造失败', 1)
    })
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
        name="userName"
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