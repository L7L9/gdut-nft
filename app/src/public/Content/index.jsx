import React, { Component } from 'react'
import Search from './Search';
import MainContent from './maincontent';

export default class Content extends Component {
    state={issearch:true}
    setsearchvalue = (values) => {
        this.setState({...values})
    }
    componentDidMount() {
        const { issearch } = this.props
        if (issearch === undefined) this.setState({ issearch: true })
        else this.setState({ issearch })
    }
    render() {
        const { markID } = this.props
        return (
            <>
                {/* {this.state.issearch?<Search markID={markID} setsearchvalue={this.setsearchvalue}/>:null} */}
                <MainContent {...this.props}  />
            </>
        )
    }
}
