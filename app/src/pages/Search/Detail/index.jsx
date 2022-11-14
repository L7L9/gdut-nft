import React from 'react';
import Detail from '@/public/Detail';
import { markID } from '@/utils/globalType';
import { useLocation } from 'react-router-dom'


const Searchdetail = () => {

    const {state:details} = useLocation()
    return (
        <Detail details={details} markID={markID.homedetail} />
    )
}
    
export default Searchdetail;