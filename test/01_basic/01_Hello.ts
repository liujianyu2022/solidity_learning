import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"

async function fixture() {
    const factory = await ethers.getContractFactory("Hello")
    const contract = await factory.deploy()
    return { contract }
}


describe("Hello", function () {
    it("The str should be equal to hello ", async function () {
        const { contract } = await loadFixture(fixture)
        const expectedStr = "hello"

        const str = await contract.getStr()

        expect(str).to.equal(expectedStr)
    });
})


// npx hardhat test .\test\01_basic\01_Hello.ts