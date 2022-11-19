import React, { Component,lazy } from 'react'
import PubSub from 'pubsub-js';
import { Segmented } from 'antd';
import {BarsOutlined,AppstoreOutlined} from '@ant-design/icons'
import Content from '@/public/Content';
import { Setdata } from '@/redux/actions/data'
const PubTable=lazy(()=>import ('@/public/PubTable'))
import { markID } from '@/utils/globalType';
import Firstsearch from '@/components/Firstsearch'
import { connect } from 'react-redux';


class Search extends Component {
    state = { first: true, value: '',show:'show' }
    showchange = (value) => {
        this.setState({show:value})
    }
    componentDidMount() {
        const { alldata } = this.props
        alldata.nftsearch!==undefined?this.setState({first:false}):null
        PubSub.subscribe("first", (msg, data) => {
            this.setState({first:data})
        })
        PubSub.subscribe("value", (msg, value) => {
            this.setState({value})
        })
    }
    
    render() {
        return (
            this.state.first ? <Firstsearch /> :
            <>
                <div style={{height:'40px'}}>
                    <Segmented
                    options={[
                        {
                            label: '展示',
                            value: 'show',
                            icon: <AppstoreOutlined />,
                        },
                        {
                            label: '列表',
                            value: 'list',
                            icon: <BarsOutlined />,
                        }
                    ]}
                    style={{ float: 'right' }}
                    onChange={this.showchange}
                    />
                </div>
                {this.state.show === 'show' ? <Content markID={markID.nftsearch} value={this.state.value} /> :
                <PubTable markID={markID.nftsearch} issearch={false} value={this.state.value}/>}
            </>
        )
    }
}


export default connect(
    state => ({alldata:state.data}),
    {
        updatedata:Setdata
    }
)(Search)