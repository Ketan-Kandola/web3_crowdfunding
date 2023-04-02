import React from 'react'
import { useNavigate } from 'react-router-dom';

//import {CampaignCard} from './CampaignCard';

const ListOfCampaigns = ({title, isLoading, campaigns}) => {
    //const navigate = useNavigate();
    /* const handleNavigate = (campaign) => {
        navigate(`/CampaignDetails/${campaign.title}`, {state: campaign})
    } */ 
    return (
        <div className="py-24">
            <h1 className="font-rubik font-regular sm:text-[61px] text-[48px] leading-[38px] text-[#0D0D0D]">
                {title}
                <h2 className="py-4 font-rubik font-regular sm:text-[20px] text-[20px] leading-[38px] text-[#A68A56]">
                    Showing all campaigns ({campaigns.length})
                </h2>
            </h1>

            <div className="flex flex-wrap mt-[18px] gap [8px]">
                {!isLoading && campaigns.length ===0 && (
                    <p className="font-rubik font-medium text-[14px] leading[24px] text-[#404040]">
                        There are currently no campaigns, please check back soon.  
                        
                    </p>
                )}
                {/* {!isLoading && campaigns.length === 0 && campaigns.map((campaign) => <CampaignCard
                    key={campaign.id}
                    {...campaign}
                    handleClick={() => handleNavigate(campaign)}
                />)} */}
            </div>
        </div>
    )
}

export default ListOfCampaigns