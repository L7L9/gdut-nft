import React from 'react';
import { useLocation } from 'react-router-dom'
import Detail from '@/public/Detail';
import { markID } from '@/utils/globalType';

const Mydetail = () => {
    const { state: details } = useLocation()
    return (
        <Detail details={details} markID={markID.messagedetail}/>
    )
}
    
export default Mydetail;