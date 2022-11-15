import React, { Component } from 'react'
import { nanoid } from 'nanoid'
import { Button,Modal,Input } from 'antd';
import { Link } from 'react-router-dom';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import {Setdata} from '@/redux/actions/data'
import { connect } from 'react-redux';
import './index.css'

class Content extends Component {
    state = { data: [], isloading: true,isModalOpen:false,id:'' }
    
    showallnft = () => {
        const { markID, alldata, updatedata, value } = this.props
        console.log(value);
        this.setState({ isloading: true })
        pageModel.showAllNFT().then(res => {
            updatedata({ ...alldata, [markID]: res });
            this.setState({ data: res })
            this.setState({ isloading: false })
        })
    }
    showmynft = () => {
        const { markID, alldata, updatedata } = this.props
        this.setState({ isloading: true })
        pageModel.showMyNFT().then(res => {
            updatedata({ ...alldata, [markID]: res })
            this.setState({ data: res })
            this.setState({ isloading: false })
        })
    }
    showactivity = () => {
        const { markID, alldata, updatedata } = this.props
        this.setState({ isloading: true })
        pageModel.showAllActivities().then(res => {
            updatedata({ ...alldata, [markID]: res });
            this.setState({ data: res })
            this.setState({ isloading: false })
        })
    }
    activitysearch = () => {
        const { alldata, updatedata,value } = this.props
        this.setState({ isloading: true })
        activityModel.search(value).then(res => {
            updatedata({ ...alldata, activitysearch: res });
            this.setState({ data:res })
            this.setState({ isloading: false })
        })
        
    }
    nftsearch = () => {
        const { alldata, updatedata,value } = this.props
        this.setState({ isloading: true })
        nftModel.search(value).then(res => {
            updatedata({ ...alldata, nftsearch: res });
            this.setState({ data:res })
            this.setState({ isloading: false })
        })
    }
    returnpath = () => {
        const { markID } = this.props
        const key = markID === 'allnft' ? 'home' :
        markID === 'mynft' ? 'message' :
        markID === 'activity' ? 'activity' : 
        markID === 'nftsearch' ? 'search' : null
        return `/GDUT-nft/${key}/detail`
    }
    returnheight = () => {
        const { markID } = this.props
        return markID === 'activity'?`420px`:`380px`
    }
    showModal = (id) => {
        return () => {
            this.setState({ isModalOpen: true,id})
        }
    };
    handleOk = () => {
        const { id } = this.state
        const { pass: { input} } = this.refs
        let password = input.value;
        activityModel.getNFT(id, password)
        this.setState({ isModalOpen: false })
    };
    handleCancel = () => this.setState({isModalOpen:false});
    componentDidMount() {
        const { markID } = this.props
        markID === 'allnft' ? this.showallnft() :
        markID === 'mynft' ? this.showmynft() : 
        markID === 'activity' ? this.showactivity() : 
        markID === 'nftsearch' ? this.nftsearch():null
    }
    getSnapshotBeforeUpdate(preprops,prestate) {
        const { value } = this.props
        return preprops.value == value ? false : true
    }
    componentDidUpdate(prevProps,prevState,snapshot) {
        if (snapshot) {
            const { markID, value } = this.props
            markID === 'nftsearch' ? this.nftsearch():
            markID === 'allnft' ? this.showallnft() :
            markID === 'mynft' ? this.showmynft() : 
            markID === 'activity'&&value.trim()!=='' ? this.activitysearch() : this.showactivity()
        }
    }
    render() {
        const {markID}=this.props
        return (
                this.state.isloading ? <Loading /> : this.state.data.length == 0 ? <Nodata /> : <>
                <div className="showout">
                    <div className="showin">
                {
                    this.state.data.map(item => {
                        return (
                            <div className="item" key={nanoid()} style={{height:this.returnheight()}}>  
                            <Link to={this.returnpath()} state={{ ...item }} >
                                <div className='imgbox'>
                                <img src={item.url} />
                                </div>
                                <div className='des'>
                                <h3 >{item.hasOwnProperty('nftName')?item.nftName:item.name}</h3>
                                <h3>{item.hasOwnProperty('nftDes')?item.nftDes:item.hostName}</h3>
                                </div>
                            </Link>
                            <div style={{textAlign:'center'}}>
                                {markID=='activity'?<Button type="dashed" onClick={this.showModal(item.id)}>领取NFT</Button>:null}    
                            </div>    
                        </div>
                    )
                    })
                }
                {markID=='activity'?<Modal title="密钥输入框" open={this.state.isModalOpen} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Input
                    placeholder="请输入密钥"
                        ref='pass'
                        allowClear={true}
                    />
                </Modal>:null}
                </div>
            </div>
            </>
        )
    }
}


export default connect(
    state => ({alldata:state.data}),
    {
        updatedata:Setdata
    }
)(Content)