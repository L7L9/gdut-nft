import React from 'react';
import { Link } from "react-router-dom";
import SearchInput from '../components/Searchinput';
import { AppstoreOutlined, MailOutlined,HighlightOutlined,BulbOutlined,UserOutlined } from '@ant-design/icons';



export const items = [
    {
        key:'首页',
        label: <Link to="/GDUT-nft/home" >首页</Link>,
        icon:<AppstoreOutlined/>
    },
    {
        key:'标题',
        label: <h2>GDUT-NFT</h2>,
        disabled:true
    },
    {
        key:'搜索',
        label: <Link to="/GDUT-nft/search" ><SearchInput/></Link>
    },
    {
        key:'活动',
        label: <Link to="/GDUT-nft/activity" >活动</Link>,
        icon:<MailOutlined/>
    },
    {
        key:'铸造我的nft',
        label: <Link to="/GDUT-nft/mynft" >铸造我的nft</Link>,
        icon:<HighlightOutlined />
    },
    {
        key:'公告',
        label: <Link to="/GDUT-nft/notify" >公告</Link>,
        icon:<BulbOutlined />
    },
    {
        key: '个人信息',
        label: <Link to="/GDUT-nft/message" >个人信息</Link>,
        icon:<UserOutlined />
    }
]