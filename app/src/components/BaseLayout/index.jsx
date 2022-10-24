import React, { useEffect,useState } from 'react'
import {} from 'react-redux'
import { Menu, Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import { Routes, Route,useLocation } from 'react-router-dom';
import {loadingaction} from '@/redux/actions/loading'
import { items } from '@/routes/allmenuitems';
import { Navigate } from "react-router-dom";
import Home from '@/pages/Home'
import Nftdetail from '@/pages/Home/Nftdetail'
import Adetail from '@/pages/Activity/Detail'
import Mydetail from '@/pages/Message/Detail'
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
  const [currentpath, setcurrentpath] = useState(['首页']);
  // 拿到location
  const location = useLocation();

  // 修改中央仓库数据
	const dispatch = useDispatch()
	
  // useEffect(effectFunc, []) 类似于 componentDidMount
  useEffect(() => {
    switch (location.pathname) {
      case '/GDUT-nft/home/detail':
      case '/GDUT-nft/home': setcurrentpath(['首页']); break;
      case '/GDUT-nft/search': setcurrentpath(['搜索']); break;
      case '/GDUT-nft/activity/detail':
      case '/GDUT-nft/activity': setcurrentpath(['活动']); break;
      case '/GDUT-nft/mynft': setcurrentpath(['铸造我的nft']); break;
      case '/GDUT-nft/message/detail':
      case '/GDUT-nft/message': setcurrentpath(['个人信息']); break;
      case '/GDUT-nft/notify': setcurrentpath(['公告']); break;
    }
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
          selectedKeys={currentpath}
          items={items}
        />
      </Header>
      <Content
        style={{
          padding: '50px 50px',
          position: 'relative',
          width: '100%',
          minHeight:'500px'
        }}
  >
    <Routes>
        <Route path="/" element={<Navigate to={"/GDUT-nft/home"} />} />
        <Route path="/home"  element={loading?<Loading/>:<Home/>}  />
        <Route path="/home/detail"  element={<Nftdetail/>}  />
        <Route path="/search"  element={<Search/>}  />
        <Route path="/activity"  element={loading?<Loading/>:<Activity/>}/>
        <Route path="/activity/detail"  element={<Adetail/>}/>
        <Route path="/mynft" element={loading?<Loading/>:<Mynft/>} />
        <Route path="/message/detail" element={<Mydetail/>} />
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




