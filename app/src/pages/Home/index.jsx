import React, { Component } from 'react';
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import './index.css'




export default class Home extends Component {

  state = { data: [123] }
  getdata2 = async () => {
    pageModel.showAllNFT().then(res => {
      setTimeout(()=>{this.setState({ data: res })},100)
    })

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
                    const { nftName: name, nftDes: des, url:src, authorName, nft, cid,tokenId,authorAddress,ownerAddress,ownerName,activityId,status,price } = item;
                  return <Link to={`/GDUT-nft/home/detail`} state={{name,des,src,authorName,nft,cid,tokenId,authorAddress,ownerAddress,ownerName,activityId,status,price}} key={nanoid()}>
                      <div className="item" >  
                      <div style={{overflow:'hidden'}}>
                          <img style={{ width: '100%', height: '220px' }} src={item.url}/>
                          <h3 style={{ textAlign: 'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{name}</h3>
                          <h3 style={{ textAlign: 'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{des}</h3>
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