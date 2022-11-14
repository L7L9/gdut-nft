import React, { Component } from 'react'
import { message, Button,Descriptions  } from 'antd'
import Content from '@/public/Content';
import { markID } from '@/utils/globalType';

export default class PersonMessage extends Component{
  state = { person: [] }
  getperson = async () => {
    const person = await pageModel.showMe()
    this.setState({ person })
  }
  componentDidMount() {
    this.getperson()
  }
  render(){
    return <div>
      <Descriptions title="用户信息" >
        <Descriptions.Item label="用户名">{this.state.person[0]}</Descriptions.Item>
        <Descriptions.Item label="用户链上id">{this.state.person[1]}</Descriptions.Item>
        <Descriptions.Item label="余额">{this.state.person[2]}</Descriptions.Item>
      </Descriptions>
      <h1>我拥有的nft:</h1>
      <Content markID={markID.mynft} />
  </div>
  }
}
