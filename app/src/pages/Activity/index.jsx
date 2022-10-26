import React, { Component } from 'react'
import { Input, Modal, Button, Form } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {loadingactionasync} from '@/redux/actions/loading'
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import Selectfile from './Selectfile';
import {nanoid} from 'nanoid'
const { Search } = Input;
import './index.css'



class Activity extends Component{
  state = { isModalOpen: false,data:[123],isModalOpen1:false,num:-1,id:''}
  showModal = () => this.setState({isModalOpen:true});
  showModal1 = (num, id) => {
    return () => {
      this.setState({ isModalOpen1: true,num,id})
    }
  };
  handleOk = () => {
    const { submit } = this.refs;
    submit.click();
  };
  handleOk1 = () => {
    const { num, id } = this.state
    const { pass: { input} } = this.refs
    let password = input.value;
    activityModel.getNFT(num, id, password)
    this.setState({ isModalOpen1: false })
  };
  handleCancel = () => this.setState({isModalOpen:false});
  handleCancel1 = () => this.setState({isModalOpen1:false});
  onSearch = async (value) => {
    this.setState({ data:[123] })
    const data = await activityModel.search(value);
    this.setState({ data })
  }
  onFinish = (values) => {
    const { activityname, activitydes, nftname, nftdes, password, number } = values;
    const { form } = this.refs;
    form.resetFields();
    this.setState({ isModalOpen: false })
    activityModel.initiateActivity(activityname, activitydes, number, password, nftname, nftdes).then(() => {
      this.props.changeloding(true,3000);
    }, (err) => {
      console.log(err);
    })
  };

  getdata2 = async () => {
    pageModel.showAllActivities().then(res => {
      this.setState({ data: res })
    })
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
      {
              this.state.data[0] == 123 ? <Loading /> : this.state.data.length == 0 ? <Nodata /> :
              <>
                <div className="showout1">
                  <div className="showin1">
                    {
                  this.state.data.map((item, index) => {
                    const {url,name,des,id,person,nftcid,number}=item
                    return <div className="item1" key={nanoid()} >
                        <Link to={`/GDUT-nft/activity/detail`} state={{url,name,des,id,person,nftcid,number}} > 
                            <img style={{ width: '100%', height: '220px' }} src={item.url}/>
                      </Link>
                      <span id="name0">名字：{item.name}</span><br/>
                      <span id="host0">举办者：{item.person}</span><br />
                        <Button type="dashed" onClick={this.showModal1(index,item.id)}>领取NFT</Button>
                    </div>
                        
                      })
                      
                    }
                  </div>
                </div>
              </>
      }
      <Modal title="密钥输入框" open={this.state.isModalOpen1} onOk={this.handleOk1} onCancel={this.handleCancel1}>
      <Input
      placeholder="请输入密钥"
      // iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          ref='pass'
          allowClear={true}
      />
      </Modal>
    </div>
  }
}

export default connect(
  state => ({ loading: state.loading}),
  {
      changeloding:loadingactionasync
  }
)(Activity)
