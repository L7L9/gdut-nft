import React, { Component } from 'react'


export default class Selectfile extends Component {
    preview = () => pageModel.preview()
    render() {
    return (
        <div>     
            <div style={{textAlign:'center',width:'600px'}}>
                <div style={{ marginRight: '150px' }}>
                <div><img id="nftShower" style={{ width: '150px', height: '150px',marginLeft:'-300px' }}/></div>
                <p style={{marginTop:'8px',marginLeft:'-300px'}}>创建一个活动，用户可通过密码来领取此活动的nft</p>
                <input type="file" id="nft" onChange={this.preview} />
                </div>
            </div>
        </div>
    )
    }
}
