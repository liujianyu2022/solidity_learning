import { loadFixture, impersonateAccount, stopImpersonatingAccount } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { ethers } from "hardhat"
import { expect } from "chai"
import { LogicV1, LogicV2, Store, Proxy } from "../../typechain-types"

const fixture = async () => {
    const logicV1Factory = await ethers.getContractFactory("LogicV1")
    const logicV2Factory = await ethers.getContractFactory("LogicV2")
    const storeFactory = await ethers.getContractFactory("Store")
    const proxyFactory = await ethers.getContractFactory("Proxy")

    return { logicV1Factory, logicV2Factory, storeFactory, proxyFactory }
}

describe("Transparent Proxy", function () {
    let logicV1: LogicV1
    let logicV2: LogicV2
    let store: Store
    let proxy: Proxy

    let logicV1Address: string
    let logicV2Address: string
    let storeAddress: string
    let proxyAddress: string

    let admin: any
    let other: any


    beforeEach(async () => {

        // 相当于 foundry 中的 vm.startPrank()
        const signers = await ethers.getSigners()
        admin = signers[0]
        other = signers[1]

        const { logicV1Factory, logicV2Factory, storeFactory, proxyFactory } = await loadFixture(fixture)

        logicV1 = await logicV1Factory.deploy()
        logicV2 = await logicV2Factory.deploy()
        store = await storeFactory.deploy()

        logicV1Address = await logicV1.getAddress()
        logicV2Address = await logicV2.getAddress()
        storeAddress = await store.getAddress()

        proxy = await proxyFactory.deploy(logicV1Address, storeAddress, admin.address)

        proxyAddress = await proxy.getAddress()
    })

    it("admin cannot call logic functions directly", async () => {
        const sumCalldata = logicV1.interface.encodeFunctionData("sum", [10, 20])

        // sendTransaction 返回的是一个 Promise，而 expect 可以直接对 Promise 进行断言
        const transactionPromise = admin.sendTransaction({
            to: proxyAddress,
            data: sumCalldata
        })

        await expect(transactionPromise).to.be.revertedWith("Admin cannot directly call logic functions");
    })

    it("other user can call logic functions and store result", async () => {
        const sumCalldata = logicV1.interface.encodeFunctionData("sum", [10, 20])

        await ethers.provider.send("hardhat_impersonateAccount", [other.address])           // 模拟 'other' 账户的身份, 这是方式1

        // call 是只读操作，虽然可以获取返回值，但是不会触发状态变更, 它不会修改链上状态。
        // 因此，Store 合约中的 setResult 函数不会被调用，result 变量也不会被更新
        // const result = await otherSigner.call({
        //     to: proxyAddress,
        //     data: sumCalldata,
        // })

        // sendTransaction 会触发状态变更，但是不能直接获取函数调用的返回值
        // 因此需要结合event一起进行验证
        const tx = await other.sendTransaction({                                          // 使用 'other' 账户发送交易
            to: proxyAddress,
            data: sumCalldata,
        })

        const receipt = await tx.wait()                                                    // 等待交易上链

        const storedResult = await store.getResult()
        expect(storedResult).to.equal(10 + 20)

        // 解析事件日志，获取返回值
        const eventTopic = ethers.id("ResultStored(int256)")
        const eventLog = receipt.logs.find((log: any) => log.topics[0] === eventTopic)

        expect(eventLog).to.not.be.undefined;                                              // 确保事件被触发

        const decodedEvent = proxy.interface.decodeEventLog(                               // 解码事件数据
            "ResultStored",
            eventLog!.data,
            eventLog!.topics
        );

        expect(decodedEvent.result).to.equal(10 + 20)                                     // 确认事件中的返回值是否正确
    })


    it("other user cannot upgrade the logic contract", async () => {
        await ethers.provider.send("hardhat_impersonateAccount", [other.address]);

        // await expect(
        //     proxy.connect(other).upgrade(logicV2Address)
        // ).to.be.revertedWith("You are not the admin")

        // 下面这是一个合约调用，但它实际上返回的是一个 Transaction Response（即一个 Promise）
        const upgradePromise = proxy.connect(other).upgrade(logicV1Address)

        await expect(upgradePromise).to.be.revertedWith("You are not the admin")
    })


    it("admin can upgrade the logic contract", async () => {
        await proxy.connect(admin).upgrade(logicV2Address)                                // 指定 admin 来发送交易

        const newLogic = await proxy.logic()
        expect(newLogic).to.equal(logicV2Address)

        const subCalldata = logicV2.interface.encodeFunctionData("sub", [10, 20])

        await impersonateAccount(other.address)                                         // 模拟 other 用户地址，这是方式2

        // sendTransaction 会触发状态变更, 但无法直接获取返回值
        const tx = await other.sendTransaction({                                        // 使用 'other' 账户发送交易
            to: proxyAddress,
            data: subCalldata
        })

        const receipt = await tx.wait()
        const storedResult = await store.getResult();

        expect(storedResult).to.equal(10 - 20)

        const eventTopic = ethers.id("ResultStored(int256)")
        const eventLog = receipt.logs.find((log: any) => log.topics[0] === eventTopic)

        expect(eventLog).to.not.be.undefined;                                              // 确保事件被触发

        const decodedEvent = proxy.interface.decodeEventLog(                               // 解码事件数据
            "ResultStored",
            eventLog!.data,
            eventLog!.topics
        );

        expect(decodedEvent.result).to.equal(10 - 20)                                      // 确认事件中的返回值是否正确

        await stopImpersonatingAccount(other.address)                                      // 停止模拟 other 用户地址
    })

})
