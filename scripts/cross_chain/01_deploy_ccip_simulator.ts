import { ethers, hardhatArguments } from "hardhat"

const network = hardhatArguments.network

async function main() {
    const [owner] = await ethers.getSigners()

    const factory = await ethers.getContractFactory("CCIPLocalSimulator")
    const contract = await factory.deploy()

    const ccipLocalSimulatorAddress = await contract.getAddress()

    console.log("ccipLocalSimulatorAddress = ", ccipLocalSimulatorAddress)
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// ccipLocalSimulator 只需要在本地开发的时候部署，也就是 hardhat 网络中部署。不需要部署到测试网
// npx hardhat run ./scripts/cross_chain/01_deploy_ccip_simulator.ts --network localhost         0x5FbDB2315678afecb367f032d93F642f64180aa3
