import React, { Component } from 'react';
import {Button,Divider,message} from 'antd'
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import './index.css'




export default class Home extends Component {
  previous=()=>{
    var page = document.getElementById("page").innerText;
  if(document.getElementById("page").innerText > 1){
    var amount = null;
    document.getElementById("page").innerText--;
    for(let i = 0;i < 4;i++){
      amount = document.getElementById("activityNFTAmount"+i).innerText;
      pageModel.indexId -= new Number(amount);
      console.log(pageModel.indexId);
    }
    pageModel.indexId--;
    pageModel.showAllNFT();
    var amount = pageModel.getMaxHomePage().then(res=>{
    var maxPage = (res % 4 == 0)?(res / 4):(Math.ceil(res / 4));   
    if(new Number(page) == maxPage){
      for(let i = 0;i < 4;i++){
        var nftShow = document.getElementById("nft"+i);
          nftShow.style.display="block";
      } 
    }
  });
  } else {
    message.info('这是第一页!',1);
  }
  }
  next=()=>{
    var amount = pageModel.getMaxHomePage().then(res=>{
    var maxPage = (res % 4 == 0)?(res / 4):(Math.ceil(res / 4));   
    var page = document.getElementById("page").innerText;
    if(new Number(page)< maxPage){
      document.getElementById("page").innerText++;
      pageModel.showAllNFT();
    } else {
      message.info('这是最后一页',1);
    }
  });
  }
  state = { data: [123] }
  getdata2 = async () => {
    const alldata = await pageModel.showAllNFT();
    if (alldata.length == 0) {
      this.setState({ data: [] })
    }
    else this.setState({ data: alldata })

  }
  
  componentDidMount () {
    this.getdata2();
  }
  render() {
    return (
      <>
        <h1 style={{ fontSize: '25px' }}>当前链上nft:</h1>
        {
          
          this.state.data[0] == 123 ? <Loading /> : this.state.data.length == 0 ? <Nodata /> : <>
              <div className="showout">
              <div className="showin">
                {
                  this.state.data.map(item => {
                    const { nftname: name, nftdes: des, url:src, author, nft, cid } = item;
                  return <Link to={`/GDUT-nft/home/detail`} state={{name,des,src,author,nft,cid}} key={nanoid()}>
                      <div className="item" >  
                      <div style={{overflow:'hidden'}}>
                          <img style={{ width: '100%', height: '220px' }} src={item.url}/>
                          <h3 style={{ textAlign: 'center' }}>{item.nftname}</h3>
                          <h3 style={{ textAlign: 'center' }}>{item.nftdes}</h3>
                      </div>
                      </div>
                    </Link>
                  })
                }
                </div>
              </div>
              </>
        }
      </>
    )
  }
}