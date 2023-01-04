import React from 'react';
import { useLocation } from 'react-router-dom'
import Detail from '@/public/Detail';
import { markID } from '@/utils/globalType';

const Mydetail = (props) => {
    const { state: details } = useLocation()
    return (
        props.type === 'message' ? <Detail details={details} markID={markID.messagedetail} /> : 
        <Detail details={details} markID={markID.myselldetail} />
    )
}
    
export default Mydetail;