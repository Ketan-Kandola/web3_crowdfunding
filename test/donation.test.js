const { expect } = require("chai");

describe("Donation contract", function() {
    let donation;
    let campaignID;

    before(async function() {
    const Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy();
    await donation.deployed();
    });

    describe("createCampaign", function() {
        it("should create a new campaign", async function() {
            const campaignTitle = "Test Campaign";
            const campaignDescription = "This is a test campaign";
            const campaignTarget = ethers.utils.parseEther("1");
            const campaignDeadline = Math.floor(Date.now() / 1000) + 3600;
            const imageForCampaign = "https://static.independent.co.uk/s3fs-public/thumbnails/image/2020/04/06/00/stay-home-veg-box.jpg";
            const ownerAddress = await ethers.getSigner(0).getAddress();
            campaignID = await donation.createCampaign(ownerAddress, campaignTitle, campaignDescription, campaignTarget, campaignDeadline, imageForCampaign);
            expect(campaignID).to.equal(0);
        });
    });

    describe("donateToCampaign", function() {
        it("should donate to the campaign", async function() {
            const donationAmount = ethers.utils.parseEther("0.5");
            await donation.connect(ethers.provider.getSigner(1)).donateToCampaign(campaignID, { value: donationAmount });
            const [contributors, donations] = await donation.getDonators(campaignID);
            expect(contributors.length).to.equal(1);
            expect(donations.length).to.equal(1);
            expect(donations[0]).to.equal(donationAmount);
        });
        it("should refund all contributors if deadline has passed", async function() {
            const donationAmount = ethers.utils.parseEther("0.5");
            const campaign = await donation.campaigns(campaignID);
            const deadline = campaign.deadline;
            await ethers.provider.send("evm_setNextBlockTimestamp", [deadline+1]);
            await ethers.provider.send("evm_mine");

            const initialContractBalance = await ethers.provider.getBalance(donation.address);
            const initialDonorBalance = await ethers.provider.getBalance(await ethers.provider.getSigner(1).getAddress());

            await donation.connect(ethers.provider.getSigner(1)).donateToCampaign(campaignID, { value: donationAmount });

            const finalContractBalance = await ethers.provider.getBalance(donation.address);
            const finalDonorBalance = await ethers.provider.getBalance(await ethers.provider.getSigner(1).getAddress());

            expect(finalContractBalance).to.equal(initialContractBalance);
            expect(finalDonorBalance).to.be.above(initialDonorBalance);
        });
    });

    describe("updateCampaign", function() {
        it("should update the campaign", async function() {
            const campaignTitle = "Updated Campaign";
            const campaignDescription = "This is an updated campaign";
            const imageForCampaign = "https://example.com/updated.png";
            const result = await donation.updateCampaign(campaignID, campaignTitle, campaignDescription, imageForCampaign);
            expect(result).to.be.true;
            const campaign = await donation.campaigns(campaignID);
            expect(campaign.title).to.equal(campaignTitle);
            expect(campaign.description).to.equal(campaignDescription);
            expect(campaign.imageURL).to.equal(imageForCampaign);
        });
    });

    describe("removeCampaign", function() {
        it("should remove the campaign", async function() {
            const result = await donation.removeCampaign(campaignID);
            expect(result).to.be.true;
            const campaign = await donation.campaigns(campaignID);
            expect(campaign.status).to.equal(3); // campaignStatus.removed
        });
    });
    
    describe("refund", function() {
        it("should refund all contributors for a campaign", async function() {
            // Create a new campaign
            const campaignId = await donation.createCampaign(ownerAddress, "Campaign Title", "Campaign Description", web3.utils.toWei("1"), Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, "https://static.independent.co.uk/s3fs-public/thumbnails/image/2020/04/06/00/stay-home-veg-box.jpg");
    
            // Donate to the campaign
            await donation.donateToCampaign(campaignId, { from: donor1Address, value: web3.utils.toWei("0.5") });
            await donation.donateToCampaign(campaignId, { from: donor2Address, value: web3.utils.toWei("0.3") });
            await donation.donateToCampaign(campaignId, { from: donor3Address, value: web3.utils.toWei("0.2") });
    
            // Refund all contributors for the campaign
            await donation.refund(campaignId);
    
            // Check that all contributors were refunded
            const supporter1 = await donation.supporterOfCampaign(campaignId, 0);
            assert.strictEqual(supporter1.refunded, true, "Contributor 1 was not refunded");
            const supporter2 = await donation.supporterOfCampaign(campaignId, 1);
            assert.strictEqual(supporter2.refunded, true, "Contributor 2 was not refunded");
            const supporter3 = await donation.supporterOfCampaign(campaignId, 2);
            assert.strictEqual(supporter3.refunded, true, "Contributor 3 was not refunded");
        });
    });

    describe("payTo", function() {
        it("should transfer ether to an address", async function() {
            // Send ether to the contract
            await web3.eth.sendTransaction({ from: donor1Address, to: donation.address, value: web3.utils.toWei("1") });
    
            // Transfer the ether to the recipient
            const recipientBalanceBefore = await web3.eth.getBalance(recipientAddress);
            await donation.payTo(recipientAddress, web3.utils.toWei("0.5"));
            const recipientBalanceAfter = await web3.eth.getBalance(recipientAddress);
    
            // Check that the recipient's balance was increased by the transferred amount
            assert.strictEqual(recipientBalanceAfter - recipientBalanceBefore, web3.utils.toWei("0.5"), "Recipient's balance was not increased by the transferred amount");
        });
    });

    describe("createWithdrawalRequest", function() {
        it("should create a new withdrawal request", async function() {
            const campaignId = campaignID;
            const requestDescription = "Withdraw Request";
            const requestAmount = ethers.utils.parseEther("0.5");
            const recipient = await ethers.getSigner(0).getAddress();
            const requestId = await donation.createWithdrawalRequest(campaignId, requestDescription, requestAmount, recipient);
            expect(requestId).to.equal(0);
        });
    });
    describe("voteWithdrawRequest", function() {
        it("should allow a user to vote on a withdrawal request", async function() {
            const requestId = 0;
            const result = await donation.voteWithdrawRequest(requestId);
            expect(result).to.be.true;
            const withdrawRequest = await donation.campaignWithdrawRequests(requestId);
            expect(withdrawRequest.noOfVotes).to.equal(1);
        });
    });
    describe("withdrawRequestedAmount", function () {
        it("should withdraw funds from a campaign", async function () {
            const campaignId = await donation.createCampaign(ownerAddress, "Campaign Title", "Campaign Description", web3.utils.toWei("1"), Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, "https://static.independent.co.uk/s3fs-public/thumbnails/image/2020/04/06/00/stay-home-veg-box.jpg");

            // Donate to the campaign
            await donation.donateToCampaign(campaignId, { from: donor1Address, value: web3.utils.toWei("0.5") });
            await donation.donateToCampaign(campaignId, { from: donor2Address, value: web3.utils.toWei("0.3") });
            await donation.donateToCampaign(campaignId, { from: donor3Address, value: web3.utils.toWei("0.2") });

            // Create a campaign withdrawal request
            const requestDescription = "Withdraw Request";
            const requestAmount = web3.utils.toWei("0.9");
            const recipient = ownerAddress;
            const requestId = await donation.createWithdrawalRequest(campaignId, requestDescription, requestAmount, recipient, { from: ownerAddress });

            // Vote on the withdrawal request
            await donation.voteWithdrawRequest(requestId, { from: donor1Address });
            await donation.voteWithdrawRequest(requestId, { from: donor2Address });

            // Withdraw the requested amount
            await donation.withdrawRequestedAmount(requestId, campaignId, { from: ownerAddress });

            // Check that the withdrawal request was marked as completed
            const withdrawalRequest = await donation.campaignWithdrawRequests(requestId);
            assert.strictEqual(withdrawalRequest.isCompleted, true, "Withdrawal request was not marked as completed");

            // Check that the recipient received the requested amount
            const recipientBalance = await web3.eth.getBalance(recipient);
            assert.strictEqual(recipientBalance.toString(), requestAmount, "Recipient did not receive the requested amount");

            // Check that the contract's balance was reduced by the requested amount
            const contractBalance = await web3.eth.getBalance(donation.address);
            assert.strictEqual(contractBalance.toString(), web3.utils.toWei("0.1"), "Contract balance was not reduced by the requested amount");
        });
    });
});