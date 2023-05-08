/** @type import('hardhat/config').HardhatUserConfig */
require("hardhat-gas-reporter");
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY
module.exports = {
  solidity: {
    version: '0.8.9',
    defaultNetwork: 'goerli',
    networks: {
      hardhat: {},
      goerli: {
        url: 'https://rpc.ankr.com/eth_goerli',
        accounts: [`0x${process.env.PRIVATE_KEY}`] //account that will be used to deploy smart contract
      }
    },
    gasReporter: {
    enabled: true,
    outputFile: "eth-gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKET_API_KEY,
    token: "ETH",
    }
  },
};
