import React, { Component } from 'react';
import {BarsOutlined,AppstoreOutlined,SearchOutlined,SwapRightOutlined} from '@ant-design/icons'
import { Segmented, Affix,Layout,Form,Input,Button, InputNumber, } from 'antd';
import SearchForm from '@/public/PubTable/SearchFrom'
import Content from '@/public/Content';
import PubTable from '@/public/PubTable'
import { markID } from '@/utils/globalType';



export default class Home extends Component {
  state={show:'show',min:0,values:{}}
  showchange = (value) => {
    this.setState({ show: value })
    if(value==='show')sessionStorage.setItem('search',false)
  }
  onFinish = (values) => {
    this.setState({values})
    sessionStorage.setItem('contentsearch',true)
  }
  componentDidMount() {
    sessionStorage.setItem('contentsearch',false)
  }
  componentWillUnmount() {
    sessionStorage.setItem('contentsearch',false)
  }
  render() {
    return (
      <>
        <div>
          <h1 style={{ fontSize: '35px', fontWeight: '600', display: 'inline-block' }}>新品</h1>
          <Affix offsetTop={0}>
            <div style={{ height: '80px',backgroundColor:'#f8fbff',padding:'24px 0'  }}>
              <Form
                  layout='inline'
                  ref='form'
                  onFinish={this.onFinish}
                  style={{float:'left'}}
                >
                  {this.props.markID!=='mynft'?<Form.Item label="作者" name="author">
                      <Input placeholder="请输入作者名" />
                  </Form.Item>:null}
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
        </div>
        {this.state.show === 'show' ?
          <Content markID={markID.allnft} value={this.state.values} /> :
          <PubTable markID={markID.allnft} value={this.state.values}/>}
      </>
    )
  }
}

