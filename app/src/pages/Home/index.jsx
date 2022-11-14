import React, { Component } from 'react';
import {BarsOutlined,AppstoreOutlined} from '@ant-design/icons'
import { Segmented } from 'antd';
import Content from '@/public/Content';
import { markID } from '@/utils/globalType';



export default class Home extends Component {
  render() {
    return (
      <>
        <div>
          <h1 style={{ fontSize: '35px', fontWeight: '600', display: 'inline-block' }}>新品</h1>
          <Segmented
            options={[
              {
                label: '展示',
                value: '展示',
                icon: <AppstoreOutlined />,
              },
              {
                label: '列表',
                value: '列表',
                icon: <BarsOutlined />,
              }
            ]}
            style={{
              float: 'right'  }}
          />
        </div>
        <Content markID={markID.allnft} />
      </>
    )
  }
}

