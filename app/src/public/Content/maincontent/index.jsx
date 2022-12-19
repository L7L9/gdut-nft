import React, { Component } from 'react'
import { nanoid } from 'nanoid'
import { Button,Modal,Input, message } from 'antd';
import { Link } from 'react-router-dom';
import Search from '../Search';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import {Setdata} from '@/redux/actions/data'
import { Refresh } from '@/redux/actions/refresh'
import { Contentloading } from '@/redux/actions/contentloading'
import { connect } from 'react-redux';
import './index.css'

class Content extends Component {
    state = { data: [], isloading: true,isModalOpen:false,id:'' }
    
    showallnft = () => {
        const { markID, alldata, updatedata, value,changerefresh,refresh,changeloading } = this.props
        changeloading(true)
        pageModel.showSellNFT().then(res => {
            updatedata({ ...alldata, [markID]: res, currentdata: res });
            this.setState({ data: res })
            changeloading(false)
            changerefresh({ ...refresh, home: false })
        })
    }
    showmynft = () => {
        const { markID, alldata, updatedata,changerefresh,refresh,changeloading } = this.props
        changeloading(true)
        pageModel.showMyNFT().then(res => {
            updatedata({ ...alldata, [markID]: res,currentdata:res })
            this.setState({ data: res })
            changeloading(false)
            changerefresh({...refresh,message:false})
        })
    }
    showactivity = () => {
        const { markID, alldata, updatedata,changerefresh,refresh,changeloading } = this.props
        changeloading(true)
        pageModel.showAllActivities().then(res => {
            updatedata({ ...alldata, [markID]: res,currentdata:res });
            this.setState({ data: res })
            changeloading(false)
            changerefresh({...refresh,activity:false})
        })
    }
    activitysearch = () => {
        const { alldata, updatedata,value,changeloading } = this.props
        changeloading(true)
        activityModel.search(value).then(res => {
            updatedata({ ...alldata, activitysearch: res,currentdata:res });
            this.setState({ data:res })
            changeloading(false)
        })
        
    }
    nftsearch = () => {
        const { alldata, updatedata, value, changeloading } = this.props
        console.log('search');
        changeloading(true)
        nftModel.search(value.name).then(res => {
            updatedata({ ...alldata, nftsearch: res,currentdata:res });
            this.setState({ data:res })
            changeloading(false)
        })
    }
    returnpath = () => {
        const { markID } = this.props
        const key = markID === 'allnft' ? 'news' :
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
    handleOk = async () => {
        const { changerefresh,refresh } = this.props
        const { id } = this.state
        const { pass: { input} } = this.refs
        let password = input.value;
        message.loading('正在领取,1')
        await activityModel.getNFT(id, password)
        this.setState({ isModalOpen: false })
        changerefresh({ ...refresh, message: true })
    };
    handleCancel = () => this.setState({ isModalOpen: false });
    componentDidMount() {
        const { markID,alldata, changeloading, updatedata } = this.props
        let timer
        markID === 'allnft' ?
            (this.props.refresh.home ? this.showallnft() :
                (
                    timer = setInterval(() => {
                        const { contentloading } = this.props
                        if (!contentloading) {
                            const {alldata}=this.props
                            const contentsearch = sessionStorage.getItem('contentsearch')==='false'?false:true
                            contentsearch ? this.setState({ data: alldata.currentdata }) :
                            (this.setState({ data: alldata[markID] }), updatedata({ ...alldata, currentdata: alldata[markID] }))
                            clearInterval(timer)
                        }
                    },50)
                
                ))
        :
        markID === 'mynft' ?
                (this.props.refresh.message ? this.showmynft() :
                    (
                        timer = setInterval(() => {
                            const { contentloading } = this.props
                            if (!contentloading) {
                                const {alldata}=this.props
                                const contentsearch = sessionStorage.getItem('contentsearch')==='false'?false:true
                                contentsearch ? this.setState({ data: alldata.currentdata }) :
                                (this.setState({ data: alldata[markID] }), updatedata({ ...alldata, currentdata: alldata[markID] }))
                                clearInterval(timer)
                            }
                        },50)
                        
                    ))
        :
        markID === 'activity' ?
                (this.props.refresh.activity ? this.showactivity() :
                    (
                        timer = setInterval(() => {
                            const { contentloading } = this.props
                            if (!contentloading) {
                                const {alldata}=this.props
                                const contentsearch = sessionStorage.getItem('contentsearch')==='false'?false:true
                                contentsearch ? this.setState({ data: alldata.currentdata }) :
                                (this.setState({ data: alldata[markID] }), updatedata({ ...alldata, currentdata: alldata[markID] }))
                                clearInterval(timer)
                            }
                        },50)
                    ))
        :           
        markID === 'nftsearch' ?(alldata[markID] === undefined ? this.nftsearch() :
        (this.setState({ data: alldata[markID] }), changeloading(false), updatedata({ ...alldata, currentdata: alldata[markID] }))) : null
    }
    getSnapshotBeforeUpdate(preprops,prestate) {
        const { value,markID } = this.props
        return (JSON.stringify(preprops.value) == JSON.stringify(value) && preprops.markID === markID) ? false : true
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { markID, value, alldata,changeloading,updatedata } = this.props
        if (snapshot) {
            // markID === 'nftsearch'?this.nftsearch():
            // markID === 'allnft' ? this.showallnft() :
            // markID === 'mynft' ? this.showmynft() : 
            // markID === 'activity' && value.trim() !== '' ? this.activitysearch() : this.showactivity()
            updatedata({ ...alldata, currentdata:undefined});
            if (markID === 'activity') {
                changeloading(true)
                let { name, author } = value
                name=name===undefined?'':name
                author=author===undefined?'':author
                if (name.trim() === '' && author.trim() === '') {
                    updatedata({ ...alldata, currentdata:alldata[markID] })
                    this.setState({ data:alldata[markID]  })
                    setTimeout(() => { changeloading(false) }, 200)
                    sessionStorage.setItem('searchdetails', JSON.stringify(alldata[markID]));
                
                } else if (name.trim() === ''&&author.trim() !== '') {
                    activityModel.searchByHost(author).then(res => {
                        updatedata({ ...alldata, currentdata:res })
                        changeloading(false)
                        this.setState({ data: res })
                        sessionStorage.setItem('searchdetails', JSON.stringify(res));
                    })
                
                } else if (name.trim() !== '' && author.trim() === '') {
                    activityModel.search(name).then(res => {
                        updatedata({ ...alldata, currentdata:res })
                        changeloading(false)
                        this.setState({ data: res })
                        sessionStorage.setItem('searchdetails', JSON.stringify(res));
                    }) 
                }else {
                    activityModel.selectByHost(name, author).then(res => {
                        updatedata({ ...alldata, currentdata:res })
                        changeloading(false)
                        this.setState({ data: res })
                        sessionStorage.setItem('searchdetails', JSON.stringify(res));
                    }) 
                }
            }
            else {
                for (const key in value) {
                    if(value[key]===undefined)value[key]=null
                }
                if (value.highprice!==null&&value.lowprice!==null&&value.highprice <= value.lowprice) message.error('请选择好价格范围')
                else {
                    changeloading(true)
                    let { name, author, lowprice, highprice } = value
                    if (markID === 'nftsearch') {
                        nftModel.search(name).then(res => {
                            updatedata({ ...alldata, currentdata: res, [markID]: res });
                            this.setState({ data: res })
                            changeloading(false)
                        })
                    } else {
                        nftModel.selectSell(name, author, lowprice, highprice).then((res) => {
                            updatedata({ ...alldata, currentdata: res, });
                            this.setState({ data: res })
                            changeloading(false)
                        })
                    }
                    
                }
            }
        }
        
    }
    render() {
        const {markID,contentloading}=this.props
        return (
            contentloading ? <Loading /> : this.state.data.length == 0 ? <Nodata /> : <>
                <div className="showout">
                    <div className="showin">
                {
                    this.state.data.map((item,index) => {
                        return (
                            <div className="item" key={nanoid()} style={{height:this.returnheight()}}>  
                            <Link to={this.returnpath()} state={{ ...item,index }} >
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
    state => ({alldata:state.data,refresh:state.refresh,contentloading:state.contentloading}),
    {
        updatedata: Setdata,
        changerefresh: Refresh,
        changeloading:Contentloading
    }
)(Content)