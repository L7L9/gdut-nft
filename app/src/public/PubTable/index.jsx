import React, { Component } from 'react'
import SearchForm from './SearchFrom'
import Table from './Table'

export default class PubTable extends Component {
    state = { issearch: false, author: '', name: '' }
    setsearchvalue = (name,author) => {
        this.setState({name,author})
    }
    componentDidMount() {
        const { issearch } = this.props
        this.setState({issearch})
    }
    render() {
        const {author,name}=this.state
        return (
            <>
                {/* {this.state.issearch ? <SearchForm {...this.props} setsearchvalue={this.setsearchvalue} /> : null} */}
                <Table {...this.props} author={author} name={name} />
            </>
        )
    }
}
