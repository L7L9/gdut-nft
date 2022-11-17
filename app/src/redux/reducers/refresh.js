import  {REFRESH} from '../constant'


//reducer本质就是一个函数
const initstate = {home:true,activity:true,message:true};
export default function loadingreducer(pre = initstate, action) {
    const {type,data} = action;
    switch (type) {
        case REFRESH:
            return {...data};
        default: return pre;
    }
}