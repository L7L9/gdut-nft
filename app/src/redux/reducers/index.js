//该文件用于汇总所有reducer


//引入为loading服务的reducer
import loading from './loading'
//引入为data服务的reducer
import data from './data'
//引入为refresh服务的reducer
import refresh from './refresh'
//引入为contentloading服务的reducer
import contentloading from './contentloading'

import {combineReducers } from 'redux'


// 汇总所有reducer变为一个总的reducer
const allreducer=combineReducers({
    loading,
    data,
    refresh,
    contentloading
})
export default allreducer