import { Form, Layout,Input,Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Content } = Layout;
import React, { Component } from 'react'
import './index.css'

export default class SearchForm extends Component {
    onFinish = (values) => {
        const { setsearchvalue } = this.props
        let { author, name } = values
        author=author===undefined?'':author
        name=name===undefined?'':name
        setsearchvalue(name,author)
    }
    render() {
        return (
            <>
                <div className='searchout'>
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
                        <Form.Item >
                            <Button type="primary" shape="round" icon={<SearchOutlined />} htmlType="submit"></Button>
                        </Form.Item>
                        </Form>
                    </Content>
                </div>
            </>
        )
    }
}
