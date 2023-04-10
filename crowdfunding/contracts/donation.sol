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
        uint256 timestamp;
        campaignStatus status;
    }

    struct supporterStruct{
        address creatorAddress;
        uint256 contribution;
        uint256 timestamp;
        bool refunded;
    }

    struct campaignWithdrawRequest{
        string requestDescription;
        uint256 amount;
        uint256 noOfVotes;
        mapping(address => bool) voted;
        bool isCompleted;
        address payable recipient;
    }

    enum campaignStatus{
        open,
        reverse,
        removed,
        paidout
    }

    event actionPerformed (uint256 actionId, string actionType, address indexed performer, uint256 timestamp);

    event amountWithdrawnSuccessful(
        uint256 withdrawRequestId,
        string description,
        uint256 amount,
        uint256 totalVotes,
        bool isCompleted,
        address reciptent
    );

    event voteOnWithdraw(address voter, uint totalVotes);

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => supporterStruct[]) supporterOfCampaign;
    mapping (uint256 => campaignWithdrawRequest) public campaignWithdrawRequests;

    uint256 public noOfCampaigns = 0;

    function createCampaign(address ownerAddress, string memory campaignTitle, string memory campaignDescription, uint256 campaignTarget, uint256 campaignDeadline, string memory imageForCampaign) public returns (uint256){
        require(bytes(campaignTitle).length > 0, "Title cannont be empty");
        require(bytes(campaignDescription).length > 0, "Description cannont be empty");
        require(bytes(imageForCampaign).length > 0, "Image url cannont be empty");
        require(campaignTarget > 0 ether, "Target cannont be zero");

        Campaign storage campaign = campaigns[noOfCampaigns];
        require(campaign.deadline < block.timestamp, "The deadline should be in the future");
        campaign.creatorAddress = ownerAddress;
        campaign.title = campaignTitle;
        campaign.description = campaignDescription;
        campaign.goalAmount = campaignTarget;
        campaign.deadline = campaignDeadline;
        campaign.amountCollected = 0;
        campaign.imageURL = imageForCampaign;

        emit actionPerformed(noOfCampaigns++, "Campaign created", msg.sender, block.timestamp);
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
        if(block.timestamp >= campaigns[campaignID].deadline) {
            campaigns[campaignID].status = campaignStatus.reverse;
            refund(campaignID);
        }
    }

    function getDonators(uint256 campaignID) view public returns(address[] memory, uint256[] memory){
        return(campaigns[campaignID].contributors, campaigns[campaignID].donations);
    }
    function getAllCampaigns()public view returns (Campaign[] memory){
        Campaign[] memory allCampaigns = new Campaign[](noOfCampaigns); //creating an array with as many empty elements as actual campaigns 

        for(uint i = 0; i < noOfCampaigns; i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function updateCampaign (uint256 campaignID, string memory campaignTitle, string memory campaignDescription, string memory imageForCampaign) public returns (bool) {
        require(msg.sender == campaigns[campaignID].creatorAddress, "Unauthorised user for campaign");
        campaigns[campaignID].title = campaignTitle;
        campaigns[campaignID].description = campaignDescription;
        campaigns[campaignID].imageURL = imageForCampaign;

        emit actionPerformed(
            campaignID,
            "Campaign Updated",
            msg.sender,
            block.timestamp);

        return true;
    }

    function removeCampaign(uint256 campaignID) public returns (bool) {
        require(msg.sender == campaigns[campaignID].creatorAddress, "Unauthorised user for campaign");

        campaigns[campaignID].status = campaignStatus.removed;
        refund(campaignID);

        emit actionPerformed (
            campaignID,
            "Campaign has been removed",
            msg.sender,
            block.timestamp
        );

        return true;
    }

    function refund(uint256 campaignID) internal {
        for(uint i = 0; i < supporterOfCampaign[campaignID].length; i++) {
            address supporterAddress = supporterOfCampaign[campaignID][i].creatorAddress;
            uint256 contributionAmount = supporterOfCampaign[campaignID][i].contribution;
            
            supporterOfCampaign[campaignID][i].refunded = true;
            supporterOfCampaign[campaignID][i].timestamp = block.timestamp;

            payTo(supporterAddress, contributionAmount);
        }
    }

    function payTo(address to, uint256 amount) internal {
        address payable recipient = payable(to);
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Payment failed");
    }

    function reverseDonation(uint256 campaignID) public returns (bool) {
        require(campaigns[campaignID].status != campaignStatus.reverse || campaigns[campaignID].status != campaignStatus.removed, "Campaign status not reverse or removed");

        campaigns[campaignID].status = campaignStatus.reverse;
        refund(campaignID);
        return true;
    }

    function voteWithdrawRequest(uint256 requestID) public {
        campaignWithdrawRequest storage withdrawRequest = campaignWithdrawRequests[requestID];
        require(withdrawRequest.voted[msg.sender] == false, "You have already voted on this request");
        withdrawRequest.voted[msg.sender] = true;
        withdrawRequest.noOfVotes ++;
        emit voteOnWithdraw(msg.sender, withdrawRequest.noOfVotes);
    }

    function withdrawReqestedAmount(uint256 requestID, uint256 campaignID) public {
        campaignWithdrawRequest storage withdrawRequest = campaignWithdrawRequests[requestID];
        require(withdrawRequest.isCompleted == false, "This request has already been completed");
        require(withdrawRequest.noOfVotes >= campaigns[campaignID].contributors.length / 2, "At least 50% of the contributors need to vote on this withdrawal reqest");
        withdrawRequest.recipient.transfer(withdrawRequest.amount);
        withdrawRequest.isCompleted = true;

        emit amountWithdrawnSuccessful(requestID, withdrawRequest.requestDescription, withdrawRequest.amount, withdrawRequest.noOfVotes, true, withdrawRequest.recipient);
    }
}