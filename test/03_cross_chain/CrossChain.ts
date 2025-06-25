import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { Signer } from "ethers";
import { expect } from "chai"
import { CCIPLocalSimulator, MyNFT, NFTPoolLockAndRelease, WrappedMyNFT, NFTPoolBurnAndMint } from "../../typechain-types"

const fixture = async function () {
    const [owner] = await ethers.getSigners()
    const ownerAddress = owner.address

    const factory1 = await ethers.getContractFactory("CCIPLocalSimulator")
    const contract1 = await factory1.deploy()
    const { chainSelector_, sourceRouter_: sourceRouter, destinationRouter_: destinationRouter, linkToken_: linkToken } = await contract1.configuration()

    const factory2 = await ethers.getContractFactory("MyNFT")
    const contract2 = await factory2.deploy("NFT", "NFT", ownerAddress)
    const nftAddress = await contract2.getAddress()

    const factory3 = await ethers.getContractFactory("NFTPoolLockAndRelease")
    const contract3 = await factory3.deploy(sourceRouter, linkToken, nftAddress)

    const factory4 = await ethers.getContractFactory("WrappedMyNFT")
    const contract4 = await factory4.deploy("WNFT", "WNFT", ownerAddress)
    const wNftAddress = await contract4.getAddress()

    const factory5 = await ethers.getContractFactory("NFTPoolBurnAndMint")
    const contract5 = await factory5.deploy(destinationRouter, linkToken, wNftAddress)

    return {
        _owner: owner,
        _chainSelector: chainSelector_,
        contract1,
        contract2,
        contract3,
        contract4,
        contract5,
    }
}

describe("CrossChain", () => {
    let owner: Signer
    let chainSelector: bigint
    let ccipContract: CCIPLocalSimulator
    let nftContract: MyNFT
    let nftPoolContract: NFTPoolLockAndRelease
    let wNftContract: WrappedMyNFT
    let wNftPoolContract: NFTPoolBurnAndMint

    before(async () => {
        const { _owner, _chainSelector, contract1, contract2, contract3, contract4, contract5 } = await loadFixture(fixture)
        owner = _owner
        chainSelector = _chainSelector
        ccipContract = contract1
        nftContract = contract2
        nftPoolContract = contract3
        wNftContract = contract4
        wNftPoolContract = contract5
    })

    describe("source chain -> destination chain", () => {
        it("User can mint a nft successfully", async () => {
            await nftContract.safeMint(owner)
            const realOwner = await nftContract.ownerOf(0)
            const expectedOwner = await owner.getAddress()
            expect(realOwner).to.equal(expectedOwner)
        })

        it("lock nft and mint wNft", async () => {
            await nftContract.approve(nftPoolContract, 0)                                               // 授权
            await ccipContract.requestLinkFromFaucet(nftPoolContract, ethers.parseEther("10"))          // 获取link
            await nftPoolContract.lockAndSendNFT(0, owner, chainSelector, wNftPoolContract)             // lock nft

            // lock nft into nft pool at source chain
            const realOwner1 = await nftContract.ownerOf(0)
            const expectedOwner1 = await nftPoolContract.getAddress()
            expect(realOwner1).to.equal(expectedOwner1)

            // mint wnft to owner at destination chain
            const realOwner2 = await wNftContract.ownerOf(0)
            const expectedOwner2 = await owner.getAddress()
            expect(realOwner2).to.equal(expectedOwner2)
        })
    })

    describe("destination chain -> source chain", () => {
        it("burn wNft and unlocknft", async () => {
            await wNftContract.approve(wNftPoolContract, 0)                                             // 授权
            await ccipContract.requestLinkFromFaucet(wNftPoolContract, ethers.parseEther("10"))         // 获取link
            await wNftPoolContract.burnAndSendNFT(0, owner, chainSelector, nftPoolContract)             // burn wNft

            

        })
    })
})

