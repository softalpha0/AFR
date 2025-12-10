require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { BASE_SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import("hardhat/config").HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL || "",
      chainId: 84532,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};