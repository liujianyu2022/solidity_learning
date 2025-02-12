import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { Function } from "../../typechain-types"

const fixture = async () => {
    const factory = await ethers.getContractFactory("Function")
    const contract = await factory.deploy(0)
    return contract
}

describe("Function contract test", () => {
    let contract: Function

    // the before function just will be called once
    // the beforeEach function will be called everytime, so the state will be initiated each time
    before(async () => {
        contract = await loadFixture(fixture)
    })

    it("the initial value should be zero", async () => {
        const num = await contract.getNum()
        expect(num).to.equal(0)
    })

    it("the num should be one after the add function was called", async () => {
        await contract.add()
        const result = await contract.num()
        expect(result).to.equal(1)
    })

    it("the returned result by addView function", async () => {
        const result = await contract.addView(10)            // 10 + 1
        expect(result).to.equal(10 + 1)
    })

    it("the balance shoule be zero", async () => {
        const balance = await contract.getBalance()
        expect(balance).to.equal(0)
    })
})