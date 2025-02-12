import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { HDNodeWallet } from "ethers"
import { expect } from "chai"
import { ReceiveAndFallback } from "../../typechain-types"

const fixture = async () => {
    const factory = await ethers.getContractFactory("ReceiveAndFallback")
    const contract = await factory.deploy()
    return contract
}

describe("receive and fallback", () => {
    let contract: ReceiveAndFallback
    let contractAddress: string
    let user: HDNodeWallet

    before(async () => {
        contract = await loadFixture(fixture)
        contractAddress = await contract.getAddress()

        const [owner] = await ethers.getSigners()

        user = ethers.Wallet.createRandom().connect(ethers.provider)        // 创建一个新的用户

        // 使用 Hardhat 启动本地测试网络时，默认会创建 20 个账户，每个账户的初始余额是 10,000 ETH
        // 因此可以使用 owner 给创建的用户分配 100 ETH
        await owner.sendTransaction({
            to: user.address,
            value: ethers.parseEther("100")
        })
    })

    it("the balance of user should be 100 ether", async () => {
        const userBalance = await ethers.provider.getBalance(user.address)
        const expectedBalance = ethers.parseEther("100")
        expect(userBalance).to.equal(expectedBalance)
    })

    it("The receive function shoule be triggered when sending ETH with empty data", async () => {
        const oneEth = ethers.parseEther("1")

        const transaction = await user.sendTransaction({
            to: contractAddress,
            value: oneEth
        })

        await expect(transaction)
            .to.emit(contract, "Receive")
            .withArgs(user.address, oneEth)
    })

    it("The fallback function shoule be triggered when sending ETH with data", async () => {
        const oneEth = ethers.parseEther("1")

        // 将字符串转换为 Uint8Array，然后转换为十六进制字符串
        // 这是因为 ethers.js 的 TransactionRequest 类型中，data 字段的类型是 string | null | undefined
        // 最终转为：0x736f6d652064617461
        const data = ethers.hexlify(
            ethers.toUtf8Bytes("some data")
        )

        const transaction = await user.sendTransaction({
            to: contractAddress,
            value: oneEth,
            data                    // 使用十六进制字符串      0x736f6d652064617461
        })

        await expect(transaction)
            .to.emit(contract, "Fallback")
            .withArgs(user.address, oneEth, data)
    })
})

// npx hardhat test .\test\02_advanced\03_ReceiveAndFallback.ts