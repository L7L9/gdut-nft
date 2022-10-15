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
  getdata1 = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{url:'',name:123,des:456},{url:'',name:12,des:45},{url:'',name:13,des:46},{url:'',name:23,des:56},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},{url:'',name:123,des:456},])
      },2000)
    })
  }
  getdata2 = async () => {
    const alldata = await this.getdata1();
    this.setState({data:alldata})
  }
  state={data:[123]}
  componentDidMount () {
    pageModel.showAllNFT();
    this.getdata2();
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
              <img id="num0" style={{ width: '100%', height: '220px' }} />
              <h3 id="name0" style={{textAlign:'center'}}></h3>
              <span id="tokenId0" style={{display:'none'}}></span>
              <span id="author0" style={{ display: 'none' }}></span>
              <h3 id="description0" style={{textAlign:'center'}}></h3>
              <span  style={{marginLeft:'100px'}}></span>
              <span id="activityNFTAmount0"  style={{display:'none'}}></span>
            </div>
          </div>
          <div className="item">
            <div style={{overflow:'hidden'}}>
              <div id="nft1" style={{float:'left',marginLeft:'80px'}} />
              <img id="num1"  style={{ width: '100%', height: '220px' }} />
              <h3 id="name1" style={{textAlign:'center'}}></h3>
              <span id="tokenId1" style={{display:'none'}}></span>
              <span id="author1" style={{ display: 'none' }}></span>
              <h3 id="description1" style={{textAlign:'center'}}></h3>
              <span id="activityNFTAmount1" hidden style={{display:'none'}}></span>
            </div>
          </div>
          <div className="item">
            <div style={{overflow:'hidden'}}>
              <div id="nft2" style={{float:'left',marginLeft:'80px'}} />
              <img id="num2"  style={{ width: '100%', height: '220px' }} />
              <h3 id="name2" style={{textAlign:'center'}}></h3>
              <span id="tokenId2" style={{display:'none'}}></span>
              <span id="author2" style={{ display: 'none' }}></span>
              <h3 id="description2" style={{ textAlign:'center'}}></h3>
              <span id="activityNFTAmount2" hidden style={{display:'none'}}></span>
            </div>
          </div>
          <div className="item">
            <div style={{overflow:'hidden'}}>
              <div id="nft3" style={{float:'left',marginLeft:'80px'}} />
              <img id="num3"  style={{ width: '100%', height: '220px' }} />
              <h3 id="name3" style={{textAlign:'center'}}></h3>
              <span id="tokenId3" style={{ display: 'none' }}></span>
              <span id="author3" style={{ display: 'none' }}></span>
              <h3 id="description3" style={{textAlign:'center'}}></h3>
              <span id="activityNFTAmount3" hidden style={{ display: 'none' }}></span>
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
        <Divider />
        <h1 style={{ fontSize: '25px' }}>当前链上nft:</h1>
        {
          this.state.data[0] == 123 ? <Loading /> : this.state.data.length == 0 ? <Nodata />:<>
              <div className="showout">
              <div className="showin">
                {
                  this.state.data.map(item => {
                  return <Link to={`/GDUT-nft/detail`} state={{name:item.name,des:item.des}} key={nanoid()}>
                      <div className="item" >  
                      <div style={{overflow:'hidden'}}>
                          <img style={{ width: '100%', height: '220px' }} url={item.url}/>
                          <h3 style={{ textAlign: 'center' }}>{item.name}</h3>
                          <h3 style={{ textAlign: 'center' }}>{item.des}</h3>
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