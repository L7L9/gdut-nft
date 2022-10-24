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
    }

    function signIn(string memory _userName) external view userIsExist(_userName) returns(address){
        userProperty memory user = userMap[_userName];
        return user.userAddress;
    }
}