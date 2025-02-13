import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { CallOther, IOther, Other } from "../../typechain-types"

const fixture = async () => {
    const factory1 = await ethers.getContractFactory("CallOther")
    const factory2 = await ethers.getContractFactory("Other")

    const contract1 = await factory1.deploy()
    const contract2 = await factory2.deploy()

    const address1 = await contract1.getAddress()
    const address2 = await contract2.getAddress()

    return {
        contract1,
        contract2,
        address1,
        address2
    }
}

const oneEth = ethers.parseEther("1")
const twoEth = ethers.parseEther("2")
const threeEth = ethers.parseEther("3")

describe("call other", () => {
    let callOtherContract: CallOther
    let otherContract: Other
    let callOtherAddress: string
    let otherAddress: string

    before(async () => {
        const { contract1, contract2, address1, address2 } = await loadFixture(fixture)

        callOtherContract = contract1
        otherContract = contract2
        callOtherAddress = address1
        otherAddress = address2

        const [owner] = await ethers.getSigners()

        await owner.sendTransaction({
            to: callOtherAddress,
            value: ethers.parseEther("100")
        })
    })

    it("the balance of callOtherContract should be 100 ETH", async () => {
        const balance = await callOtherContract.getBalance()
        const expected = ethers.parseEther("100")
        expect(balance).to.equal(expected)
    })

    it("call set x1", async () => {
        const transaction = callOtherContract.callSetX1(otherAddress, 1, oneEth)

        await expect(transaction)
            .to.emit(otherContract, "Log")
            .withArgs(callOtherAddress, oneEth)

        const x = await otherContract.getX()
        const balance = await otherContract.getBalance()

        expect(x).to.equal(1)
        expect(balance).to.equal(oneEth)
    })

    it("call set x2", async () => {
        const transaction = callOtherContract.callSetX2(otherAddress, 2, oneEth)

        await expect(transaction)
            .to.emit(otherContract, "Log")
            .withArgs(callOtherAddress, oneEth)

        const x = await otherContract.getX()
        const balance = await otherContract.getBalance()

        expect(x).to.equal(2)
        expect(balance).to.equal(twoEth)
    })

    it("call set x3", async () => {
        const transaction = callOtherContract.callSetX1(otherAddress, 3, oneEth)

        await expect(transaction)
            .to.emit(otherContract, "Log")
            .withArgs(callOtherAddress, oneEth)

        const x = await otherContract.getX()
        const balance = await otherContract.getBalance()

        expect(x).to.equal(3)
        expect(balance).to.equal(threeEth)
    })
})