import { Layout,Card,Button, Modal,Input,Form, message } from 'antd';
import React,{useEffect,useState,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
//引入connect用于连接UI组件与redux
import { useSelector, useDispatch } from 'react-redux'
import {loadingaction} from '@/redux/actions/loading'
import Loading from '@/components/Loading'

const { Header, Footer, Sider, Content } = Layout;
const {Meta}=Card

const Mydetail = () => {
    const location = useLocation();
    const dispatch = useDispatch()
    const user = useRef();
    useEffect(() => {
        dispatch(loadingaction(true))
    }, [location]);
    const loading = useSelector(state => state.loading)
    const navigate = useNavigate();
    const back = () => {
        navigate(-1);
    }
    const { state: { url:src,tokenId,nftName,nftDes,authorAddress,authorName,activityId,status,price } } = useLocation()
    const [open, setOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const submit = () => {
        const username = user.current.input.value;
        setConfirmLoading(true);
        nftModel.give(tokenId, username).then(() => {
            message.success('转赠成功', 1)
            setOpen(false);
            setConfirmLoading(false);
        }, () => {
            message.error('转赠失败，请稍后再试', 1)
            setOpen(false);
            setConfirmLoading(false);
        })
    }
    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    return (
        <>
            {loading?<Loading/>:<>
            <div style={{ width: '1180px', position: 'relative', left: '50%', transform: 'translate(-50%)' }}>
                <Layout>
                    <Sider style={{ backgroundColor: '#f0f2f5', height: '600px' }} width= '500px'>
                    <img src={src} alt="" style={{ width: '500px', height: '600px', borderRadius: '15px' }} />
                    </Sider>
                    <Layout >
                    <Header style={{ backgroundColor: '#f0f2f5' }}><h1 style={{fontSize:'50px',fontWeight:'600',float:'left',marginLeft:'100px'}}>{nftName}</h1></Header>
                    <Content style={{marginTop:'50px',paddingLeft:'60px'}}>
                        <Card
                        title='商品价格'
                        style={{ borderRadius: '15px',boxShadow: '8px 8px 8px 10px #ecf1f8'  }}
                        extra={<Button type="dashed" onClick={showModal}>转赠</Button>}
                        >
                        <h1 style={{ fontSize: '40px' }}>{status?`￥ ${price}`:'非卖品'}</h1>
                        
                        </Card>
                    </Content>
                    <Footer >
                        <Meta
                            title={<span style={{fontSize:'13px',color:'gray'}}>创作者</span>}
                            description={<span style={{fontSize:'18px',color:'black'}}>{authorName} / <span style={{color:'#0070ef',fontSize:'14px'}}>{authorAddress}</span></span>}
                        />
                        <Meta
                            title={<span style={{fontSize:'13px',color:'gray'}}>图片TokenId</span>}
                            description={<span style={{ color: '#0070ef', fontSize: '14px' }}>{tokenId}</span>}
                            style={{marginTop:'8px'}}
                        />        
                    </Footer>
                    </Layout>
                    
                </Layout>
                <h3 style={{marginTop:'60px',fontSize:'25px',fontWeight:'600'}}>商品描述</h3>
                <p style={{ color: '#959599',fontSize:'15px'}}>{nftDes}</p>    
                <Button style={{float:'right',marginTop:'20px'}}type="dashed" onClick={back}>返回</Button>
            </div>
            </>}
            <Modal
                title="转赠nft"
                open={open}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                onOk={submit}
            >
                <Input placeholder='请输入要转赠的账户' ref={user}></Input>
            </Modal>
        </>
    )
}
    
export default Mydetail;