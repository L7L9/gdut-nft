// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract User{
    struct userProperty{
        string userName;

        address userAddress;

        uint256 money;

        bool isExist;
    }

    mapping(string => userProperty) userMap;

    mapping(address => string) addressToName;

    modifier userIsExist(string memory name){
        require(userMap[name].isExist,"user does not exist");
        _;
    }

    function signUp(string memory _userName,address _address) external{
        require(!userMap[_userName].isExist,"user has exist");
        userProperty memory user = userProperty({
            userName: _userName,
            userAddress: _address,
            money: 1000000,
            isExist: true
        });

        userMap[_userName] = user;
        addressToName[_address] = _userName;
    }

    function signIn(string memory _userName) external view userIsExist(_userName) returns(address){
        userProperty memory user = userMap[_userName];
        return user.userAddress;
    }

    function buy(uint256 price,address owner) external{
        require(userMap[addressToName[msg.sender]].money >= price,"you dont have enough money");

        userMap[addressToName[msg.sender]].money -= price;
        userMap[addressToName[owner]].money += price;
    }

    function getAddressByName(string memory _name) external view returns(address){
        return userMap[_name].userAddress;
    }

    function getUserInfoByAddress(address _userAddress) external view returns(string memory, uint256){
        return (userMap[addressToName[_userAddress]].userName, userMap[addressToName[_userAddress]].money);
    }

    function getMoney() external view returns(uint256){
        return userMap[addressToName[msg.sender]].money;
    }
}