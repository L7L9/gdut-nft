import React, { Component } from 'react'
import PubSub from 'pubsub-js';
import { Input, message } from 'antd';
const { Search } = Input;      



class SearchInput extends Component{
    onSearch = async (value) => {
        PubSub.publish("serchloading",true)
        PubSub.publish("first",false)
        nftModel.search(value).then(res => {
            setTimeout(() => {
                PubSub.publish("searchcontent", res)
                PubSub.publish("serchloading",false)
            }, 1000)
        })
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