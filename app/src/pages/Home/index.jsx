import React, { Component } from 'react';
import {Button,message} from 'antd'
import Nft from './Nft'
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
  componentDidMount() {
    pageModel.showAllNFT();
  }
  render() {
    return (
      <>
      <h1 style={{ fontSize: '25px' }}>当前链上nft:</h1>
      <div className="showout">
        <div className="showin">
          <div className="item">
            <div style={{overflow:'hidden'}}>
              <div id="nft0" style={{float:'left',marginLeft:'80px'}} />
              <img id="num0"/>
              <span id="name0"></span><br/>
              <span id="tokenId0"></span><br/>
              <span id="author0"></span><br/>
              <span id="description0"></span>
              <span id="activityNFTAmount0" hidden></span>
            </div>
          </div>
          <div className="item">
            <div style={{overflow:'hidden'}}>
              <div id="nft1" style={{float:'left',marginLeft:'80px'}} />
              <img id="num1"/>
              <span id="name1"></span><br/>
              <span id="tokenId1"></span><br/>
              <span id="author1"></span><br/>
              <span id="description1"></span>
              <span id="activityNFTAmount1" hidden></span>
            </div>
          </div>
          <div className="item">
            <div style={{overflow:'hidden'}}>
              <div id="nft2" style={{float:'left',marginLeft:'80px'}} />
              <img id="num2"/>
              <span id="name2"></span><br/>
              <span id="tokenId2"></span><br/>
              <span id="author2"></span><br/>
              <span id="description2"></span>
              <span id="activityNFTAmount2" hidden></span>
            </div>
          </div>
          <div className="item">
            <div style={{overflow:'hidden'}}>
              <div id="nft3" style={{float:'left',marginLeft:'80px'}} />
              <img id="num3"/>
              <span id="name3"></span><br/>
              <span id="tokenId3"></span><br/>
              <span id="author3"></span><br/>
              <span id="description3"></span>
              <span id="activityNFTAmount3" hidden></span>
            </div>
          </div>
          {/* <div className="item"><Nft/></div>
          <div className="item"><Nft/></div>
          <div className="item"><Nft/></div> */}
        </div>
        <div style={{textAlign:'center' ,marginTop:'40px'}}>
          <Button type="dashed" onClick={this.previous} style={{marginRight:'10px'}}>上一页</Button>
          <Button type="dashed" onClick={this.next} style={{marginRight:'10px'}}>下一页</Button>
          第 <label id="page">1</label> 页
        </div>
      </div>
      </>
    )
  }
}
