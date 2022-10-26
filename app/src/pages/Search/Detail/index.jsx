import { List,Button } from 'antd';
import React,{useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
//引入connect用于连接UI组件与redux
import { useSelector, useDispatch } from 'react-redux'
import {loadingaction} from '@/redux/actions/loading'
import Loading from '@/components/Loading'


const Searchdetail = () => {
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
    const { state: { nftname, des, url:src, author,number, cid,tokenId } } = useLocation()
    console.log(nftname, des, src, author,number, cid,tokenId);
    const data = [{
        title: nftname,
        src,
        description:'链上id: ?'+''+' '+' '+'作者: ?'+""+' '+' '+'拥有者: ?'+"",
        content:des
    }]
    return (
        <>
            {loading?<Loading />:<>
            <List
        itemLayout="vertical"
        size="large"
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
            />
        }
        >
        <List.Item.Meta
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
    
export default Searchdetail;