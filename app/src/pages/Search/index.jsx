import React, { Component } from 'react'
import PubSub from 'pubsub-js';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid'
import Loading from '@/components/Loading'
import Nodata from '@/components/Nodata'
import Firstsearch from '@/components/Firstsearch'
import '../Home/index.css'


class Search extends Component {
    state={data:[123],first:true,loading:false}
    componentDidMount() {
        PubSub.subscribe("searchcontent", (msg, data) => { 
            this.setState({ data })
        })
        PubSub.subscribe("serchloading", (msg, data) => {
            this.setState({loading:data})
        })
        PubSub.subscribe("first", (msg, data) => {
            this.setState({first:data})
        })
    }
    render() {
        return (
            this.state.first? <Firstsearch /> :
            this.state.loading ? <Loading /> :
            this.state.data.length == 0 ? <Nodata /> :
            <div className="showout">
                <div className="showin">
                {
                    this.state.data.map(item => {
                    const { nftname, des, url, author,number, cid,tokenId } = item;
                    return <Link to={`/GDUT-nft/search/detail`} state={{nftname, des, url, author,number, cid,tokenId}} key={nanoid()}>
                        <div className="item" >  
                        <div style={{overflow:'hidden'}}>
                            <img style={{ width: '100%', height: '220px' }} src={item.url}/>
                            <h3 style={{ textAlign: 'center' }}>{item.nftname}</h3>
                            <h3 style={{ textAlign: 'center' }}>{item.des}</h3>
                        </div>
                        </div>
                    </Link>
                    })
                }
                </div>
            </div>
        )
    }
}


export default Search