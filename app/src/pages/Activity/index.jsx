import React, { Component } from 'react'
import { Input, Modal, Button, Form, Divider } from 'antd'
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import Selectfile from './Selectfile';
import {nanoid} from 'nanoid'
const { Search } = Input;
import './index.css'



export default class Activity extends Component{
  state = { isModalOpen: false,data:[123] }
  showModal = () => this.setState({isModalOpen:true});
  handleOk = () => {
    const { submit } = this.refs;
    submit.click();
  };
  handleCancel = () => this.setState({isModalOpen:false});
  onSearch = (value) => activityModel.search(value);
  onFinish = (values) => {
    const { activityname, activitydes, nftname, nftdes, password, number } = values;
    activityModel.initiateActivity(activityname, activitydes, number, password, nftname, nftdes)
    const { form } = this.refs;
    form.resetFields();
    this.setState({ isModalOpen: false })
  };
  getnft = (e) => {
    return () => {
      activityModel.getNFT(e)
    }
  }
  getdata1 = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{url:'',name:123,person:456},{url:'',name:12,person:45},{url:'',name:13,person:46},{url:'',name:23,person:56},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},{url:'',name:123,person:456},])
      },2000)
    })
  }
  getdata2 = async () => {
    const alldata = await this.getdata1();
    this.setState({data:alldata})
  }
  componentDidMount() {
    this.getdata2()
  }
  render(){
    return <div>
      <div style={{overflow:'hidden'}}>
      <h1 style={{float:'left'}}>当前链上活动有：</h1>
      <div className="search" style={{float:'left',marginTop:'3px'}}>
        <Search
      placeholder="查询活动"
      allowClear
      onSearch={this.onSearch}
      style={{
        width: 150,
      }}
      />
      </div>
      <Modal title="创建活动" open={this.state.isModalOpen}  onCancel={this.handleCancel}
      footer={[
        <Button key="back" onClick={this.handleCancel}>
          取消
        </Button>,
        <Button key="change" type="primary" onClick={this.handleOk}>
          确认创建
        </Button>]}>
        
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
          onFinish={this.onFinish}
          autoComplete="off"
          style={{ marginTop: '20px' }}
          ref='form'
        >
        <Form.Item
        label="文件"
        name="file"
      >
        <Selectfile/>
      </Form.Item>

      <Form.Item
        label="活动名字"
        name="activityname"
        rules={[
          {
            required: true,
            message: '请输入活动名字!',
          },
        ]}
      >
        <Input style={{width:'185px'}}/>
      </Form.Item>

      <Form.Item
        label="活动描述"
        name="activitydes"
        rules={[
          {
            required: true,
            message: '请输入活动描述!',
          },
        ]}
      >
        <Input style={{width:'185px'}}/>
      </Form.Item>

      <Form.Item
        label="nft名字"
        name="nftname"
        rules={[
          {
            required: true,
            message: '请输入nft名字!',
          },
        ]}
      >
        <Input style={{width:'185px'}}/>
      </Form.Item>
          
      <Form.Item
        label="nft描述"
        name="nftdes"
        rules={[
          {
            required: true,
            message: '请输入nft描述!',
          },
        ]}
      >
        <Input style={{width:'185px'}}/>
      </Form.Item>
          
      <Form.Item
        label="领取密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入领取密码!',
          },
        ]}
      >
        <Input style={{width:'185px'}}/>
      </Form.Item>
    
      <Form.Item
        label="发行数量"
        name="number"
        rules={[
          {
            required: true,
            message: '请输入发行数量!',
          },
        ]}
      >
        <Input style={{width:'185px'}}/>
      </Form.Item>
          
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" ref='submit'>
        </Button>
      </Form.Item>
      </Form>
      </Modal>
      <Button type='primary' style={{ float: 'right', marginTop: '10px' }} onClick={this.showModal}>我也要创建活动</Button>
      </div>
      <div className='itemsparent'>
        <div className="items">
          <div className="item">
          <div id="activity0">
          <span id="name0">名字：</span><br/>
          <span id="host0">举办者：</span><br/>
          <span id="description0"></span>
          <span id="activityId0" hidden></span>
          <Button type="dashed" onClick={this.getnft(0)}>领取NFT</Button>
        </div>
          </div>
          <div className="item">
        <div id="activity1">
          <span id="name1">名字：</span><br/>
          <span id="host1">举办者：</span><br/>
          <span id="description1"></span>
          <span id="activityId1" hidden></span>
          <Button type="dashed" onClick={this.getnft(1)}>领取NFT</Button>
        </div>
          </div>
          <div className="item">
        <div id="activity2">
          <span id="name2">名字：</span><br/>
          <span id="host2">举办者：</span><br/>
          <span id="description2"></span>
          <span id="activityId2" hidden></span>
          <Button type="dashed" onClick={this.getnft(2)}>领取NFT</Button>
        </div>
          </div>
          <div className="item">
        <div id="activity3">
          <span id="name3">名字：</span><br/>
          <span id="host3">举办者：</span><br/>
          <span id="description3"></span>
          <span id="activityId3" hidden></span>
          <Button type="dashed" onClick={this.getnft(3)}>领取NFT</Button>
        </div>
          </div>
        </div>
        <div style={{width:'100%',textAlign:'center',marginTop:'65px'}}>第 <label id="page">1</label> 页</div>
      </div>
      <Divider />
      <div style={{overflow:'hidden'}}>
        <h1 style={{float:'left'}}>当前链上活动有：</h1>
        <div className="search" style={{float:'left',marginTop:'3px'}}>
          <Search
        placeholder="查询活动"
        allowClear
        onSearch={this.onSearch}
        style={{
          width: 150,
        }}
          />
        </div>
        <Button type='primary' style={{ float: 'right', marginTop: '10px' }} onClick={this.showModal}>我也要创建活动</Button> 
      </div>
      {
              this.state.data[0] == 123 ? <Loading /> : this.state.data.length == 0 ? <Nodata /> :
              <>
                <div className="showout1">
                  <div className="showin1">
                    {
                      this.state.data.map(item => {
                      return <div className="item1" key={nanoid()}>  
                        <span id="name0">名字：{item.name}</span><br/>
                        <span id="host0">举办者：{item.person}</span><br/>
                          <Button type="dashed" onClick={this.getnft(0)}>领取NFT</Button>
                        </div>
                      })
                    }
                  </div>
                </div>
              </>
            }
    </div>
  }
}
