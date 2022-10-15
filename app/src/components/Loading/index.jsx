import { Spin } from 'antd';
import React, { Component } from 'react'
import {loadingactionasync} from '@/redux/actions/loading'
import './index.css'

import {connect} from 'react-redux'

class Loading extends Component {
    componentDidMount() {
        this.props.changeloding(false, 500);
    }
    render() {
    return (
        <div className="example">
            <Spin />
        </div>
    )
    }
}
export default connect(
    state => ({ loading: state.loading}),
    {
        changeloding:loadingactionasync
    }
)(Loading)
