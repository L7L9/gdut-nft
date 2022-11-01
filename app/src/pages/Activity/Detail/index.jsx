import { Layout,Card,Button,Modal,Input } from 'antd';
import React,{useEffect,useState,useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
//引入connect用于连接UI组件与redux
import { useSelector, useDispatch } from 'react-redux'
import {loadingaction} from '@/redux/actions/loading'
import Loading from '@/components/Loading'


const { Header, Footer, Sider, Content } = Layout;
const {Meta}=Card

const Adetail = () => {
    // 拿到location
    const location = useLocation();

    // 修改中央仓库数据
        const dispatch = useDispatch()
        
    // useEffect(effectFunc, []) 类似于 componentDidMount
    useEffect(() => {
        dispatch(loadingaction(true))
    }, [location]);
    const loading = useSelector(state => state.loading)
    
    const navigate = useNavigate();
    const back = () => {
        navigate(-1);
    }
    const { state: { url:src,name,des,id,hostAddress,hostName,amount,nftName,nftDes,nftRest } } = useLocation()
    console.log(src,name,des,id,hostAddress,hostName,amount,nftName,nftDes,nftRest);
    const [isModalOpen, setModal] = useState(false)
    
    const pass = useRef();
    const showModal = () => {
        setModal(true)
    }
    const handleCancel = () => {
        setModal(false)
    }
    const handleOk = () => {
        let password = pass.current.input.value;
        activityModel.getNFT(id, password)
        setModal(false)
        pass.current.input.value =''
    }
    return (
        <>
            {loading?<Loading/>:<>
            <div style={{ width: '1180px', position: 'relative', left: '50%', transform: 'translate(-50%)' }}>
                <Layout>
                    <Sider style={{ backgroundColor: '#f0f2f5', height: '600px' }} width= '500px'>
                    <img src={src} alt="" style={{ width: '500px', height: '600px', borderRadius: '15px' }} />
                    </Sider>
                    <Layout >
                    <Header style={{ backgroundColor: '#f0f2f5' }}><h1 style={{fontSize:'50px',fontWeight:'600',float:'left',marginLeft:'100px'}}>{name}</h1></Header>
                    <Content style={{marginTop:'50px',paddingLeft:'60px'}}>
                        <Card
                        title={<span style={{fontSize:'20px'}}>活动信息</span>}
                        style={{ borderRadius: '15px',boxShadow: '8px 8px 8px 10px #ecf1f8'  }}
                        extra={<Button type="dashed" onClick={showModal}>领取NFT</Button>}
                        >
                            <h4>活动描述</h4>
                            <p style={{color:'#959599'}}>{des}</p>    
                            <h4>nft发行数量</h4>
                            <p style={{color:'#959599'}}>{amount}</p>        
                        </Card>
                    </Content>
                    <Footer >
                        <Meta
                            title={<span style={{fontSize:'13px',color:'gray'}}>举办者</span>}
                            description={<span style={{fontSize:'18px',color:'black'}}>{hostName} / <span style={{color:'#0070ef',fontSize:'14px'}}>{hostAddress}</span></span>}
                        />
                    </Footer>
                    </Layout>
                    
                </Layout>
                <h3 style={{marginTop:'60px',fontSize:'25px',fontWeight:'600'}}>nft名字</h3>
                <p style={{ color: '#959599', fontSize: '15px' }}>{nftName}</p> 
                <h3 style={{marginTop:'60px',fontSize:'25px',fontWeight:'600'}}>nft描述</h3>
                <p style={{ color: '#959599',fontSize:'15px'}}>{nftDes}</p>        
                <Button style={{ float: 'right', marginTop: '20px' }} type="dashed" onClick={back}>返回</Button>
                <Modal title="密钥输入框" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Input
                            placeholder="请输入密钥"
                            ref={pass}
                    allowClear={true}
                    />
                </Modal>
            </div>
            </>}
        </>
    )
}
    
export default Adetail;