import React, { Component } from 'react'
import { message, Button } from 'antd'
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';

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
  state={data:[123]}
  render(){
    return <div>
      <h1>我拥有的nft:</h1>
      {/* <div style={{overflow:'hidden'}}>
        <div id="nft0" style={{float:'left',marginLeft:'80px',marginBottom:'20px'}}>
      <img id="num0"/>
      <span id='name0'></span>
      <span id="id0"></span><br/>
      <span id="description0"></span>
        </div>
        <div id="nft1" style={{float:'left',marginLeft:'80px',marginBottom:'20px'}}>
      <img id="num1"/>
      <span id='name1'></span>
      <span id="id1"></span>
      <span id="description1"></span>
        </div>
        <div id="nft2" style={{float:'left',marginLeft:'80px',marginBottom:'20px'}}>
      <img id="num2"/>
      <span id='name2'></span>
      <span id="id2"></span>
      <span id="description2"></span>
        </div>
        <div id="nft3" style={{float:'left',marginLeft:'80px',marginBottom:'20px'}}>
        <img id="num3"/>
        <span id='name3'></span>
        <span id="id3"></span>
        <span id="description3"></span>
        </div>
      </div>
      <div style={{textAlign:'center' ,marginTop:'40px'}}>
        <Button type="dashed" onClick={this.previous} style={{marginRight:'10px'}}>上一页</Button>
        <Button type="dashed" onClick={this.give} style={{marginRight:'10px'}}>转赠</Button>
        第 <label id="page">1</label> 页
      </div> */}
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
  </div>
  }
}