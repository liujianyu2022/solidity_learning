// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct User {
    address parent;                     // 上级用户地址
    address[] children;                 // 下级用户地址列表
    uint256 balance;                    // 用户余额
}

contract MultipleLevelMarketing {
    mapping(address => User) public users;          // 用户地址到用户结构的映射

    // 添加用户并设置上级
    function addUser(address userAddress, address parentAddress) public {
        require(users[userAddress].parent == address(0), "User already exists");

        users[userAddress].parent = parentAddress;

        if (parentAddress != address(0)) {
            users[parentAddress].children.push(userAddress);
        }
    }

    // 更新用户余额
    function updateBalance(address userAddress, uint256 amount) public {
        users[userAddress].balance += amount;
    }

    // 递归在Solidity中可能会导致栈溢出问题，使用迭代的方式来实现
    // 下面属于前序遍历，首先访问当前节点（currentUser），并将其余额累加到 totalBalance 中。然后将当前节点的所有子节点压入栈中，以便后续访问
    function calculateTotalBalance(address user) public view returns (uint256) {
        uint256 totalBalance = 0;
        address[] memory stack = new address[](1);
        stack[0] = user;

        while (stack.length > 0) {
            address currentUser = stack[stack.length - 1];
            stack = pop(stack);                                 // 弹出当前元素
            
            totalBalance += users[currentUser].balance;
            
            for (uint256 i = 0; i < users[currentUser].children.length; i++) {
                stack = push(stack, users[currentUser].children[i]);        // 把当前元素的子节点添加到栈里面
        }
    }

        return totalBalance;
    }

    // 将一个新元素（子节点）压入栈中，并返回更新后的栈
    function push(address[] memory array, address element) private pure returns (address[] memory) {
        address[] memory newArray = new address[](array.length + 1);
        for (uint256 i = 0; i < array.length; i++) {
            newArray[i] = array[i];
        }
        newArray[array.length] = element;
        return newArray;
    }

    // 从栈中移除栈顶元素，并返回更新后的栈
    function pop(address[] memory array) private pure returns (address[] memory) {
        address[] memory newArray = new address[](array.length - 1);
        for (uint256 i = 0; i < newArray.length; i++) {
            newArray[i] = array[i];
        }
        return newArray;
    }
}
