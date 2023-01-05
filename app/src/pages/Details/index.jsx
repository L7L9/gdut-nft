import React from 'react';
import Detail from '@/public/Detail';
import { markID } from '@/utils/globalType';
import { useLocation } from 'react-router-dom'


const Details = (props) => {

    const { state: details } = useLocation()
    let markid = details.markID === markID.allnft ? markID.homedetail :
    details.markID === markID.activity ? markID.activitydetail :
    details.markID === markID.nftsearch ? markID.nftsearch : ''
    markid = markid === '' && props.hasOwnProperty('type') ?
    (props.type === 'message' ?markID.messagedetail:markID.myselldetail):markid
    return (
        <Detail details={details} markID={markid} />
    )
}
    
export default Details;