import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { MultipleLevelMarketing } from "../../typechain-types"

const fixture = async () => {
    const factory = await ethers.getContractFactory("MultipleLevelMarketing")
    const contract = await factory.deploy()
    return { contract }
}

describe("Multiple Level Marketing", () => {
    let contract: MultipleLevelMarketing

    let owner: any

    let address1: any            // 一代
    let address11: any           // 二代
    let address111: any          // 三代

    let address2: any
    let address21: any

    let address3: any
    let address31: any

    before(async () => {
        const signers = await ethers.getSigners()

        owner = signers[0].address
        address1 = signers[1].address
        address11 = signers[2].address
        address111 = signers[3].address
        address2 = signers[4].address
        address21 = signers[5].address
        address3 = signers[6].address
        address31 = signers[7].address

        let { contract: deployedContract } = await loadFixture(fixture)
        contract = deployedContract
    })

    it("add user", async () => {
        // 一代
        await contract.addUser(address1, owner)
        await contract.addUser(address2, owner)
        await contract.addUser(address3, owner)

        expect((await contract.users(address1)).parent).to.equal(owner)
        expect((await contract.users(address2)).parent).to.equal(owner)
        expect((await contract.users(address3)).parent).to.equal(owner)

        // 二代
        await contract.addUser(address11, address1)
        await contract.addUser(address21, address2)
        await contract.addUser(address31, address3)

        expect((await contract.users(address11)).parent).to.equal(address1)
        expect((await contract.users(address21)).parent).to.equal(address2)
        expect((await contract.users(address31)).parent).to.equal(address3)

        // 三代
        await contract.addUser(address111, address11)

        expect((await contract.users(address111)).parent).to.equal(address11)
    })

    it("update balance", async () => {
        // 一代
        await contract.updateBalance(address1, 100)
        await contract.updateBalance(address2, 100)
        await contract.updateBalance(address3, 100)

        expect((await contract.users(address1)).balance).to.equal(100)
        expect((await contract.users(address2)).balance).to.equal(100)
        expect((await contract.users(address3)).balance).to.equal(100)

        // 二代
        await contract.updateBalance(address11, 100)
        await contract.updateBalance(address21, 100)
        await contract.updateBalance(address31, 100)

        expect((await contract.users(address11)).balance).to.equal(100)
        expect((await contract.users(address21)).balance).to.equal(100)
        expect((await contract.users(address31)).balance).to.equal(100)

        // 三代
        await contract.updateBalance(address111, 100)
        expect((await contract.users(address111)).balance).to.equal(100)
    })

    it("calculate balances", async () => {
        const balance1 = await contract.calculateTotalBalance(address1)
        const balance2 = await contract.calculateTotalBalance(address2)
        const balance3 = await contract.calculateTotalBalance(address3)

        expect(balance1).to.equal(300)
        expect(balance2).to.equal(200)
        expect(balance3).to.equal(200)
    })
})


