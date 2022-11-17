import React, { Component,lazy } from 'react'
import { Input, Modal, Button, Form, Segmented } from 'antd'
import {BarsOutlined,AppstoreOutlined} from '@ant-design/icons'
import { connect } from 'react-redux';
import {Refresh} from '@/redux/actions/refresh'
import {loadingactionasync} from '@/redux/actions/loading'
import Selectfile from './Selectfile';
const PubTable=lazy(()=>import ('@/public/PubTable'))
import Content from '@/public/Content';
import { markID } from '@/utils/globalType';



class Activity extends Component{
  state = { isModalOpen: false,data:[123],value:'',show:'show'}
  showModal = () => this.setState({isModalOpen:true});
  handleOk = () => {
    const { submit } = this.refs;
    submit.click();
  };
  handleCancel = () => this.setState({isModalOpen:false});
  onSearch = value => {
    this.setState({ value })
    
  }
  showchange = (value) => {
    this.setState({show:value})
  }
  onFinish = (values) => {
    const { activityname, activitydes, nftname, nftdes, password, number } = values;
    const { form } = this.refs;
    form.resetFields();
    this.setState({ isModalOpen: false })
    activityModel.initiateActivity(activityname, activitydes, number, password, nftname, nftdes).then(() => {
      const { refresh, changerefresh, changeloding } = this.props
      changeloding(true,1000)
      changerefresh({...refresh,activity:true})
    }, (err) => {
      console.log(err);
    })
  };
  returnvalue = () => {
    if (this.state.value.trim != '') return { value:this.state.value}
    else return {}
  }
  render(){
    return <div>
      <h1 style={{ fontSize: '35px', fontWeight: '600', display: 'inline-block' }}>活动</h1>
      <div style={{overflow:'hidden',marginBottom:'15px'}}>
        <div className="search" style={{float:'left',marginTop:'3px'}}>
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
        <Segmented
            options={[
              {
                label: '展示',
                value: 'show',
                icon: <AppstoreOutlined />,
              },
              {
                label: '列表',
                value: 'list',
                icon: <BarsOutlined />,
              }
            ]}
            style={{ float: 'left',marginTop:'10px',marginLeft:'8px' }}
          onChange={this.showchange}
        />
        <Button type='primary' style={{ float: 'right', marginTop: '10px' }} onClick={this.showModal}>创建活动</Button>
      </div>
      {this.state.show==='show'?<Content markID={markID.activity} {...this.returnvalue()} />:<PubTable markID={markID.activity} issearch={true}/>}
      
    </div>
  }
}

export default connect(
  state => ({ loading: state.loading,refresh:state.refresh}),
  {
    changeloding: loadingactionasync,
    changerefresh:Refresh
  }
)(Activity)
