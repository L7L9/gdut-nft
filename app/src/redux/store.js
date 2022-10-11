//引入createStore英语创建store对象
import { legacy_createStore as createStore,applyMiddleware } from 'redux'

//用于引入redux-thunk,支持异步action
import thunk from 'redux-thunk'
// 引入redux-devtools-extension
import { composeWithDevTools } from 'redux-devtools-extension'

//引入汇总后的reducer
import allreducer from './reducers';



export default createStore(allreducer,composeWithDevTools(applyMiddleware(thunk)));