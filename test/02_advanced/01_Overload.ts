import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { Overload } from "../../typechain-types"

const fixture = async () => {
    const factory = await ethers.getContractFactory("Overload")
    const contract = await factory.deploy()
    return { contract }
}

describe("Overload", function () {
    let contract: Overload

    beforeEach(async () => {
        const { contract: deployedContract } = await loadFixture(fixture)
        contract = deployedContract
    })

    it("fn1(uint256,bool)", async () => {
        // Solidity 不支持函数的直接重载调用（即多个同名但参数不同的函数），而 TypeScript 的合约类型是根据 ABI 自动生成的，不会区分重载函数。
        // 在 Solidity 中，当存在函数重载时，需要通过 函数签名（包括参数类型）来明确调用具体的重载版本
        // const str = await contract.fn1(100, true)                        // 不支持函数的直接重载调用

        const str = await contract["fn1(uint256,bool)"](100, true)          // 通过 函数签名（包括参数类型）来明确调用具体的重载版本
        const expectedStr = "100 true"
        expect(str).to.equal(expectedStr)
    })

    it("fn1(bool,uint256)", async () => {
        const str = await contract["fn1(bool,uint256)"](false, 200)
        const expectedStr = "false 200"
        expect(str).to.equal(expectedStr)
    })
})

// npx hardhat test .\test\02_advanced\01_Overload.ts