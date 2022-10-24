import React, { Component } from 'react'
import { message, Button } from 'antd'
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
  state = { data: [123] }
  getdata = async () => {
    pageModel.showMyNFT().then(res => {
      setTimeout(()=>{this.setState({ data: res })},100)
    })
  }
  componentDidMount() {
    this.getdata();
  }
  render(){
    return <div>
      <h1>我拥有的nft:</h1>
      {
          this.state.data[0] == 123 ? <Loading /> : this.state.data.length == 0 ? <Nodata /> : <>
              <div className="showout">
              <div className="showin">
                {
                this.state.data.map(item => {
                    // console.log(item);
                    const { url,tokenId,cid,nftname,author,des,number } = item;
                  return (
                    <Link to={`/GDUT-nft/message/detail`} state={{ url, tokenId, cid, nftname, author, des, number }} key={nanoid()}>
                      <div className="item" >  
                        <div style={{overflow:'hidden'}}>
                          <img style={{ width: '100%', height: '220px' }} src={item.url}/>
                          <h3 style={{ textAlign: 'center' }}>{item.nftname}</h3>
                          <h3 style={{ textAlign: 'center' }}>{item.des}</h3>
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