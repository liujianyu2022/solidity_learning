import { ethers } from "hardhat"

const CCIP_LOCAL_SIMULATOR_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const WRAPPED_NFT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"

async function main() {
    const [ owner ] = await ethers.getSigners()

    const ccipSimulatorContract = await ethers.getContractAt("CCIPLocalSimulator", CCIP_LOCAL_SIMULATOR_ADDRESS)
    const ccipConfig = await ccipSimulatorContract.configuration()
    const destinationRouter = ccipConfig.destinationRouter_
    const linkTokenAddress = ccipConfig.linkToken_

    const wNftContract = await ethers.getContractAt("WrappedMyNFT", WRAPPED_NFT_ADDRESS)
    const wNftAddress = await wNftContract.getAddress()

    const factory = await ethers.getContractFactory("NFTPoolBurnAndMint")

    const poolContract = await factory.deploy(destinationRouter, linkTokenAddress, wNftAddress)
    const poolAddress = await poolContract.getAddress()

    console.log("wNft pool address = ", poolAddress)
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// npx hardhat run ./scripts/cross_chain/deploy_wrapped_nft_pool.ts --network localhost         0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9