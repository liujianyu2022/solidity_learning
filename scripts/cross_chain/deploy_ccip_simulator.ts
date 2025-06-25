import { ethers } from "hardhat"

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


// npx hardhat run ./scripts/cross_chain/deploy_ccip_simulator.ts --network localhost         0x5FbDB2315678afecb367f032d93F642f64180aa3
