import React, { Component } from 'react';
import { Layout,Card, Button } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

export default class Notify extends Component {
  render() {
    return (
      <div><h1>Notify</h1></div>
      // <>
      //   <div style={{ width: '1180px', position: 'relative', left: '50%', transform: 'translate(-50%)' }}>
      //     <Layout>
      //       <Layout >
      //         <Header style={{ backgroundColor: '#f0f2f5' }}><h1 style={{fontSize:'50px',fontWeight:'600',float:'right',marginRight:'100px'}}>name</h1></Header>
      //         <Content style={{marginTop:'20px',paddingRight:'60px'}}>
      //           <Card
      //             title="作者用户名+链上id"
      //             style={{ borderRadius: '15px' }}
      //             extra={<Button type="dashed" >购买</Button>}
      //           >
      //             <h1 style={{fontSize:'40px'}}>￥  999999999</h1>
      //             <h3>商品描述</h3>
      //             <p style={{color:'#959599'}}>画面表现的是中国古代山海经神话中西王母的形象，电影级的场景氛围，优雅的西王母犹如神女降临，美好中带着一丝霸气，尽显王母的气质。画面表现的是中国古代山海经神话中西王母的形象，电影级的场景氛围，优雅的西王母犹如神女降临，美好中带着一丝霸气，尽显王母的气质。</p>
      //           </Card>
      //         </Content>
      //         <Footer >
      //           <h2>拥有者+链上id</h2>
      //         </Footer>
      //       </Layout>
      //       <Sider style={{ backgroundColor: '#f0f2f5', height: '500px' }} width= '380px'>
      //         <img src="https://static.ibox.art/file/oss/test/image/nft-goods/56d0e75fc8014258a69dcdd07e43dbc6.png?style=st6" alt="" style={{ width: '380px', height: '500px', borderRadius: '15px' }} />
      //       </Sider>
      //     </Layout>
      //     <Button style={{float:'right',marginTop:'20px'}}type="dashed">返回</Button>
      //   </div>
      // </>
      
    )
  }
}