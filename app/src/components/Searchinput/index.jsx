import React, { Component } from 'react'
import { Input,message } from 'antd';
const { Search } = Input;      



class SearchInput extends Component{
    onSearch = (value) => {
        // console.log(event);
        nftModel.search(value)
        // else message.warn('请输入搜索内容',1)
    };
    render(){
        return (
            <>
                <Search
                placeholder="在此输入要查询的nft名字"
                allowClear
                onSearch={this.onSearch}
                style={{ width: 240, marginTop: '18px' }}
                // loading
                />
            </>
        )
    }
}
export default SearchInput