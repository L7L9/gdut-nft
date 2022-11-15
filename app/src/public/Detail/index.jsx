import React, { Component } from 'react'
import { Layout,Card,List,Button,Modal,Input,message } from 'antd';
import { connect } from 'react-redux'
import Loading from '@/components/Loading';
import { Setdata } from '@/redux/actions/data'
const { Header, Footer, Sider, Content } = Layout;
const {Meta}=Card

class Detail extends Component {
    state = { loading: true, details: {},open:false,confirmLoading:false }
    back = () => {
        window.history.back()
    }
    buy = () => {
        const { details: { ownerAddress, tokenId } } = this.props
        message.loading('正在加载',.8)
        nftModel.buyNft(ownerAddress,tokenId)
    }
    returnextra = () => {
        const { markID,details } = this.props
        return markID === 'homedetail' ? <Button type="dashed" disabled={!details.status} onClick={this.buy}>购买</Button> :
            markID === 'messagedetail' ? <Button type="dashed" onClick={this.showModal}>转赠</Button> :
            markID === 'activitydetail' ? <Button type="dashed" onClick={this.showModal}>领取NFT</Button>:null
    }
    returnHeader = () => {
        const { markID,details } = this.props
        return <h1 style={{ fontSize: '50px', fontWeight: '600', float: 'left', marginLeft: '100px' }}>
            {markID === 'activitydetail' ? details.name :details.nftName}
        </h1>
    }
    returnContent = () => {
        const { markID,details } = this.props
        return <Card
            title={markID === 'activitydeatil'?'活动信息':'商品价格'}
            style={{ borderRadius: '15px',boxShadow: '8px 8px 8px 10px #ecf1f8'  }}
            extra={this.returnextra()}
            >
            {
                markID === 'activitydetail' ? <>
                    <h4>活动描述</h4>
                    <p style={{color:'#959599'}}>{details.des}</p>    
                    <h4>nft发行数量</h4>
                    <p style={{color:'#959599'}}>{details.amount}</p>
                </> :
                <h1 style={{ fontSize: '40px' }}>{details.status ? `￥ ${details.price}` : '非卖品'}</h1>
            }
        </Card>
    }
    returnFooter = () => {
        const { markID,details } = this.props
        return markID === 'activitydetail' ?
            <Meta
            title={<span style={{fontSize:'13px',color:'gray'}}>举办者</span>}
            description={<span style={{fontSize:'18px',color:'black'}}>{details.hostName} / <span style={{color:'#0070ef',fontSize:'14px'}}>{details.hostAddress}</span></span>}
            /> :
            <>
            <Meta
                title={<span style={{fontSize:'13px',color:'gray'}}>创作者</span>}
                description={<span style={{fontSize:'18px',color:'black'}}>{details.authorName} / <span style={{color:'#0070ef',fontSize:'14px'}}>{details.authorAddress}</span></span>}
            />
            {markID === 'homedetail' ? <Meta
                title={<span style={{fontSize:'13px',color:'gray'}}>拥有者</span>}
                description={<span style={{ fontSize: '18px', color: 'black' }}>{details.ownerName} / <span style={{ color: '#0070ef', fontSize: '14px' }}>{details.ownerAddress}</span></span>}
                style={{marginTop:'8px'}}
            />:null}
            <Meta
                title={<span style={{fontSize:'13px',color:'gray'}}>图片TokenId</span>}
                description={<span style={{ color: '#0070ef', fontSize: '14px' }}>{details.tokenId}</span>}
                style={{marginTop:'8px'}}
            />
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
        const {details:{tokenId}}=this.props
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
        const {details:{id}} = this.props
        const {pass} = this.refs
        let password = pass.input.value;
        this.setState({confirmLoading:true})
        await activityModel.getNFT(id, password)
        this.setState({open:false})
        this.setState({confirmLoading:false})
    }
    showModal = () => {
        this.setState({open:true});
    };
    handleCancel = () => {
        this.setState({open:false});
    };
    componentDidMount() {
        this.setState({details:this.props.details})
    }
    render() {
        const { loading, details,markID } = this.props
        return (
            <>
                {loading?<Loading/>:<>
                <div style={{ width: '1180px', position: 'relative', left: '50%', transform: 'translate(-50%)' }}>
                    <Layout >
                        <Sider style={{ borderRadius: '15px'}} width= '500px'>
                        <img src={details.url} alt="" style={{ width: '500px',  borderRadius: '15px' }} />
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
                    {markID === 'activitydetail' ?
                        <>
                            <h3 style={{marginTop:'60px',fontSize:'25px',fontWeight:'600'}}>nft名字</h3>
                            <p style={{ color: '#959599', fontSize: '15px' }}>{details.nftName}</p>
                        </>:null
                    }
                    <h3 style={{ marginTop: '60px', fontSize: '25px', fontWeight: '600' }}>
                        {markID === 'activitydetail' ?'nft描述':'商品描述'}
                    </h3>
                    <p style={{ color: '#959599',fontSize:'15px'}}>{details.nftDes}</p>
                    <Button style={{float:'right',marginTop:'20px'}}type="dashed" onClick={this.back}>返回</Button>
                </div>
                </>}
                {this.returnModal()}
            </>
        )
    }
}

export default connect(
    state => ({alldata:state.data,loading:state.loading}),
    {
        updatedata:Setdata
    }
)(Detail)