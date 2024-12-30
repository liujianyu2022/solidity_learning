import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { ToString } from "../../typechain-types"

const fixture = async function() {
    const factory = await ethers.getContractFactory("ToString")
    const contract = await factory.deploy()
    return { contract }
}

describe("ToString", function(){
    let contract: ToString

    beforeEach(async () => {
        const {contract: deployedContract} = await loadFixture(fixture)
        contract = deployedContract
    })

    it("uint256ToString", async () => {
        const res = await contract.uint256ToString(256)
        const expectedRes = "256"
        expect(res).to.equal(expectedRes)
    })

    it("int256ToString", async () => {
        const res = await contract.int256ToString(-256)
        const expectedRes = "-256"
        expect(res).to.equal(expectedRes)
    })

    it("uint8ToString", async () => {
        const res = await contract.uint8ToString(2)
        const expectedRes = "2"
        expect(res).to.equal(expectedRes)
    })

    it("int8ToString", async () => {
        const res = await contract.int8ToString(-2)
        const expectedRes = "-2"
        expect(res).to.equal(expectedRes)
    })

    it("addressToString", async () => {
        const addr = "0xb40cf46d82A38234F00df654146A0e451418a85D"
        const res = await contract.addressToString(addr)
        const expectedRes = addr.toLowerCase()
        expect(res).to.equal(expectedRes)
    })


})


// npx hardhat test .\test\02_advanced\02_ToString.ts