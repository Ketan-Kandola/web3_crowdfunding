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

    const contribute = async (pId, amount) => {
        const data = await contract.call("donateToCampaign", pId, {
            value: ethers.utils.parseEther(amount)
        });

        return data;
    }

    const getCampaignDonations = async (pId) => {
        const donations = await contract.call("getDonators", pId);
        const noOfDonations = donations[0].length;
        const parsedDonations = [];

        for(let i = 0; i < noOfDonations; i++) {
            parsedDonations.push({
              donator: donations[0][i],
              donation: ethers.utils.formatEther(donations[1][i].toString())
            })
          }
      
          return parsedDonations;
    }

    // Request for withdraw amount
    const requestWithdrawAmount = async (data, onSuccess, onError) => {
        const { web3, contractAddress, description, amount, recipient, account } = data;
        const projectConnector = new web3.eth.Contract(Project.abi, contractAddress);

        try {
            const tx = await projectConnector.methods.createWithdrawRequest(description, amount, recipient).send({ from: account });
            const withdrawReqReceipt = tx.events.WithdrawRequestCreated.returnValues;
            const formattedReqData = formatWithdrawRequestData(withdrawReqReceipt, withdrawReqReceipt.requestId);
            onSuccess(formattedReqData);
        } catch (error) {
            onError(error.message);
        }
    };

    const formatWithdrawRequestData = (reqData) => {
        return {
            requestId: reqData.requestId,
            description: reqData.description,
            amount: ethers.utils.formatEther(reqData.amount.toString()),
            recipient: reqData.recipient,
            creator: reqData.creator,
            approvalCount: reqData.approvalCount,
            rejected: reqData.rejected,
        };
    };
    

    // Get all withdraw requests
    const getAllWithdrawRequests = async (web3, contractAddress, onLoadRequests) => {
        const projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
        const withdrawRequestCount = await
        projectConnector.methods.numOfWithdrawRequests().call();
        const withdrawRequests = [];

        if (withdrawRequestCount <= 0) {
            onLoadRequests(withdrawRequests);
            return;
        }

        for (let i = 1; i <= withdrawRequestCount; i++) {
            const req = await projectConnector.methods.withdrawRequests(i - 1).call();
            withdrawRequests.push(formatWithdrawRequestData({ ...req, requestId: i - 1 }));
        }

        onLoadRequests(withdrawRequests);
    };

    // Vote for withdraw request
    const voteWithdrawRequest = async (data, onSuccess, onError) => {
        const { web3, contractAddress, reqId, account } = data;
        const projectConnector = new web3.eth.Contract(Project.abi, contractAddress);

        try {
            const tx = await projectConnector.methods.voteWithdrawRequest(reqId).send({ from: account });
            console.log(tx);
            onSuccess();
        } catch (error) {
            onError(error.message);
        }
    };

    // Withdraw requested amount
    const withdrawRequestedAmount = async (data, onSuccess, onError) => {
        const { web3, contractAddress, reqId, account, amount } = data;
        const projectConnector = new web3.eth.Contract(Project.abi, contractAddress);

        try {
            const tx = await projectConnector.methods.withdrawRequestedAmount(reqId).send({ from: account });
            console.log(tx);
            dispatch(actions.withdrawContractBalance({ contractAddress: contractAddress, withdrawAmount: amount }));
            onSuccess();
        } catch (error) {
            onError(error.message);
        }
    };

    return(
        <StateContext.Provider 
            value={{
                address, 
                contract,
                connect, 
                createCampaign: publishCampaign,
                getCampaigns,
                getConnectedUserCampaigns,
                contribute,
                getCampaignDonations
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);