const { expect } = require("chai");
const { ethers } = require("hardhat");

const etherToWei = (n) =>{
    return ethers.utils.parseUnits(n,'ether')
}

const dateToUNIX = (date) => {
    return Math.round(new Date(date).getTime() / 1000).toString()
}

describe("donation", () => {
    var address1;
    var address2;
    var donationContract;

    beforeEach(async function(){
        [address1, address2, ...address] = await ethers.getSigners();
    })
})