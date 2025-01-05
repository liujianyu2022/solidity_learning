import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
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

        console.log("admin = ", admin.address)
        console.log("other = ", other.address)

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

    it("logicV1", async () => {

        // 编码调用逻辑合约 sum(int256,int256)
        const sumCalldata = logicV1.interface.encodeFunctionData("sum", [10, 20]);

        console.log("admin = ", admin.address)
        console.log("other = ", other.address)

        // 使用 call 代替 sendTransaction，确保调用者是非管理员账户
        // const result = await other.provider!.call({
        //     to: proxyAddress,
        //     data: sumCalldata,
        // });

        // 通过非 admin 账户（other）发起调用
        // const result = await other.sendTransaction({
        //     to: proxyAddress, // 目标地址是 Proxy 合约
        //     data: sumCalldata, // 编码后的方法和参数
        // });

        // 模拟 'other' 账户的身份
        await ethers.provider.send("hardhat_impersonateAccount", [other.address]);

        // 获取 'other' 账户的签名
        const otherSigner = await ethers.getSigner(other.address);

        // 使用 'other' 账户发送交易
        // const result = await otherSigner.sendTransaction({
        //     to: proxyAddress,   // 目标地址是 Proxy 合约
        //     data: sumCalldata,  // 编码后的方法和参数
        // });

        const result = await otherSigner.call({
            to: proxyAddress,
            data: sumCalldata,
        });

        // 等待交易被挖掘
        // await result.wait();

        // 解码返回的数据
        const decodedResult = logicV1.interface.decodeFunctionResult("sum", result);



        // // 解码返回的数据
        // const decodedResult = logicV1.interface.decodeFunctionResult("sum", result);

        // 获取 store 中保存的结果
        const storedResult = await store.getResult()

        console.log("storedResult = ", storedResult)
        console.log("result = ", result)

        // 监听 ResultStored 事件
        const logs = await ethers.provider.getLogs({
            address: proxyAddress,
            topics: [ethers.id("ResultStored(int256)")]
        });
        console.log("Event logs:", logs);

        // 确认逻辑正确性
        expect(decodedResult[0]).to.equal(30); // 10 + 20
        // expect(storedResult).to.equal(30);
    })

})
