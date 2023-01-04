import React, { Component } from 'react'
import { Layout, Card, Button, Modal, Input, message,Spin,Image,Typography  } from 'antd';
import { LeftOutlined,RightOutlined } from '@ant-design/icons';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css'
import { connect } from 'react-redux'
import Loading from '@/components/Loading';
import { Setdata } from '@/redux/actions/data'
import { Refresh } from '@/redux/actions/refresh'
import './index.less'
import { getmainColor } from '@/utils/getmainColor';
const { Header, Footer, Sider, Content } = Layout;
const { Meta } = Card
const { Text } = Typography;

class Detail extends Component {
    state = {
        spinning: true,
        details: {},
        open: false,
        confirmLoading: false,
        items: [],
        startIndex: 0,
        currentindex:0,
        leftbutton: 'leave',
        rightbutton: 'leave',
        previewimage: '',
        left:0
    }
    back = () => {
        window.history.back()
    }
    buy = () => {
        const { details: { cid },currentindex,left } = this.state
        const {refresh,changerefresh}=this.props
        message.loading('正在加载', .8)
        this.setState({spinning:true})
        nftModel.getSellNft(cid).then(() => {
            let newdetails = JSON.parse(sessionStorage.getItem('currentdetail'))
            newdetails[currentindex].left -= 1
            sessionStorage.setItem('currentdetail',JSON.stringify(newdetails))
            this.setState({left:left-1,details:newdetails[currentindex]})
            this.setState({spinning:false})
        })
        changerefresh({ ...refresh, home: true, message: true })
    }
    returnextra = () => {
        const { markID } = this.props
        console.log(markID);
        const { details } = this.state
        return markID === 'homedetail' ? <Button type='primary' disabled={details.left===0?true:false} onClick={this.buy}>购买</Button> :
            markID === 'messagedetail' ? <Button type='primary' onClick={this.showModal}>转赠</Button> :
            markID === 'activitydetail' ? <Button type='primary' onClick={this.showModal}>领取NFT</Button>:null
    }
    returnHeader = () => {
        const { markID } = this.props
        const  { details } = this.state
        return <h1 style={{ fontSize: '50px', fontWeight: '600', float: 'left', marginLeft: '100px' }}>
            {markID === 'activitydetail' ? details.name :details.nftName}
        </h1>
    }
    returnContent = () => {
        const { markID } = this.props
        const { details } = this.state
        return <Card
            title={markID === 'activitydetail'?'活动信息':'商品信息'}
            style={{ borderRadius: '15px',boxShadow: '8px 8px 8px 10px #ecf1f8'  }}
            extra={this.returnextra()}
            >
            {
                markID === 'activitydetail' ?
                    <>
                        <h4>活动描述</h4>
                        <p style={{color:'#959599'}}>{details.des}</p>    
                        <h4>nft发行数量</h4>
                        <p style={{color:'#959599'}}>{details.amount}</p>
                    </> :
                    <>
                        {markID !== 'nftsearch'?(details.left!==0 ?<h2 style={{ fontSize: '30px' }}>{`￥ ${details.price}`}</h2>:<Text italic style={{fontSize:'24px'}}>已售罄</Text>):<Text italic style={{fontSize:'24px'}}>非卖品</Text>}
                        <h3 style={{ marginTop: '30px', fontSize: '18px', fontWeight: '400' }}>商品描述</h3>
                        <p style={{ color: '#959599', fontSize: '15px' }}>{details.nftDes}</p>
                        {markID !== 'messagedetail'&&markID !== 'nftsearch' ?<h4>总发行数量 :<span style={{ color: '#959599',marginLeft:'5px',marginRight:'20px' }}>{details.amount}</span>剩余数量 :<span style={{color:'#959599',marginLeft:'5px'}}>{details.left}</span></h4>:null}
                    </>
            }
        </Card>
    }
    returnFooter = () => {
        const { markID } = this.props
        const { details } = this.state
        return markID === 'activitydetail' ?
            <Meta
            title={<span style={{fontSize:'15px',color:'gray'}}>举办者</span>}
            description={<span style={{fontSize:'18px',color:'black'}}>{details.hostName} / <span style={{color:'#0070ef',fontSize:'14px'}}>{details.hostAddress}</span></span>}
            /> :
            <>
            <Meta
                title={<span style={{fontSize:'15px',color:'gray'}}>创作者</span>}
                description={<span style={{fontSize:'18px',color:'black'}}>{details.authorName} / <span style={{color:'#0070ef',fontSize:'14px'}}>{details.authorAddress}</span></span>}
            />
            {markID === 'nftsearch' ? <><Meta
                title={<span style={{fontSize:'13px',color:'gray'}}>拥有者</span>}
                description={<span style={{ fontSize: '18px', color: 'black' }}>{details.ownerName} / <span style={{ color: '#0070ef', fontSize: '14px' }}>{details.ownerAddress}</span></span>}
                style={{marginTop:'8px'}}
            />
            <Meta
                title={<span style={{fontSize:'13px',color:'gray'}}>图片TokenId</span>}
                description={<span style={{ color: '#0070ef', fontSize: '14px' }}>{details.tokenId}</span>}
                style={{marginTop:'8px'}}
            /></>:null}
        </>
    }
    returnModal = () => {
        const {markID}=this.props
        return markID === 'messagedetail' ?
            <Modal
                title="转赠nft"
                open={this.state.open}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.handleCancel}
                onOk={this.submit}
                >
            <Input placeholder='请输入对方的用户名' ref='user'></Input>
            </Modal> :
        markID === 'activitydetail' ?
            <Modal
                    title="密钥输入框"
                    open={this.state.open}
                    onOk={this.getnft}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}>
            <Input placeholder="请输入密钥" ref='pass' allowClear={true}/>
            </Modal>:null
    }
    submit = () => {
        const { user } = this.refs
        const {details:{tokenId}}=this.state
        const username = user.input.value;
        this.setState({confirmLoading:true})
        nftModel.give(tokenId, username).then(() => {
            message.success('转赠成功', 1)
            this.setState({open:false})
            this.setState({confirmLoading:false})
        }, () => {
            message.error('转赠失败，请检查输入或稍后重试', 1)
            this.setState({open:false})
            this.setState({confirmLoading:false})
        })
    }
    getnft = async () => {
        const { refresh, changerefresh, markID } = this.props
        const {details: { id }} =this.state
        const {pass} = this.refs
        let password = pass.input.value;
        this.setState({confirmLoading:true})
        await activityModel.getNFT(id, password)
        this.setState({open:false})
        this.setState({ confirmLoading: false })
        const str=markID === 'homedetail' ? 'home' :
        markID === 'activitydetail' ? 'activity' :
        markID === 'messagedetail' ? 'message' : null
        changerefresh({...refresh,str:true})
    }
    showModal = () => {
        this.setState({open:true});
    };
    handleCancel = () => {
        this.setState({open:false});
    };
    renderNav = (onClick, disabled, direction) => {
        const { leftbutton, rightbutton } = this.state
        let hover=direction==='left'?leftbutton:rightbutton
        const props = {
            onClick: () => {
                if (!disabled) {
                    this.clicknav(direction)
                    onClick()
                }
            },
            onMouseEnter: () => {
                direction==='left'?this.setState({leftbutton:'enter'}):this.setState({rightbutton:'enter'})
            },
            onMouseLeave: () => {
                direction==='left'?this.setState({leftbutton:'leave'}):this.setState({rightbutton:'leave'})
            },
            style: {
                position: 'absolute',
                zIndex: 1,
                top: '50%',
                [direction]:'-65px',
                transform: 'translateY(-50%)',
                color: hover==='leave'?'#aeb0b2':'#337ab7',
                fontSize: '80px',
                transition: 'all .5s',
                cursor:disabled?'not-allowed':'pointer'}
        }
        return (
            direction==='left'?<LeftOutlined {...props}/>:<RightOutlined {...props}/>
        )
    }
    clicknav = (direction) => {
        const { currentindex } = this.state
        let index=direction === 'left' ?currentindex-1:currentindex+1
        this.setState({ spinning: true, currentindex: index })
        sessionStorage.setItem('index',index)
        sessionStorage.setItem('refresh',true)
        let details = JSON.parse(sessionStorage.getItem('currentdetail'))
        if(JSON.parse(sessionStorage.getItem('search')) === true)details = JSON.parse(sessionStorage.getItem('searchdetails'))
        setTimeout(()=>{this.setState({ details: details[index], spinning: false })},300)
    }
    slide = (index) => {
        this.setState({ spinning: true, currentindex: index })
        sessionStorage.setItem('index',index)
        sessionStorage.setItem('refresh',true)
        let details = JSON.parse(sessionStorage.getItem('currentdetail'))
        if(JSON.parse(sessionStorage.getItem('search')) === true)details = JSON.parse(sessionStorage.getItem('searchdetails'))
        setTimeout(()=>{this.setState({ details: details[index], spinning: false })},200)
    }
    preview = (event) => {
        let clickimage = document.querySelector('.ant-image');
        this.setState({ previewimage: event.target.src })
        getmainColor(event.target.src)
        clickimage.click()
    }
    componentDidMount() {
        const { alldata, markID, details } = this.props
        let { index: startIndex } = details
        const markid = markID === 'homedetail' ? 'allnft' :
        markID === 'activitydetail' ? 'activity' :
        markID === 'messagedetail' ? 'mynft' : 
        markID === 'myselldetail' ? 'mysell' : 
        markID === 'nftsearch'?'nftsearch':'allnft'
        let items = []
        const data=alldata.currentdata===undefined?JSON.parse(sessionStorage.getItem('currentdetail')):sessionStorage.setItem('currentdetail',JSON.stringify(alldata.currentdata))
        let currentdetails=alldata.currentdata===undefined?data:alldata.currentdata
        currentdetails.map(item => {
            items.push({
                original: item.url,
                thumbnail: item.url,
            })
        })
        let current = sessionStorage.getItem('index')
        let isrefresh = sessionStorage.getItem('refresh')
        startIndex=current!==null?
        (isrefresh==='true'?Number(current): startIndex):startIndex
        this.setState({ details: currentdetails[startIndex], items, startIndex, spinning: false, currentindex: startIndex,previewimage:currentdetails[startIndex].url,left:currentdetails[startIndex].left })
        if (JSON.parse(sessionStorage.getItem('search')) === true) {
            let searchdetails = JSON.parse(sessionStorage.getItem('searchdetails'))
            items=[]
            searchdetails.map(item => {
                items.push({
                    original: item.url,
                })
            })
            console.log(startIndex);
            this.setState({ details: searchdetails[startIndex], items, startIndex, spinning: false, currentindex: startIndex,previewimage:searchdetails[startIndex].url,left:searchdetails[startIndex].left })
        }
    }
    componentWillUnmount() {
        sessionStorage.setItem('refresh', false)
        sessionStorage.setItem('search',JSON.stringify(false))
    }
    render() {
        const { loading, markID } = this.props
        const { startIndex, items, spinning, details } = this.state
        return (
            <>
                {loading?<Loading/>:<>
                <div style={{ width: '1280px', position: 'relative', left: '50%', transform: 'translate(-50%)' }}>
                        <Spin
                            spinning={spinning}
                        >
                            <Layout >
                                <Sider style={{ borderRadius: '15px',backgroundColor: '#f8fbff' }} width='800px' >
                                    <ImageGallery
                                    useTranslate3D={false} // 取消3d
                                    infinite={false} // 取消无限轮播
                                    showFullscreenButton={false} // 隐藏全屏按钮
                                    showIndex={true} // 显示几分之几
                                    showPlayButton={false} // 隐藏播放按钮
                                    disableKeyDown={false} // 开启键盘左右键
                                    items={items}
                                    startIndex={startIndex}
                                    onThumbnailClick={(event, index)=>{this.slide(index)}}
                                    renderLeftNav={(onClick, disabled)=>this.renderNav(onClick,disabled,'left')}
                                    renderRightNav={(onClick, disabled) => this.renderNav(onClick, disabled, 'right')}
                                    onClick={(event)=>{this.preview(event)}}
                                    />
                                    <Image
                                        src={this.state.previewimage}
                                        style={{display:'none'}}
                                    />
                                </Sider>
                                <Layout style={{backgroundColor: '#f8fbff'}}>
                                <Header style={{ backgroundColor: '#f8fbff' }}>{this.returnHeader()}</Header>
                                <Content style={{marginTop:'50px',paddingLeft:'60px'}}>
                                    {this.returnContent()}
                                </Content>
                                <Footer style={{backgroundColor: '#f8fbff'}}>
                                    {this.returnFooter()}
                                </Footer>
                                </Layout>
                            </Layout>
                        </Spin>
                    {markID === 'activitydetail' ?
                        <>
                            <h3 style={{marginTop:'60px',fontSize:'25px',fontWeight:'600'}}>nft名字</h3>
                            <p style={{ color: '#959599', fontSize: '15px' }}>{details.nftName}</p>
                            <h3 style={{ marginTop: '60px', fontSize: '25px', fontWeight: '600' }}>nft描述</h3>
                            <p style={{ color: '#959599',fontSize:'15px'}}>{details.nftDes}</p>
                        </>:null
                    }
                    
                    <Button style={{float:'right',marginTop:'20px'}}type="dashed" onClick={this.back}>返回</Button>
                </div>
                </>}
                {this.returnModal()}
            </>
        )
    }
}

export default connect(
    state => ({alldata:state.data,loading:state.loading,refresh:state.refresh}),
    {
        updatedata: Setdata,
        changerefresh:Refresh
    }
)(Detail)