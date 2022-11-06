// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Notice{
    struct notice{
        string title;
        string des;
        uint date;
        address user;
        uint8 noticeType;
        bool isExist;
    }

    modifier checkIsExist(uint id){
        require(noticeMap[id].isExist,"this notice is not exist");
        _;
    }

    uint amount = 0;

    mapping(uint => notice) noticeMap;

    function createNotice(string memory _title,string memory _des,uint8 _type) external{
        notice memory newNotice = notice({
            title: _title,
            des: _des,
            date: block.timestamp,
            user: msg.sender,
            noticeType: _type,
            isExist: true
        });
        noticeMap[amount] = newNotice;
        amount++;
    }

    function getNotice(uint id) external view checkIsExist(id) returns(string memory,string memory,uint,address){
        notice memory returnNotice = noticeMap[id];
        return (returnNotice.title,returnNotice.des,returnNotice.date,returnNotice.user);
    }

    function getAmount() external view returns(uint){
        return amount;
    }
}