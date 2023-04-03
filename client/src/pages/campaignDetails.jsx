import React from 'react'

import { campaignImage } from '../assets' //temporary

const CampaignDetails = () => {
  return (
    <div className="py-24 px-6">
      <div>
        <h1 className="flex font-rubik font-regular sm:text-[61px] text-[48px] leading-[38px] text-[#0D0D0D]">
          Campaign Details
        </h1>
        <div className='flex justify-start items-start sm:space-x-4 flex-wrap'>
          <img 
          src={campaignImage}
          alt="campaign image"
          className="rounded-xl h-64 object-cover w-full sm:w-1/3" />

          <div className='flex-1 sm:py-0 py-4'>
            <div className='flex flex-col justify-start flex-wrap'>
              <h5 className="font-rubik font-medium text-[24px] leading[24px] text-[#0D0D0D]">
                Campaign Title
              </h5>
              <small className="font-rubik font-regular text-[16px] leading[16px] text-[#ADADAD]">
                8 days remaining
              </small>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    
  )
}

export default CampaignDetails