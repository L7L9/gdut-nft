import React, { Component,lazy } from 'react';
import {BarsOutlined,AppstoreOutlined} from '@ant-design/icons'
import { Segmented } from 'antd';
import Content from '@/public/Content';
const PubTable=lazy(()=>import ('@/public/PubTable'))
import { markID } from '@/utils/globalType';



export default class Home extends Component {
  state={show:'show'}
  showchange = (value) => {
    this.setState({show:value})
  }
  render() {
    return (
      <>
        <div>
          <h1 style={{ fontSize: '35px', fontWeight: '600', display: 'inline-block' }}>新品</h1>
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
        {this.state.show==='show'?<Content markID={markID.allnft}/>:<PubTable markID={markID.allnft} issearch={true}/>}
      </>
    )
  }
}

