import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({children}) => {
    // the contract object for the smart contract deployed at the specified address.
    const {contract} = useContract("0x89026b3C0cAcbeb10B4F01A9d2ea8e7eB930Fc5B");
    // create a function that can be used to call the createCampaign function on the contract object.
    const {mutateAsync: createCampaign} = useContractWrite(contract, "createCampaign");

    const address = useAddress();
    const connect = useMetamask();

    // Create an async function, publishCampaign, that will be used to call
    // the createCampaign function with the necessary arguments.
    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address,
                form.title,
                form.description,
                form.goalAmount,
                new Date(form.deadline).getTime(),
                form.imageURL
            ])
            console.log("contract call was successful", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call("getAllCampaigns");

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            creatorAddress: campaign.creatorAddress,
            title: campaign.title,
            description: campaign.description,
            goalAmount: ethers.utils.formatEther(campaign.goalAmount.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            imageURL: campaign.imageURL,
            pId: i
        }));
        return parsedCampaigns;
    }

    const getConnectedUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();
        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.creatorAddress === address);

        return filteredCampaigns;
    }

    return(
        <StateContext.Provider 
            value={{
                address, 
                contract,
                connect, 
                createCampaign: publishCampaign,
                getCampaigns,
                getConnectedUserCampaigns
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);