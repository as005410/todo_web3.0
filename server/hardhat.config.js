require("@nomicfoundation/hardhat-toolbox");
const ALCHEMY_API_KEY = "ChsObae9HznxffzkhDKngrRNjw4VrRTN";
const GOERLI_PRIVATE_KEY =
  "acbea2363b26a6ca751fbb0501b2e6c203d46b2805d09372652577e9f520b72b";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};
