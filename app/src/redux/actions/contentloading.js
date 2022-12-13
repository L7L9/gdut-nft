import {CONTENTLOADING} from '../constant'


export const Contentloading = data => ({ type: CONTENTLOADING, data });

//异步action返回一个函数，且在函数中调用同步action
export const Contentloadingasync = (data, time) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(Contentloading(data))
        },time)
    }
}
