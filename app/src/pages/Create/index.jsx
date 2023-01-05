import React, { useState,useEffect } from 'react'
import { Button, Form, Input, message, Radio, Layout, Upload } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import Selectfile from '@/components/Selectfile'
import { Refresh } from '@/redux/actions/refresh'
import './index.css'
const { Header, Footer, Sider, Content } = Layout;


export default function Create() {
  const navigate = useNavigate();
  const [value, setValue] = useState(true)
  const [nftfile, setNftfile] = useState([])
  const [hover, sethover] = useState(false)
  const refresh = useSelector(state => state.refresh)
	
	// 修改中央仓库数据
	const dispatch = useDispatch()
  useEffect(() => {
    PubSub.subscribe("nftfile", (msg, data) => {
      data===1?setNftfile([]):setNftfile([data])
    })
  })
  const onFinish = async (values) => {
    let { userName, des, price, status, amount} = values;
    status ? nftModel.newCreate(userName, des, price, status, nftfile, amount) :
    nftModel.newCreate(userName, des, 0, status, nftfile, 1)
    dispatch(Refresh({...refresh,home:true,message:{mynft:true,mysell:true}}))
  };
  const onChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div>
      <h1 style={{ fontSize: '35px', fontWeight: '600', display: 'inline-block' }}>铸造</h1>
      <div style={{ width: '100%', height: '600px', backgroundColor: '#f8fbff',position:'relative',left:'50%',transform:'translateX(-50%)' }}>
        <Layout style={{height:'100%',backgroundColor: '#f8fbff'}}>
          <Layout style={{ backgroundColor: '#f8fbff', height: '100%' }} >
            <Selectfile type='foundry'/>
          </Layout>
          <Sider style={{ backgroundColor: '#f8f9fc', height: '100%',marginLeft:'20px' }} width='320'>
            <Header style={{backgroundColor:'#5b80d6',height:'60px',color:'white',fontSize:'18px'}}><FileImageOutlined />&nbsp;&nbsp;NFT信息</Header>
            <Content style={{position:'relative',height:'540px',borderColor:`${hover?'#1890ff':'#d9d9d9'}`,borderStyle:'none dashed dashed dashed',borderWidth:'1px',transition:'all .3s'}} onMouseEnter={()=>{sethover(true)}} onMouseLeave={()=>{sethover(false)}}>
              <div style={{ position: 'absolute', left: '45%',top:'50%', transform: 'translate(-50%,-50%)', width: '290px'}}>
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
                style={{marginTop:'22px'}}
                >
                <Form.Item
                  label="名字"
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
                  label="描述"
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
                  label="是否发行"
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
                  label="发行价格"
                  name="price"
                  rules={[
                    {
                      required: value,
                      message: '请输入发行价格!',
                    },
                    ]}
                    // style={{display:value?'block':'none'}}
                >
                  <Input disabled={!value}/>
                </Form.Item>
            
                <Form.Item
                  label="发行数量"
                  name="amount"
                  rules={[
                    {
                      required: value,
                      message: '请输入发行数量!',
                    },
                    ]}
                    // style={{ display: value ? 'block' : 'none' }}
                >
                    <Input disabled={!value} />
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
            </Content>
          </Sider>
        </Layout>
      </div>
    </div>
  )
}