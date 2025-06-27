import { ethers } from "hardhat"

// alchemy网址：   https://dashboard.alchemy.com/apps
// infura网址：    https://app.infura.io/

async function main() {
    const [owner] = await ethers.getSigners()
    const ownerAddress = await owner.getAddress()

    const factory = await ethers.getContractFactory("WrappedMyNFT")
    const contract = await factory.deploy("WNFT", "WNFT", ownerAddress)

    const contractAddress = await contract.getAddress()

    console.log("WNFT address is = ", contractAddress)
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// npx hardhat run ./scripts/cross_chain/04_deploy_wrapped_nft.ts --network localhost            0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
// npx hardhat run ./scripts/cross_chain/04_deploy_wrapped_nft.ts --network avax_fuji