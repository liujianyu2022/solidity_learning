import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { ValueTypes } from "../../typechain-types"


const fixture = async () => {
    const factory = await ethers.getContractFactory("ValueTypes")
    const contract = await factory.deploy()
    return { contract }
}

describe("ValueTypes", function () {
    let contract: ValueTypes

    beforeEach(async () => {
        const { contract: deployedContract } = await loadFixture(fixture)
        contract = deployedContract
    })

    it("The flag should be true",async () => {
        const flag = await contract.flag()
        const expectedFlag = true
        expect(flag).to.equal(expectedFlag)
    })
})