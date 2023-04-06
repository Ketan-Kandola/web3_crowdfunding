import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {ethers} from 'ethers';

import { campaignImage } from '../assets' //temporary
import {useStateContext} from '../context';
import {CustomButton, Box} from '../components';
import { faceProfilePicture } from '../assets';
import {daysLeft} from '../utils';

const CampaignDetails = () => {
  const {state} = useLocation();
  const {getCampaignDonations, contract, address} = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [contributors, setContributors] = useState([]);
  const remainingDays = daysLeft(state.deadline);

  const handleDonate = async () => {}


  return (
    <div className="py-24 px-6">
      {isLoading && (
        <p>Please wait</p>
      )}
      <div>
        <h1 className="flex font-rubik font-regular sm:text-[61px] text-[48px] leading-[38px] text-[#0D0D0D]">
          Campaign Details
        </h1>
        <div className='py-8 flex justify-start items-start sm:space-x-4 flex-wrap'>
          <img 
          src={state.imageURL}
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

            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
              <div className='w-[40px] h-[40px] flex items-center justify-center cursor-pointer'>
                <img src={faceProfilePicture} alt="Creator profile picture" className="w-[90%] h-[90%] object-contain"/>
              </div>
              <div>
                <h4 className='text-[#ADADAD]'>{`By: ${state.creatorAddress}`}</h4>
                <p className='text-[#A68A56]'>Completed 13 campaigns</p>
              </div>
            </div>

            <div className="mt-[8px]">
              <p className='font-rubik font-normal text-[16px] text-[#404040] text-justify'>
                {state.description}
              </p>
            </div>
            <div className="flex-1">
              <div className="mt-[20px] flex flex-col p-4">
                <p className="font-rubik text-[24px] leading-[30px] text-[#0D0D0D]">
                  Support
                </p>
                <div className="mt-[10px] space-x-4">
                  <input
                    type='number'
                    placeholder='0.5 ETH'
                    step='0.01'
                    className='py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#404040] bg-transparent font-rubik text-[#404040] text-[14px] leading-[30px] placeholder:text-[#ADADAD] rounded-[8px]'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <CustomButton
                    btnType="button"
                    title="Back this project"
                    styles="bg-[#10734F]"
                    handleClick={handleDonate}
                  />
                </div>
              </div>
            </div>
            

          </div>
        </div>
        <div className='flex md:w-[133px] w-full flex-wrap justify-between gap-[24px]'>
          <Box title={`Raised out of ${state.goalAmount}`} value={state.amountCollected} />
          <Box title="Total Backers" value={contributors.length} />
        </div>

        <div>
          <h4 className="font-rubik font-regular text-[42px] text-[#0D0D0D]">Donations</h4>
          <div className="mt-[20px] flex flex-col gap-4">
            {contributors.length > 0 ? contributors.map((item, index) => (
              <div>
                donator
              </div>
            )) : (
              <p>
                There are no donators at the moment. Why don't you be the first one?
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
    
    
  )
}

export default CampaignDetails