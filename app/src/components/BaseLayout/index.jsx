import React, { useEffect,useState,lazy,Suspense } from 'react'
import {} from 'react-redux'
import { Menu, Layout, message } from 'antd';
const { Header, Content, Footer } = Layout;
import { Routes, Route,useLocation,useNavigate } from 'react-router-dom';
import {loadingaction} from '@/redux/actions/loading'
import { items } from '@/routes/allmenuitems';
import { Navigate } from "react-router-dom";
const Home=lazy(()=>import ('@/pages/Home'))
const News=lazy(()=>import ('@/pages/News'))
const Nftdetail=lazy(()=>import ('@/pages/News/Nftdetail'))
const Adetail=lazy(()=>import ('@/pages/Activity/Detail'))
const Mydetail=lazy(()=>import ('@/pages/Message/Detail'))
const Searchdetail=lazy(()=>import ('@/pages/Search/Detail'))
const Search=lazy(()=>import ('@/pages/Search'))
const Activity=lazy(()=>import ('@/pages/Activity'))
const Mynft=lazy(()=>import ('@/pages/Mynft'))
const Notify=lazy(()=>import ('@/pages/Notify'))
const Message=lazy(()=>import ('@/pages/Message'))
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
	
  const navigate = useNavigate();
  // useEffect(effectFunc, []) 类似于 componentDidMount
  useEffect(() => {
    if (sessionStorage.getItem('islogin') != 'true') {
      message.info('请先登陆账号',2)
      navigate('/login')
    }
    switch (location.pathname) {
      case '/GDUT-nft/home':setcurrentpath(['首页']); break;
      case '/GDUT-nft/news/detail':
      case '/GDUT-nft/news': setcurrentpath(['新品']); break;
      case '/GDUT-nft/search/detail':
      case '/GDUT-nft/search': setcurrentpath(['搜索']); break;
      case '/GDUT-nft/activity/detail':
      case '/GDUT-nft/activity': setcurrentpath(['活动']); break;
      case '/GDUT-nft/mynft': setcurrentpath(['铸造我的nft']); break;
      case '/GDUT-nft/message/detail':
      case '/GDUT-nft/message': setcurrentpath(['个人信息']); break;
      case '/GDUT-nft/notify': setcurrentpath(['公告']); break;
    }
    dispatch(loadingaction(true))
    sessionStorage.setItem('search',false)
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
        className='allcontent'
        style={{
          padding: '50px 50px',
          position: 'relative',
          width: '100%',
          minHeight: '648px',
          backgroundColor:'#f8fbff'
        }}
    >
      <Suspense>
        <Routes>
        <Route path="/" element={<Navigate to={"/GDUT-nft/home"} />} />
        <Route path="/home"  element={loading?<Loading/>:<Home/>}  />
        <Route path="/news"  element={loading?<Loading/>:<News/>}  />
        <Route path="/news/detail"  element={<Nftdetail/>}  />
        <Route path="/search" element={<Search />} />
        <Route path='/search/detail' element={<Searchdetail />} />
        <Route path="/activity"  element={loading?<Loading/>:<Activity/>}/>
        <Route path="/activity/detail"  element={<Adetail/>}/>
        <Route path="/mynft" element={loading?<Loading/>:<Mynft/>} />
        <Route path="/message/detail" element={<Mydetail/>} />
        <Route path="/notify"  element={<Notify/>} />
        <Route path="/message"  element={loading?<Loading/>:<Message/>} />
        </Routes>
      </Suspense>
      
      </Content>
      <Footer
    style={{
      textAlign: 'center',
      backgroundColor:'#f8fbff'
    }}
  >
    GDUT-NFT ©2022 数字藏品
      </Footer>
    </Layout>
  )
}




