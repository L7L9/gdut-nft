import React, { Component } from 'react'


export default class Selectnft extends Component {
    preview = () => pageModel.preview()
    render() {
    return (
        <div>     
            <div style={{textAlign:'center',width:'600px'}}>
                <div style={{ marginRight: '150px' }}>
                <div><img id="nftShower" style={{ width: '150px', height: '150px',marginLeft:'-160px' }}/></div>
                <p style={{marginTop:'8px',marginLeft:'-160px'}}>上传一张图片，获得一份独一无二的nft</p>
                <input type="file" id="nft" onChange={this.preview} />
                </div>
            </div>
        </div>
    )
    }
}
