import React, { Component } from 'react'
import { message, Button,Descriptions  } from 'antd'
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import '../Home/index.css'

export default class PersonMessage extends Component{
  previous=()=>{
    var page = document.getElementById("page").innerText;
  if(document.getElementById("page").innerText > 1){
    document.getElementById("page").innerText--;
    pageModel.showMyNFT();
    pageModel.getMaxPersonalPage().then(res=>{
    var maxPage = (res % 4 == 0)?(res / 4):(Math.ceil(res / 4));   
    if(new Number(page) == maxPage){
      for(let i = 0;i < 4;i++){
        var nftShow = document.getElementById("nft"+i);
          nftShow.style.display="block";
      } 
    }
  });
  }else {
    message.info("已经是第一页了",.5)
  }
  }
  give = () => nftModel.give()
  state = { data: [123],person:[] }
  getdata = async () => {
    const person = await pageModel.showMe();
    this.setState({person})
    pageModel.showMyNFT().then(res => {
      setTimeout(()=>{this.setState({ data: res })},100)
    })
  }
  componentDidMount() {
    this.getdata();
  }
  render(){
    return <div>
      <Descriptions title="用户信息" >
        <Descriptions.Item label="用户名">{this.state.person[0]}</Descriptions.Item>
        <Descriptions.Item label="用户链上id">{this.state.person[1]}</Descriptions.Item>
        <Descriptions.Item label="余额">{this.state.person[2]}</Descriptions.Item>
      </Descriptions>
      <h1>我拥有的nft:</h1>
      {
          this.state.data[0] == 123 ? <Loading /> : this.state.data.length == 0 ? <Nodata /> : <>
              <div className="showout">
              <div className="showin">
                {
                this.state.data.map(item => {
                    // console.log(item);
                    const { url,tokenId,nftName,nftDes,authorAddress,authorName,activityId,status,price } = item;
                  return (
                    <Link to={`/GDUT-nft/message/detail`} state={{ url,tokenId,nftName,nftDes,authorAddress,authorName,activityId,status,price }} key={nanoid()}>
                      <div className="item" >  
                        <div style={{overflow:'hidden'}}>
                          <img style={{ width: '100%', height: '220px' }} src={item.url}/>
                          <h3 style={{ textAlign: 'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{nftName}</h3>
                          <h3 style={{ textAlign: 'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{nftDes}</h3>
                        </div>
                      </div>
                    </Link>)
                  })
                }
                </div>
              </div>
              </>
        }
  </div>
  }
}