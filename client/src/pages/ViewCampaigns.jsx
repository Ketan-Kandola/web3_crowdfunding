//remember to rearrange the location of campaign card
import React, {useState, useEffect} from 'react';

import {useStateContext} from '../context';
import { CampaignCard, ListOfCampaigns } from '../components';

const ViewCampaigns = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]); // put into state because they need to be fetched from the smart contract
  const {address, contract, getCampaigns} = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);
  
  return (
    <div className="py-24 px-6">
      <ListOfCampaigns 
        title="Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />     
    </div>
  )
}

export default ViewCampaigns