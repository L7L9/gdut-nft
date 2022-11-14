import React, { Component } from 'react'
import PubSub, { publish } from 'pubsub-js';
import { Input, message } from 'antd';
const { Search } = Input;      



class SearchInput extends Component{
    onSearch = value => {
        PubSub.publish("first", false)
        PubSub.publish("value", value)
    };
    render(){
        return (
            <>
                <Search
                placeholder="在此输入要查询的nft名字"
                // allowClear
                onSearch={this.onSearch}
                style={{ width: 240, marginTop: '18px' }}
                // loading
                />
            </>
        )
    }
}

export default SearchInput