const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Campaign contract", function () {
    let CampaignContract;
    let campaign;
    let owner;
    let campaignTarget;
    let campaignDeadline;
    let campaignTitle;
    let campaignDescription;
    let imageForCampaign;

    beforeEach(async () => {
        // Get the Campaign contract
        CampaignContract = await ethers.getContractFactory("Campaign");

        // Deploy a new campaign contract
        campaign = await CampaignContract.deploy();

        // Get the owner address
        [owner] = await ethers.getSigners();

        // Set the campaign target amount and deadline
        campaignTarget = ethers.utils.parseEther("10");
        campaignDeadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // Set the campaign title, description, and image URL
        campaignTitle = "Test Campaign";
        campaignDescription = "This is a test campaign";
        imageForCampaign = "https://example.com/test.jpg";
    });

    it("should create a new campaign", async function () {
        // Create a new campaign
        const tx = await campaign.createCampaign(
        owner.address,
        campaignTitle,
        campaignDescription,
        campaignTarget,
        campaignDeadline,
        imageForCampaign
        );

        // Get the ID of the new campaign
        const campaignId = tx.receipt.logs[0].args[0].toNumber();

        // Get the details of the new campaign
        const result = await campaign.campaigns(campaignId);

        // Check that the campaign details are correct
        expect(result.creatorAddress).to.equal(owner.address);
        expect(result.title).to.equal(campaignTitle);
        expect(result.description).to.equal(campaignDescription);
        expect(result.goalAmount).to.equal(campaignTarget);
        expect(result.deadline).to.equal(campaignDeadline);
        expect(result.amountCollected).to.equal(0);
        expect(result.imageURL).to.equal(imageForCampaign);
    });

    it("should not create a new campaign with an empty title", async function () {
        // Try to create a new campaign with an empty title
        await expect(
        campaign.createCampaign(
            owner.address,
            "",
            campaignDescription,
            campaignTarget,
            campaignDeadline,
            imageForCampaign
        )
        ).to.be.revertedWith("Title cannont be empty");
    });

    it("should not create a new campaign with an empty description", async function () {
        // Try to create a new campaign with an empty description
        await expect(
        campaign.createCampaign(
            owner.address,
            campaignTitle,
            "",
            campaignTarget,
            campaignDeadline,
            imageForCampaign
        )
        ).to.be.revertedWith("Description cannont be empty");
    });

    it("should not create a new campaign with an empty image URL", async function () {
        // Try to create a new campaign with an empty image URL
        await expect(
        campaign.createCampaign(
            owner.address,
            campaignTitle,
            campaignDescription,
            campaignTarget,
            campaignDeadline,
            ""
        )
        ).to.be.revertedWith("Image url cannont be empty");
    });

    it("should not create a new campaign with a target amount of zero", async function () {
        // Try to create a new campaign with a target amount of zero
        await expect(
        campaign.createCampaign(
            owner.address,
            campaignTitle,
            campaignDescription,
            0,
            campaignDeadline,
            imageForCampaign
        )
        ).to.be.revertedWith("The target amount should be greater than zero");
    })
    it("should not create a new campaign with a deadline in the past", async function () {
        // Try to create a new campaign with a deadline in the past
        await expect(
            campaign.createCampaign(
            owner.address,
            campaignTitle,
            campaignDescription,
            campaignTarget,
            Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
            imageForCampaign
            )
        ).to.be.revertedWith("The deadline should be in the future");
    });
})
