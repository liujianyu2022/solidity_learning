import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_ETH_SEPOLIA_URL = "https://eth-sepolia.g.alchemy.com/v2/RSCz8A0CdM9zaYsSOuxYy9Hb630YE5Pa"
const ALCHEMY_ETH_MAINNET_URL = "https://eth-mainnet.g.alchemy.com/v2/RSCz8A0CdM9zaYsSOuxYy9Hb630YE5Pa"
const PRIVATE_KEY = "f7892aa15aedf66b36f617ef80478e7ed1bb79fc9789d4c54123e59a83a30e6c"

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    sepolia: {
      url: ALCHEMY_ETH_SEPOLIA_URL,
      accounts: [PRIVATE_KEY]
    }
  },

  solidity: {
    version: "0.8.28",
    settings: {
      // viaIR: true,
      // optimizer: {
      //   enabled: true,
      //   runs: 200
      // }
    }
  },

};

export default config;
