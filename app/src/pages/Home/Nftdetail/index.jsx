import { List,Button } from 'antd';
import React from 'react';
import {  useLocation,useNavigate } from 'react-router-dom'
// const data = Array.from({
//     length: 1,
// }).map((_, i) => ({
//     title: `名字：${i} `,
//     url:i,
//     // avatar: 'https://joeschmoe.io/api/v1/random',
//     description:
//     '链上id: '+i+' '+' '+'作者: '+i+' '+' '+'拥有者: '+i ,
//     content:
//     'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
// }));
const Nftdetail = () => {
    const navigate = useNavigate();
    const back = () => {
        navigate(-1);
    }
    const {state:{name,des}} =useLocation()
    const data = [{
        title: name,
        url: '',
        content:des
    }]
    return (
        <>
        <List
        itemLayout="vertical"
        size="large"
        // pagination={{
        //     onChange: (page) => {
        //     console.log(page);
        //     },
        //     pageSize: 1,
        // }}
        dataSource={data}
        renderItem={(item) => (
        <List.Item
        style={{marginBottom:'20px',width:'800px',transform:'translate(-50%)',position:'relative',left:'50%',marginTop:'60px'}}
        key={item.title}
        extra={
            <img
            width={350}
            height={300}
            alt="nft"
            // src={item.url}
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
        }
        >
        <List.Item.Meta
            // avatar={<Avatar src={item.avatar} />}
            title={item.title}
            description={item.description}
        />
        {item.content}
        </List.Item>
        )}
            />
        <Button type="dashed" onClick={back} style={{float:'right'}}>返回</Button>
        </>)
}
    
export default Nftdetail;