// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// notion: upgradeable contract can not have the constructor !!
// storage  -->  proxy contract
// logic    -->  implementation contract
// Initializable contract to do something about storage !!

// 在Solidity中，可升级合约的核心原理是使用代理合约模式（Proxy Pattern），即通过将合约的逻辑与存储分离来实现。
// 这样即使逻辑合约发生变化，存储数据仍然保持不变，从而避免部署新的合约时数据丢失的问题。
// 1. 代理合约：代理合约负责与用户交互，同时转发调用到逻辑合约。它本身并不包含业务逻辑，只包含一个指向逻辑合约地址的存储变量。代理合约使用delegatecall将用户的调用转发给逻辑合约。
// 2. 逻辑合约：逻辑合约包含所有的业务逻辑函数。每次合约升级时，只需部署新的逻辑合约，而无需更改代理合约。代理合约通过存储的地址指向新的逻辑合约。
// 3. 存储数据分离：在使用delegatecall时，逻辑合约的函数在代理合约的上下文中执行，即使用代理合约的存储。这就确保了即使逻辑合约升级，原始的存储状态仍然保持不变。


// 下面的案例中，使用了 Transparent Proxy （透明代理模式）         透明代理是较为传统的升级模式，在OpenZeppelin的可升级合约库中很常见

// 特点
// 1. 代理合约持有逻辑合约的地址，并且通过delegatecall将调用转发给逻辑合约。
// 2. 升级逻辑由代理合约中的Admin控制，Admin可以通过专门的管理函数升级逻辑合约的地址。
// 3. 透明性是指Admin不能直接调用逻辑合约中的函数，代理合约会阻止这种调用以避免管理者意外影响逻辑执行。

// 优点：
// 1. 管理者和普通用户的角色清晰区分，避免了管理者意外执行逻辑合约中的功能。
// 2. 被广泛使用和审计，安全性相对成熟。

// 风险：
// 1. 代理合约较为复杂，Gas费用较高。
// 2. 管理逻辑和功能逻辑分离，增加了合约的复杂性。

contract LogicV1 {
    function sum(int256 _a, int256 _b) public pure returns(int256) {
        return _a + _b;
    }
}

contract LogicV2 {
    function sub(int256 _a, int256 _b) public pure returns(int256){
        return _a - _b;
    }
}

contract Store {
    int256 private result;

    function getResult() external view returns (int256) {
        return result;
    }

    function setResult(int256 _result) external {
        result = _result;
    }
}


event ResultStored(int256 result);


contract Proxy {
    address public logic;
    address public store;
    address public admin;

    modifier OnlyAdmin {
        require(msg.sender == admin, "You are not the admin");
        _;
    }

    constructor(address _logic, address _store, address _admin){
        logic = _logic;
        store = _store;
        admin = _admin;
    }

    function upgrade(address _newLogic) external OnlyAdmin{
        logic = _newLogic;
    }

    // 使用fallback函数转发所有调用
    // 当调用 proxy 合约中不存在的函数时，fallback函数会被调用，从而触发delegatecall
    fallback() external payable {

        // 检查调用者是否为管理员，防止管理员直接调用逻辑合约的函数
        // 确保管理员无法通过代理合约调用逻辑合约的业务函数。这就是透明性机制的核心，即管理员只能进行合约管理操作，不能影响合约的业务逻辑执行。
        require(msg.sender != admin, "Admin cannot directly call logic functions");

        // 获取参数并调用存储合约的setA和setB
        // msg.data[4:] 是一个切片操作，表示从 msg.data 字节数组的第 4 个字节开始提取数据。
        // 这里的 4 是因为在 Solidity 中，函数调用的前 4 个字节是函数选择器（function selector），用于指明被调用的函数
        // 举例：sum(int, int)，它的选择器是 bytes4(keccak256("sum(int256,int256)"))
        // (int a, int b) = abi.decode(msg.data[4:], (int, int));

        (bool success, bytes memory data) = logic.delegatecall(msg.data);

        require(success, "Delegatecall failed");

        int256 result = abi.decode(data, (int256));

        // 使用call方法调用存储合约的setResult函数
        // (bool storeSuccess, ) = store.call(abi.encodeWithSignature("setResult(int256)", result));
        // require(storeSuccess, "Failed to store result");
        
        Store(store).setResult(result);

        // 触发事件
        emit ResultStored(result);

        // 将返回的数据返回给调用者
        assembly {
            return(add(data, 0x20), mload(data))
        }
    }

    receive() external payable {}
}