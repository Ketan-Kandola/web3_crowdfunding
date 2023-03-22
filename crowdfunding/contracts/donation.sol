// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract donation {
    struct Campaign{
        address creatorAddress;
        string title;
        string description;
        uint256 goalAmount;
        uint256 deadline;
        uint256 amountCollected;
        string imageURL;
        address[] contributors;
        uint256[] donations;
    }
    
    mapping(uint256 => Campaign) public campaigns;

    uint256 public noOfCampaigns = 0;
    
    //returns the id of the campaign
    function createCampaign(address ownerAddress, string memory campaignTitle, string memory campaignDescription, uint256 campaignTarget, uint256 campaignDeadline, string memory imageForCampaign) public returns (uint256){
        Campaign storage campaign = campaigns[noOfCampaigns];
        //test if everything works
        require(campaign.deadline < block.timestamp, "The deadline should be in the future");
        campaign.creatorAddress = ownerAddress;
        campaign.title = campaignTitle;
        campaign.description = campaignDescription;
        campaign.goalAmount = campaignTarget;
        campaign.deadline = campaignDeadline;
        campaign.amountCollected = 0;
        campaign.imageURL = imageForCampaign;

        noOfCampaigns++;
        return noOfCampaigns -1;

    }
    function donateToCampaign(uint256 campaignID) public payable{
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[campaignID];

        campaign.contributors.push(msg.sender); //push the address of the person that has donated
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.creatorAddress).call{value: amount}(""); //lets us know if the transaction has been sent
        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }  
    }

    //list of people that have donated to the campaign
    function getDonators(uint256 campaignID) view public returns(address[] memory, uint256[] memory){
        return(campaigns[campaignID].contributors, campaigns[campaignID].donations);
    }
    function getAllCampaigns()public view returns (Campaign[] memory){
        Campaign[] memory allCampaigns = new Campaign[](noOfCampaigns); //creating an array with as many empty elements as actual campaigns 

        for(uint i = 0; i < noOfCampaigns; i){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;

        return allCampaigns;
        }
    }
}