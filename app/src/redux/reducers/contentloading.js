import  {CONTENTLOADING} from '../constant'


//reducer本质就是一个函数
const initstate = true;
export default function loadingreducer(pre = initstate, action) {
    const {type,data} = action;
    switch (type) {
        case CONTENTLOADING:
            return data;
        default: return pre;
    }
}