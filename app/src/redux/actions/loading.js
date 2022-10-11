import {LOADING} from '../constant'


export const loadingaction = data => ({ type: LOADING, data });

//异步action返回一个函数，且在函数中调用同步action
export const loadingactionasync = (data, time) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(loadingaction(data))
        },time)
    }
}
