import React, { Component } from 'react'
import { Form, Layout,Input,Button,Affix, InputNumber, message } from 'antd';
import { SearchOutlined,SwapRightOutlined } from '@ant-design/icons';
const { Content } = Layout;

export default class Search extends Component {
    state={min:0}
    onFinish = (values) => {
        const {setsearchvalue}=this.props
        const {lowprice,highprice}=values
        if (lowprice >= highprice)message.error('请设置好价格范围')
        else setsearchvalue(values);
    }
    render() {
        return (
            <Affix offsetTop={0}>
                <div style={{ height: '80px',backgroundColor:'#f8fbff'  }}>
                <Content style={{ padding: '20px 50px 0' }}>
                        <Form
                            layout='inline'
                            ref='form'
                            onFinish={this.onFinish}
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
                </Content>
                </div>
            </Affix>
        )
    }
}
