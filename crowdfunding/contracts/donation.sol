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

    /*
    * A function to create a new campaign
    * @param ownerAddress: The Ethereum address of the campaign owner
    * @param campaignTitle: The title of the campaign
    * @param campaignDescription: A description of the campaign
    * @param campaignTarget: The target amount of ether to be raised for the campaign
    * @param campaignDeadline: The deadline for the campaign to reach its funding goal
    * @param imageForCampaign: A URL pointing to an image associated with the campaign
    */

    function createCampaign(address ownerAddress, string memory campaignTitle, string memory campaignDescription, uint256 campaignTarget, uint256 campaignDeadline, string memory imageForCampaign) public returns (uint256){
        // Check that the campaign title, description, and image URL are not empty
        require(bytes(campaignTitle).length > 0, "Title cannont be empty");
        require(bytes(campaignDescription).length > 0, "Description cannont be empty");
        require(bytes(imageForCampaign).length > 0, "Image url cannont be empty");
        // Check that the campaign target amount is greater than zero
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

        // Return the ID of the new campaign
        return noOfCampaigns -1;

    }

    /*
    * A function to allow a user to donate to a campaign
    * @param campaignID: The ID of the campaign to donate to
    */

    function donateToCampaign(uint256 campaignID) public payable{
        // Get the amount being donated
        uint256 amount = msg.value;

        // Get the campaign being donated to
        Campaign storage campaign = campaigns[campaignID];

        // Add the contributor and donation to the campaign
        campaign.contributors.push(msg.sender); //push the address of the person that has donated
        campaign.donations.push(amount);

        // Send the donated amount to the campaign creator
        (bool sent, ) = payable(campaign.creatorAddress).call{value: amount}(""); //lets us know if the transaction has been sent
        if (sent) {
            // Update the amount collected for the campaign
            campaign.amountCollected = campaign.amountCollected + amount;
        }
        // Check if the campaign deadline has passed, and if so, set the campaign status to "reverse" and refund all contributors
        if(block.timestamp >= campaigns[campaignID].deadline) {
            campaigns[campaignID].status = campaignStatus.reverse;
            refund(campaignID);
        }
    }

    /*
    * A function to get the list of donators and their donation amounts for a campaign
    * @param campaignID: The ID of the campaign to get the donators for
    * @return: A tuple containing two arrays - one with the addresses of the donators, and one with their corresponding donation amounts
    */
    function getDonators(uint256 campaignID) view public returns(address[] memory, uint256[] memory){
        // Return the list of contributors and their corresponding donation amounts for the specified campaign
        return(campaigns[campaignID].contributors, campaigns[campaignID].donations);
    }

    /*
    * A function to get all campaigns
    * @return: An array containing all campaigns
    */
    function getAllCampaigns()public view returns (Campaign[] memory){
        //creating an array with as many empty elements as actual campaigns
        Campaign[] memory allCampaigns = new Campaign[](noOfCampaigns); 

        // Iterate over each campaign and add it to the array
        for(uint i = 0; i < noOfCampaigns; i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        // Return the array of all campaigns
        return allCampaigns;
    }

    /*
    * A function to update a campaign's title, description, and image URL
    * @param campaignID: The ID of the campaign to update
    * @param campaignTitle: The updated title of the campaign
    * @param campaignDescription: The updated description of the campaign
    * @param imageForCampaign: The updated URL of the campaign's image
    * @return: True if the campaign was successfully updated, false otherwise
    */

    function updateCampaign (uint256 campaignID, string memory campaignTitle, string memory campaignDescription, string memory imageForCampaign) public returns (bool) {
        // Check that the user calling the function is the creator of the campaign
        require(msg.sender == campaigns[campaignID].creatorAddress, "Unauthorised user for campaign");

        // Update the campaign's title, description, and image URL
        campaigns[campaignID].title = campaignTitle;
        campaigns[campaignID].description = campaignDescription;
        campaigns[campaignID].imageURL = imageForCampaign;

        emit actionPerformed(
            campaignID,
            "Campaign Updated",
            msg.sender,
            block.timestamp);
        
        // Return true to indicate that the campaign was successfully updated
        return true;
    }

    /*
    * A function to remove a campaign
    * @param campaignID: The ID of the campaign to remove
    * @return: True if the campaign was successfully removed, false otherwise
    */

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

    /*
    * A function to refund all contributors for a campaign
    * @param campaignID: The ID of the campaign to refund contributors for
    */
    function refund(uint256 campaignID) internal {
        // Iterate over each supporter of the campaign
        for(uint i = 0; i < supporterOfCampaign[campaignID].length; i++) {
            address supporterAddress = supporterOfCampaign[campaignID][i].creatorAddress;
            uint256 contributionAmount = supporterOfCampaign[campaignID][i].contribution;
            
            supporterOfCampaign[campaignID][i].refunded = true;
            supporterOfCampaign[campaignID][i].timestamp = block.timestamp;

            payTo(supporterAddress, contributionAmount);
        }
    }

    /*
    * A function to transfer ether to an address
    * @param to: The address to transfer ether to
    * @param amount: The amount of ether to transfer
    */

    function payTo(address to, uint256 amount) internal {
        // Convert the recipient's address to a payable address
        address payable recipient = payable(to);
        // Transfer the specified amount of ether to the recipient's address
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Payment failed");
    }

    /*
    * A function to reverse a campaign's donations
    * @param campaignID: The ID of the campaign to reverse donations for
    * @return: True if the donations were successfully reversed, false otherwise
    */

    function reverseDonation(uint256 campaignID) public returns (bool) {
        require(campaigns[campaignID].status != campaignStatus.reverse || campaigns[campaignID].status != campaignStatus.removed, "Campaign status not reverse or removed");

        campaigns[campaignID].status = campaignStatus.reverse;
        refund(campaignID);
        return true;
    }

    /*
    * A function for a user to vote on a campaign withdrawal request
    * @param requestID: The ID of the withdrawal request to vote on
    */

    function voteWithdrawRequest(uint256 requestID) public {
        // Get the withdrawal request being voted on
        campaignWithdrawRequest storage withdrawRequest = campaignWithdrawRequests[requestID];
        // Check that the user has not already voted on the request
        require(withdrawRequest.voted[msg.sender] == false, "You have already voted on this request");
        // Update the withdrawal request's vote count and mark the user as having voted
        withdrawRequest.voted[msg.sender] = true;
        withdrawRequest.noOfVotes ++;
        emit voteOnWithdraw(msg.sender, withdrawRequest.noOfVotes);
    }

    /*
    * A function to withdraw funds from a campaign
    * @param requestID: The ID of the withdrawal request to complete
    * @param campaignID: The ID of the campaign the withdrawal request is for
    */

    function withdrawReqestedAmount(uint256 requestID, uint256 campaignID) public {
        campaignWithdrawRequest storage withdrawRequest = campaignWithdrawRequests[requestID];
        require(withdrawRequest.isCompleted == false, "This request has already been completed");
        // Check that at least 50% of the contributors have voted on the request
        require(withdrawRequest.noOfVotes >= campaigns[campaignID].contributors.length / 2, "At least 50% of the contributors need to vote on this withdrawal reqest");
        withdrawRequest.recipient.transfer(withdrawRequest.amount);
        // Mark the withdrawal request as completed and emit an event indicating that the requested amount was successfully withdrawn
        withdrawRequest.isCompleted = true;

        emit amountWithdrawnSuccessful(requestID, withdrawRequest.requestDescription, withdrawRequest.amount, withdrawRequest.noOfVotes, true, withdrawRequest.recipient);
    }
}