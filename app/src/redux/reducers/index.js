//该文件用于汇总所有reducer


//引入为loading服务的reducer
import loading from './loading'

import {combineReducers } from 'redux'


// 汇总所有reducer变为一个总的reducer
const allreducer=combineReducers({
    loading
})
export default allreducer