import React from 'react'
import { useNavigate } from 'react-router-dom';

import CampaignCard from './CampaignCard';

/**
 * Displays a list of campaigns.
 * @param {string} title - The title to be displayed at the top of the component.
 * @param {boolean} isLoading - A flag indicating whether campaigns are still loading.
 * @param {Array} campaigns - An array of campaign objects.
 * @returns {JSX.Element}
 */

const ListOfCampaigns = ({title, isLoading, campaigns}) => {
    const navigate = useNavigate();
    const handleNavigate = (campaign) => {
        navigate(`/campaignDetails/${campaign.title}`, {state: campaign})
    }
    return (
        <div className="py-24">
            <h1 className="font-rubik font-regular sm:text-[61px] text-[48px] leading-[38px] text-[#0D0D0D]">
                {title}
            </h1>
            <p className="py-4 font-rubik font-regular sm:text-[20px] text-[20px] leading-[38px] text-[#A68A56]">
                Showing all campaigns ({campaigns.length})
            </p>

            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {isLoading && (
                    <p>Please wait</p>
                )}
                {!isLoading &&campaigns.length === 0 &&(
                    <p>
                        There are currently no campaigns listed, please try again later
                    </p>
                )}
                {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <CampaignCard
                    key={campaign.id}
                    {...campaign}
                    handleClick={() => handleNavigate(campaign)}
                    />)}
            </div>         
        </div>
    )
}

export default ListOfCampaigns