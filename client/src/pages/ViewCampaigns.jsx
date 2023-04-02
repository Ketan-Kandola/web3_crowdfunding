import React, {useState, useEffect} from 'react';

import {useStateContext} from '../context';
import { ListOfCampaigns } from '../components';

const ViewCampaigns = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]); // put into state because they need to be fetched from the smart contract
  const {address, contract, getCampaigns} = useStateContext();
  
  return (
    <div className="py-24 px-6">
      <ListOfCampaigns 
        title="Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
      ViewCampaigns
    </div>
  )
}

export default ViewCampaigns