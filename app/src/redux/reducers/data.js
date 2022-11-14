import  {ADD} from '../constant'


//reducer本质就是一个函数
const initstate = {};
export default function loadingreducer(pre = initstate, action) {
    const {type,data} = action;
    switch (type) {
        case ADD:
            return {...data};
        default: return pre;
    }
}