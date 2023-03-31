import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({children}) => {
    // the contract object for the smart contract deployed at the specified address.
    const {contract} = useContract("0xad7fA4D78A6F7ec83B0cCf72fc4C653526317483");
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