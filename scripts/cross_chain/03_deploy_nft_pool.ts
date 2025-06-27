import { ethers, hardhatArguments } from "hardhat"
import crossChainConfig from "../../cross_chain_config"

const CCIP_LOCAL_SIMULATOR_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// const NFT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

// 已经部署到 sepolia 测试网上的合约地址
const NFT_ADDRESS = "0x321103ee08F3e394480Fa8DeF01356ec0a1bC886"

const network = hardhatArguments.network || ""

console.log("network = ", network)

async function main() {
    const [owner] = await ethers.getSigners()

    let sourceChainRouter: string
    let linkTokenAddress: string

    if (network === "localhost") {
        const ccipSimulatorContract = await ethers.getContractAt("CCIPLocalSimulator", CCIP_LOCAL_SIMULATOR_ADDRESS)
        const ccipConfig = await ccipSimulatorContract.configuration()
        sourceChainRouter = ccipConfig.sourceRouter_
        linkTokenAddress = ccipConfig.linkToken_
    }else{
        sourceChainRouter = crossChainConfig[network].router
        linkTokenAddress = crossChainConfig[network].linkToken
    }

    // const nftContract = await ethers.getContractAt("MyNFT", NFT_ADDRESS)
    // const nftAddress = await nftContract.getAddress()

    const factory = await ethers.getContractFactory("NFTPoolLockAndRelease")

    const poolContract = await factory.deploy(sourceChainRouter, linkTokenAddress, NFT_ADDRESS)
    const poolAddress = await poolContract.getAddress()

    console.log("nft pool address = ", poolAddress)
}

// main()
//     .catch((error) => {
//         console.error("error = ", error)
//     })

// npx hardhat run ./scripts/cross_chain/03_deploy_nft_pool.ts --network localhost         0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// npx hardhat run ./scripts/cross_chain/03_deploy_nft_pool.ts --network eth_sepolia
