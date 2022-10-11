import React, { Component } from 'react'
import { Input } from 'antd';
const { Search } = Input;      



class SearchInput extends Component{
    onSearch = (value) => nftModel.search(value);
    render(){
        return (
            <>
                <Search
                placeholder="在此输入要查询的nft名字"
                allowClear
                onSearch={this.onSearch}
                style={{width: 240, marginTop:'18px' }}
                />
            </>
        )
    }
}
export default SearchInput