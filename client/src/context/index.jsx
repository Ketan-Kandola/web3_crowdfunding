import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({children}) => {
    const {contract} = useContract("0xad7fA4D78A6F7ec83B0cCf72fc4C653526317483");
    const {mutateAsync: createCampaign} = useContractWrite(contract, "createCampaign");

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address,
                form.title,
                form.description,
                form.targetGoal,
                new Date(form.deadline).getTime(),
                form.imageUrl
            ])
            console.log("contract call was successful", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }
    return(
        <StateContext.Provider 
            value={{
                address, 
                contract, 
                connect, 
                createCampaign: publishCampaign
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);