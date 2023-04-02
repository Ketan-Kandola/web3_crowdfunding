import React from 'react'

import {daysLeft} from '../utils';
import {profilePic} from '../assets';

const CampaignCard = ({creatorAddress, title, goalAmount, deadline, amountCollected, imageURL, handleClick}) => {
  const remainingDaysOfCampaign = daysLeft(deadline);

  return (
    <div className="sm:w-[288px] w-full rounded-[15px] bg-transparent outline-[#C4C4C4] shadow-lg cursor-pointer" onClick={handleClick}>
      <img src={imageURL} alt="fund" className="w-full h-[136px] object-cover rounded-[15px]"/>

      <div className='flex flex-col p-4'>
        <div className="flex flex-row items-center mb-[18px]">
          <p className="ml-[12px] mt-[2px] font-rubik font-medium text-[16px] text-[#A68A56]">
            Charity
          </p>
        </div>

        <div className='block'>
          <h3 className="font-rubik font-semibold text-[16px] text-[#0D0D0D] text-left leading-[26px] truncate">
            {title}
            Campaign title
          </h3>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-rubik font-regular text-[16px] text-[#10734F] leading-[22px]">
              {amountCollected} eth
              1 eth
            </h4>
            <p className="mt-[3px] font-rubik font-regular text-[14px] leading-[18px] text-[#404040] sm:max-w-[120px] truncate">
              Raised of {goalAmount} 2 ETH
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="font-rubik font-semibold text-[14px] text-[#0D0D0D] leading-[22px]">
                {remainingDaysOfCampaign}
                7
            </h4>
            <p className="mt-[3px] font-rubik font-normal text-[12px] leading-[18px] text-[#404040] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#D9D9D9]">
            <img src={profilePic} alt="creator profile picture" className="w-[90%] h-[90%] object-contain" />
          </div>
          <p className="flex-1 font-rubik font-normal text-[12px] text-[#ADADAD] truncate">
            <span>
              {creatorAddress}
              creator address
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}

export default CampaignCard