import React, { Component } from 'react'
import { Table, Button, Image,Tag,Space,Modal,Input } from 'antd';
import {
    ClearOutlined,
    FireOutlined
} from '@ant-design/icons';
import { Setdata } from '@/redux/actions/data'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import './index.css'


class PubTable extends Component {
    state = { data: [], loading: true, isModalOpen: false,id:'',value:'' }
    handleOk = () => {
        const { id } = this.state
        const { pass: { input} } = this.refs
        let password = input.value;
        activityModel.getNFT(id, password)
        this.setState({ isModalOpen: false })
    };
    handleCancel = () => this.setState({isModalOpen:false});
    returnpath = () => {
        const { markID } = this.props
        const key = markID === 'allnft' ? 'home' :
        markID === 'mynft' ? 'message' :
        markID === 'activity' ? 'activity' : 
        markID === 'nftsearch' ? 'search' : null
        return `/GDUT-nft/${key}/detail`
    }
    returnColumns = () => {
        const { markID } = this.props
        const nftextra = [
            {
                title: '预览',
                dataIndex: 'preview',
                align: 'center',
                fixed: 'left',
                render: (value) => <Image width={40} src={value} />,
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                align:'center'
            },
            {
                title: '链上标识',
                dataIndex: 'number',
                align: 'center',
                width: '50%',
                render:(value)=><span style={{color:'rgb(0, 112, 239)'}}>{value}</span>
            },
            {
                title: '作者',
                dataIndex: 'author',
                align: 'center',
            },
            {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            render: (value) =>
                <Tag icon={value?<FireOutlined />:<ClearOutlined />} color={value?'success':'error'}>
                    {value?'售卖中':'非卖品'}
                </Tag>
            },
            {
            title: '价格',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            align: 'center',
            render: value => <span>￥{value}</span>
            },
            {
                title: '详情',
                dataIndex: 'detail',
                align: 'center',
                key: 'x',
                fixed:'right',
                render: (value) => <Link to={this.returnpath()} state={{...value[0],index:value[1]}}><Button type='primary'>查看详情</Button></Link>,
            }
        ]
        const activityextra = [
            {
                title: '预览',
                dataIndex: 'preview',
                align: 'center',
                fixed: 'left',
                render: (value) => <Image width={40} src={value} />,
            },
            {
                title: '活动名称',
                dataIndex: 'name',
                align:'center'
            },
            {
                title: '举办者链id',
                dataIndex: 'number',
                align: 'center',
                width: '40%',
                render:(value)=><span style={{color:'rgb(0, 112, 239)'}}>{value}</span>
            },
            {
                title: '举办者',
                dataIndex: 'author',
                align: 'center',
            },
            {
            title: '发行数量',
            dataIndex: 'amount',
            align: 'center'
            },
            {
            title: '剩余数量',
            dataIndex: 'remain',
            sorter: (a, b) => a.remain - b.remain,
            align: 'center',
            },
            {
                title: '详情',
                dataIndex: 'detail',
                align: 'center',
                key: 'x',
                fixed:'right',
                render: (value) => <>
                    <Space>
                        <Button type='primary' onClick={()=>{this.setState({ isModalOpen: true,id:value[0].id})}}>领取nft</Button>
                        <Link to={this.returnpath()} state={{...value[0],index:value[1]}}><Button type='primary'>查看详情</Button></Link>
                    </Space>
                    
                </>,
            }
        ]
        return markID !=='activity' ? nftextra : activityextra
    }
    handledata = (data) => {
        const { markID } = this.props;
        let datasource = [];
        markID!=='activity'?data.map((item, index) => {
            datasource.push({
                preview: item.url,
                name: item.nftName,
                number: item.tokenId,
                status:item.status,
                price: item.price,
                author:item.authorName,
                detail:[item,index],
                key:index
            })
        }):data.map((item, index) => {
            datasource.push({
                preview: item.url,
                name: item.name,
                number: item.hostAddress,
                author:item.hostName,
                amount:item.amount,
                remain: item.nftRest,
                detail:[item,index],
                key:index
            })
        })
        return datasource;
    }
    returnData = () => {
        const { alldata, markID, refresh } = this.props;
        const isrefresh = markID === 'allnft' ? refresh.home :
        markID === 'mynft' ? refresh.message :
        markID === 'activity' ? refresh.activity :false
        if (alldata[markID] !== undefined && !isrefresh) {
            const data=alldata[markID]
            let datasource = this.handledata(data);
            this.setState({loading:false})
            this.setState({ data: datasource })
            return true;
        }
        return false;
    }
    componentDidMount() {
        let timer=setInterval(() => {
            if(this.returnData())clearInterval(timer)
        }, 50)
    }
    componentDidUpdate(preprops) {
        const { name, author, alldata, markID, value,updatedata } = this.props
        if (preprops.name !== name || preprops.author !== author || preprops.value !== value) {
            sessionStorage.setItem('search', JSON.stringify(true));
            if (name.trim() === '' && author.trim() === '') {
                if (markID === 'nftsearch') {
                    this.setState({ loading: true })
                    nftModel.search(value).then((res) => {
                        let datasource = this.handledata(res)
                        this.setState({loading:false})
                        this.setState({ data: datasource })
                        updatedata({ ...alldata, [markID]: res })
                        sessionStorage.setItem('searchdetails', JSON.stringify(res));
                    })
                }
                else {
                    this.setState({ loading: true })
                    let datasource = this.handledata(alldata[markID])
                    this.setState({ data:datasource  })
                    setTimeout(() => { this.setState({ loading: false }) }, 200)
                    sessionStorage.setItem('searchdetails', JSON.stringify(alldata[markID]));
                }
                
            } else if (name.trim() === ''&&author.trim() !== '') {
                this.setState({loading:true})
                markID !== 'activity' ?
                nftModel.searchByAuthor(author).then((res) => {
                    let datasource = this.handledata(res)
                    this.setState({loading:false})
                    this.setState({ data: datasource })
                    sessionStorage.setItem('searchdetails', JSON.stringify(res));
                }) : activityModel.searchByHost(author).then(res => {
                    let datasource = this.handledata(res)
                    this.setState({loading:false})
                    this.setState({ data: datasource })
                    sessionStorage.setItem('searchdetails', JSON.stringify(res));
                })
                
            } else if (name.trim() !== '' && author.trim() === '') {
                this.setState({loading:true})
                markID !== 'activity' ?
                nftModel.search(name).then((res) => {
                    let datasource = this.handledata(res)
                    this.setState({loading:false})
                    this.setState({ data: datasource })
                    sessionStorage.setItem('searchdetails', JSON.stringify(res));
                }):activityModel.search(name).then(res => {
                    let datasource = this.handledata(res)
                    this.setState({loading:false})
                    this.setState({ data: datasource })
                    sessionStorage.setItem('searchdetails', JSON.stringify(res));
                })
            }
            else {
                this.setState({loading:true})
                markID!=='activity'?nftModel.selectByAuthor(name,author).then((res) => {
                    let datasource = this.handledata(res)
                    this.setState({loading:false})
                    this.setState({ data: datasource })
                    sessionStorage.setItem('searchdetails', JSON.stringify(res));
                }) : activityModel.selectByHost(name, author).then(res => {
                    let datasource = this.handledata(res)
                    this.setState({loading:false})
                    this.setState({ data: datasource })
                    sessionStorage.setItem('searchdetails', JSON.stringify(res));
                })
            }
        }
    }
    render() {
        const {markID}=this.props
        return (
            <>
                <Table
                columns={this.returnColumns()}
                dataSource={this.state.data}
                loading={this.state.loading}
                pagination={{
                    position:['bottomCenter'],
                }}
                /> 
                {markID=='activity'?<Modal title="密钥输入框" open={this.state.isModalOpen} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Input
                    placeholder="请输入密钥"
                        ref='pass'
                        allowClear={true}
                    />
                </Modal>:null}
            </>
    )
    }
}

export default connect(
    state => ({alldata:state.data,refresh:state.refresh}),
    {
        updatedata:Setdata
    }
)(PubTable)