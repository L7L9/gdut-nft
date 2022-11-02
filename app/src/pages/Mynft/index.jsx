import React, { useState,useEffect } from 'react'
import { Button, Form, Input,message,Radio } from 'antd';
import { useNavigate } from 'react-router-dom'
import Selectnft from './Selectnft'
import './index.css'


export default function Mynft() {
  const navigate = useNavigate();
  const [value, setValue] = useState(false)
  const [nftfile, setNftfile] = useState([])
  useEffect(() => {
    PubSub.subscribe("nftfile", (msg, data) => {
      data===1?setNftfile([]):setNftfile([data])
    })
  })
  const onFinish = async (values) => {
    let { userName, des, price, status } = values;
    nftModel.create(userName, des,price?price:0,status,nftfile)
  };
  const onChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div>
      <h1>铸造我的NFT</h1>
      <div className='out'>
        <div style={{ float: 'left', width: '300px', height: '300px',position:'relative'}}>
          <div style={{position:'absolute',left:'50%',top:'35%',transform:'translate(-50%,-50%)'}}>
            <Selectnft />
          </div>
          <p style={{width:'100%',marginTop:'185px',marginLeft:'35px'}}>上传一张图片，获得一份独一无二的nft</p>
        </div>
        <div style={{ float: 'right', width: '300px', height: '320px'}}>
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
        label="是否发行："
        name="status"
        rules={[
          {
            required: true,
            message: '请选择是否发行!',
          },
          ]}
      >
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </Form.Item>
            
      <Form.Item
        label="发行价格："
        name="price"
        rules={[
          {
            required: value,
            message: '请输入发行价格!',
          },
          ]}
          style={{display:value?'block':'none'}}
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