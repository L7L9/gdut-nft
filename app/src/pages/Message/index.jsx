import React, { Component } from 'react'
import { Segmented, PageHeader, Row, Tag, Typography,Statistic,Affix,Form,Input,InputNumber,Button } from 'antd'
import {BarsOutlined,AppstoreOutlined,PayCircleOutlined,SearchOutlined,SwapRightOutlined } from '@ant-design/icons'
import Content from '@/public/Content';
import PubTable from '@/public/PubTable'
import { markID } from '@/utils/globalType';

export default class PersonMessage extends Component{
  state = { person: [],show:'show',values:{},min:0 }
  showchange = (value) => {
    this.setState({ show: value })
    if(value==='show')sessionStorage.setItem('search',false)
  }
  getperson = async () => {
    const person = await pageModel.showMe()
    this.setState({ person })
  }
  componentDidMount() {
    this.getperson()
    sessionStorage.setItem('contentsearch',false)
  }
  onFinish = (values) => {
    this.setState({values})
    sessionStorage.setItem('contentsearch',true)
  }
  componentWillUnmount() {
    sessionStorage.setItem('contentsearch',false)
  }
  render() {
    const { person } = this.state
    return <div>
      <h3>用户信息</h3>
      <PageHeader
        title={person[0]}
        className="site-page-header"
        tags={<Tag color="blue">铸造者</Tag>}
      >
        <Row>
          <Statistic title="Balance" prefix={<PayCircleOutlined />} value={person[2]} valueStyle={{fontSize:'18px'}}/>
          <Statistic title="链上id" value={person[1]} style={{ marginLeft: '50px' }} valueStyle={{color:'#00a0f5',fontSize:'18px'}} />
        </Row>
      </PageHeader>
      <h1 style={{ fontSize: '35px', fontWeight: '600', display: 'inline-block' }}>我的</h1>
      <Affix offsetTop={0}>
            <div style={{ height: '80px',backgroundColor:'#f8fbff',padding:'24px 0'  }}>
              <Form
                  layout='inline'
                  ref='form'
                  onFinish={this.onFinish}
                  style={{float:'left'}}
                >
                  <Form.Item label={this.props.markID==='activity'?'活动':'作品' } name="name">
                      <Input placeholder={`请输入${this.props.markID==='activity'?'活动':'作品' }名`}/>
                  </Form.Item>
                  <Form.Item label='价格范围' name="lowprice">
                      <InputNumber placeholder={'最低价格'} min={0} onChange={(e)=>this.setState({min:e+1})} />
                  </Form.Item>
                      <SwapRightOutlined style={{marginTop:'9px',marginRight:'20px'}}/>
                  <Form.Item name="highprice">
                      <InputNumber placeholder={'最高价格'} min={this.state.min}  />
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
                style={{ float: 'right' }}
                onChange={this.showchange}
              />
            </div>
      </Affix>
      {this.state.show === 'show' ?
        <Content markID={markID.mynft} value={this.state.values}/> :
        <PubTable markID={markID.mynft} value={this.state.values}/>}
  </div>
  }
}
