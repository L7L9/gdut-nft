import React, { Component } from 'react'
import { Input, Modal, Button, Form, Segmented,Affix } from 'antd'
import {BarsOutlined,AppstoreOutlined,SearchOutlined} from '@ant-design/icons'
import { connect } from 'react-redux';
import {Refresh} from '@/redux/actions/refresh'
import {loadingactionasync} from '@/redux/actions/loading'
import Selectfile from '@/components/Selectfile';
import PubTable from '@/public/PubTable'
import Content from '@/public/Content';
import { markID } from '@/utils/globalType';



class Activity extends Component{
  state = { isModalOpen: false,data:[123],value:'',show:'show',activityfile:[],min:0,values:{}}
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
    this.setState({ show: value })
    if(value==='show')sessionStorage.setItem('search',false)
  }
  onFinish = (values) => {
    const { activityname, activitydes, nftname, nftdes, password, number } = values;
    const { form } = this.refs;
    const {activityfile}=this.state
    form.resetFields();
    this.setState({ isModalOpen: false })
    activityModel.initiateActivity(activityname, activitydes, number, password, nftname, nftdes,activityfile).then(() => {
      const { refresh, changerefresh, changeloding } = this.props
      changeloding(true,1000)
      changerefresh({...refresh,activity:true})
    }, (err) => {
      console.log(err);
    })
  };
  onFinish1 = (values) => {
    this.setState({values})
    sessionStorage.setItem('contentsearch',true)
  }
  returnvalue = () => {
    if (this.state.value.trim != '') return { value:this.state.value}
    else return {}
  }
  componentDidMount() {
    sessionStorage.setItem('contentsearch',false)
    PubSub.subscribe("activityfile", (msg, data) => {
      data===1?this.setState({activityfile:[]}):this.setState({activityfile:[data]})
    })
  }
  componentWillUnmount() {
    sessionStorage.setItem('contentsearch',false)
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
        <div style={{ width: '104px', height: '104px' }}>
          <Selectfile type='create'/>
        </div>
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
        <Affix offsetTop={0}>
            <div style={{ height: '80px',backgroundColor:'#f8fbff',padding:'24px 0'  }}>
              <Form
                  layout='inline'
                  ref='form'
                  onFinish={this.onFinish1}
                  style={{float:'left'}}
                >
                  <Form.Item label="作者" name="author">
                      <Input placeholder="请输入作者名" />
                  </Form.Item>
                  <Form.Item label={this.props.markID==='activity'?'活动':'作品' } name="name">
                      <Input placeholder={`请输入${this.props.markID==='activity'?'活动':'作品' }名`}/>
                  </Form.Item>
                  <Form.Item >
                      <Button type="primary" shape="round" icon={<SearchOutlined />} htmlType="submit"></Button>
                  </Form.Item>
              </Form>
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
                style={{ float: 'right',marginLeft:'8px' }}
                onChange={this.showchange}
            />
            <Button type='primary' style={{ float: 'right' }} onClick={this.showModal}>创建活动</Button>
            </div>
        </Affix>
        
      </div>
      {this.state.show === 'show' ?
        <Content markID={markID.activity} {...this.returnvalue()} value={this.state.values}/> :
        <PubTable markID={markID.activity} value={this.state.values}/>}
      
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
