import React, { useEffect } from 'react'
import {} from 'react-redux'
import { Menu, Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import { Routes, Route,useLocation } from 'react-router-dom';
import {loadingaction} from '@/redux/actions/loading'
import { items } from '@/routes/allmenuitems';
import { Navigate } from "react-router-dom";
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Activity from '@/pages/Activity'
import Mynft from '@/pages/Mynft'
import Notify from '@/pages/Notify'
import Message from '@/pages/Message'
import Loading from '@/components/Loading'
import './index.css'

//引入connect用于连接UI组件与redux
import { useSelector,useDispatch } from 'react-redux'


export default function BaseLayout() {
  // 拿到location
  const location = useLocation();

  // 修改中央仓库数据
	const dispatch = useDispatch()
	
  // useEffect(effectFunc, []) 类似于 componentDidMount
  useEffect(() => {
    dispatch(loadingaction(true))
  }, [location]);
  const loading = useSelector(state => state.loading)
  return (
    <Layout className="layout">
      <Header style={{backgroundColor:'white',height:'74px'}}>
    <a href="" style={{float:'right',color:'black'}} className="logout">注销</a>
    <Menu
      theme="light"
      mode="horizontal"
      defaultSelectedKeys={['首页']}
      items={items}
    />
      </Header>
      <Content
    style={{
      padding: '50px 50px',
      position: 'relative',
      width:'100%'
    }}
  >
    <Routes>
        <Route path="/" element={<Navigate to={"/GDUT-nft/home"} />} />
        <Route path="/home"  element={loading?<Loading/>:<Home/>}  />
        <Route path="/search"  element={loading?<Loading/>:<Search/>}  />
        <Route path="/activity"  element={loading?<Loading/>:<Activity/>}/>
        <Route path="/mynft" element={loading?<Loading/>:<Mynft/>} />
        <Route path="/notify"  element={loading?<Loading/>:<Notify/>} />
        <Route path="/message"  element={loading?<Loading/>:<Message/>} />
      </Routes>
      </Content>
      <Footer
    style={{
      textAlign: 'center',
    }}
  >
    GDUT-NFT ©2022 数字藏品
      </Footer>
    </Layout>
  )
}




