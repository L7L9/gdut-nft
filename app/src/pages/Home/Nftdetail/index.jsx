import { List,Button } from 'antd';
import React,{useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
//引入connect用于连接UI组件与redux
import { useSelector, useDispatch } from 'react-redux'
import {loadingaction} from '@/redux/actions/loading'
import Loading from '@/components/Loading'
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
    // 拿到location
    const location = useLocation();

    // 修改中央仓库数据
        const dispatch = useDispatch()
        
    // useEffect(effectFunc, []) 类似于 componentDidMount
    useEffect(() => {
        dispatch(loadingaction(true))
    }, [location]);
    const loading = useSelector(state => state.loading)
    
    const navigate = useNavigate();
    const back = () => {
        navigate(-1);
    }
    const { state: { name,des,src,authorName,nft,cid,tokenId,authorAddress,ownerAddress,ownerName,activityId,status,price } } = useLocation()
    console.log(name,des,src,authorName,nft,cid,tokenId,authorAddress,ownerAddress,ownerName,activityId,status,price);
    const data = [{
        title: name,
        src,
        description:'链上id: '+authorAddress+' '+' '+'作者: '+authorName+' '+' '+'拥有者: '+ownerName,
        content:des
    }]
    return (
        <>
            {loading?<Loading />:<>
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
            src={item.src}
            // src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
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
            </>}
        </>
    )
}
    
export default Nftdetail;