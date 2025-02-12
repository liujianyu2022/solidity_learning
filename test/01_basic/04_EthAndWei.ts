import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { EthAndWei } from "../../typechain-types"

const fixture = async () => {
    const factory = await ethers.getContractFactory("EthAndWei")
    const contract = await factory.deploy()
    return contract
}


describe("test eth and wei", () => {
    let contract: EthAndWei

    before(async () => {
        contract = await loadFixture(fixture)
    })

    it("test", async () => {
        expect(await contract.flag1()).to.be.true
        expect(await contract.flag2()).to.be.true
        expect(await contract.flag3()).to.be.true
    })
})








