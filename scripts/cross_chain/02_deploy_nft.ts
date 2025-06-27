import { ethers } from "hardhat"

// alchemy网址：   https://dashboard.alchemy.com/apps
// infura网址：    https://app.infura.io/

async function main() {
    const [owner] = await ethers.getSigners()
    const ownerAddress = await owner.getAddress()

    const factory = await ethers.getContractFactory("MyNFT")
    const contract = await factory.deploy("NFT", "NFT", ownerAddress)

    const contractAddress = await contract.getAddress()

    console.log("NFT address is = ", contractAddress)
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// npx hardhat run ./scripts/cross_chain/02_deploy_nft.ts --network localhost         0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
// npx hardhat run ./scripts/cross_chain/02_deploy_nft.ts --network eth_sepolia       0x321103ee08F3e394480Fa8DeF01356ec0a1bC886
