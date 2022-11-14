import React from 'react';
import Detail from '@/public/Detail';
import { markID } from '@/utils/globalType';
import { useLocation } from 'react-router-dom'

const Adetail = () => {
    const { state: details } = useLocation()
    return (
        <Detail details={details} markID={markID.activitydetail} />
    )
}
    
export default Adetail;