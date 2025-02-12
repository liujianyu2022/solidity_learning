import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { SendETH, ReceiveETH } from "../../typechain-types"

const fixture = async () => {
    const sendETHFactory = await ethers.getContractFactory("SendETH")
    const receiveETHFactory = await ethers.getContractFactory("ReceiveETH")

    const [owner, other] = await ethers.getSigners()

    // 默认情况下，部署合约会使用 ethers.getSigners() 返回的第一个账户（owner）进行费用支付
    // 通过 connect 方法，可以显式指定使用哪个账户来发送交易
    // 注意：deploy 方法并不直接支持 from 参数来指定发送账户， 因此不能直接写成 deploy({ from: owner, value: ... }) 的形式
    const sendETHContract = await sendETHFactory.connect(other).deploy({
        // from: other.address,
        value: ethers.parseEther("100")
    })

    const receiveETHContract = await receiveETHFactory.deploy()

    return { sendETHContract, receiveETHContract }
}

const oneEth = ethers.parseEther("1")
const twoEth = ethers.parseEther("2")
const threeEth = ethers.parseEther("3")
const fourEth = ethers.parseEther("4")
const twoHundredEth = ethers.parseEther("200")

describe("send and receive ETH", () => {
    let sendContract: SendETH
    let receiveContract: ReceiveETH

    let sendContractAddress: string
    let receiveContractAddress: string

    before(async () => {
        const { sendETHContract, receiveETHContract } = await loadFixture(fixture)

        sendContract = sendETHContract
        receiveContract = receiveETHContract

        receiveContractAddress = await receiveContract.getAddress()
        sendContractAddress = await sendContract.getAddress()
    })

    it("the initial balance of them", async () => {
        const balance1 = await sendContract.getBalance()
        const expectedBalance1 = ethers.parseEther("100")

        const balance2 = await receiveContract.getBalance()
        const expectedBalance2 = ethers.parseEther("0")

        expect(balance1).to.equal(expectedBalance1)
        expect(balance2).to.equal(expectedBalance2)
    })

    it("test the call1 function", async () => {

        await sendContract.call1(receiveContractAddress, oneEth)

        const balance = await receiveContract.getBalance()

        expect(balance).to.equal(oneEth)
    })

    it("test the call2 function", async () => {
        const data = "hello, receipt"

        // 生成包含函数签名和参数的 callData
        // 相当于 solidity 中的 abi.encode()
        const callData = ethers.AbiCoder.defaultAbiCoder().encode(
            ["string"],
            [data]
        )

        const transaction = sendContract.call2(receiveContractAddress, oneEth, data)

        await expect(transaction)
            .to.emit(receiveContract, "ReceiptLog")
            .withArgs(sendContractAddress, oneEth, callData)

        const balance = await receiveContract.getBalance()
        expect(balance).to.equal(twoEth)
    })

    it("test the send function", async () => {

        await sendContract.send(receiveContractAddress, oneEth)

        const balance = await receiveContract.getBalance()

        expect(balance).to.equal(threeEth)
    })

    it("test the transfer function", async () => {

        await sendContract.transfer(receiveContractAddress, oneEth)

        const balance = await receiveContract.getBalance()

        expect(balance).to.equal(fourEth)
    })

    it("test the call function: it would be reverted if the amount is larger than 100 ether", async () => {
        const transaction = sendContract.call1(receiveContractAddress, twoHundredEth)

        await expect(transaction)
            .to.be.revertedWithCustomError(sendContract, "CallFailed")      // 验证是否触发自定义的错误
            .withArgs((data: any) => {
                expect(data).to.not.be.empty
                console.log("Error data:", data)                            // 打印 data 内容
                return true                                                 // 返回 true 表示验证通过
            })
    })

    it("test the send function: it would be reverted if the amount is larger than 100 ether", async () => {
        const transaction = sendContract.send(receiveContractAddress, twoHundredEth)

        await expect(transaction)
            .to.be.revertedWithCustomError(sendContract, "SendFailed")      // 验证是否触发自定义的错误
    })

    it("test the transfer function: it would be reverted if the amount is larger than 100 ether", async () => {
        const transaction = sendContract.transfer(receiveContractAddress, twoHundredEth)

        await expect(transaction).to.be.revertedWithoutReason()
    })


})