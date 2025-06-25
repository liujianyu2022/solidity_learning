import { ethers } from "hardhat"

const CCIP_LOCAL_SIMULATOR_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const NFT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

async function main() {
    const [ owner ] = await ethers.getSigners()

    const ccipSimulatorContract = await ethers.getContractAt("CCIPLocalSimulator", CCIP_LOCAL_SIMULATOR_ADDRESS)
    const ccipConfig = await ccipSimulatorContract.configuration()
    const sourceChainRouter = ccipConfig.sourceRouter_
    const linkTokenAddress = ccipConfig.linkToken_

    const nftContract = await ethers.getContractAt("MyNFT", NFT_ADDRESS)
    const nftAddress = await nftContract.getAddress()

    const factory = await ethers.getContractFactory("NFTPoolLockAndRelease")

    const poolContract = await factory.deploy(sourceChainRouter, linkTokenAddress, nftAddress)
    const poolAddress = await poolContract.getAddress()

    console.log("nft pool address = ", poolAddress)
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// npx hardhat run ./scripts/cross_chain/deploy_nft_pool.ts --network localhost         0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
