import React, { Component,lazy } from 'react'
import { Segmented, PageHeader, Row, Tag, Typography,Statistic } from 'antd'
import {BarsOutlined,AppstoreOutlined,PayCircleOutlined } from '@ant-design/icons'
import Content from '@/public/Content';
const PubTable=lazy(()=>import ('@/public/PubTable'))
import { markID } from '@/utils/globalType';

export default class PersonMessage extends Component{
  state = { person: [],show:'show' }
  showchange = (value) => {
    this.setState({show:value})
  }
  getperson = async () => {
    const person = await pageModel.showMe()
    this.setState({ person })
  }
  componentDidMount() {
    this.getperson()
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
      {this.state.show==='show'?<Content markID={markID.mynft}/>:<PubTable markID={markID.mynft} issearch={true}/>}
  </div>
  }
}
