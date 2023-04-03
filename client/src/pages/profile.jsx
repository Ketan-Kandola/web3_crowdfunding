//remember to rearrange the location of campaign card
import React, {useState, useEffect} from 'react';

import {useStateContext} from '../context';
import { CampaignCard, ListOfCampaigns } from '../components';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]); // put into state because they need to be fetched from the smart contract
  const {address, contract, getCampaigns} = useStateContext();
  
  return (
    <div className="py-24 px-6">
      <ListOfCampaigns 
        title="My Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
      ViewCampaigns list below
      <CampaignCard />
    </div>
  )
}

export default Profile