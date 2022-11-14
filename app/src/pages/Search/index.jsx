import React, { Component } from 'react'
import PubSub from 'pubsub-js';
import Content from '@/public/Content';
import { markID } from '@/utils/globalType';
import Firstsearch from '@/components/Firstsearch'


class Search extends Component {
    state={first:true,value:''}
    componentDidMount() {
        PubSub.subscribe("first", (msg, data) => {
            this.setState({first:data})
        })
        PubSub.subscribe("value", (msg, value) => {
            this.setState({value})
        })
    }
    render() {
        return (
            this.state.first? <Firstsearch /> :
            <Content markID={markID.nftsearch} value={this.state.value} />
        )
    }
}


export default Search