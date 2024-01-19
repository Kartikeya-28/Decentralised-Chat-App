require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity:{
    version : "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  // solidity: "0.8.20",
  networks:{
    hardhat : {
      // accounts : [process.env.HARDHAT_PRIVATE_KEY],
      chainId: 1337,
    },
    sepolia : {
      url : SEPOLIA_URL,
      accounts : [PRIVATE_KEY],
    },
  },
};
