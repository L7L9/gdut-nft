import Web3 from "web3";
const ipfsAPI = require('ipfs-api');

import factoryArtifact from "../../build/contracts/Factory.json";
import activityArtifact from "../../build/contracts/Activity.json";
import userArtifact from "../../build/contracts/User.json";

import {message} from 'antd'

//web3实例
var web3 = null;
//factory合约实例
var factory = null;
//artivity合约实例
var activity = null;
//user合约实例
var userSolidity = null;
//ipfs实例
var ipfs = null;
//当前账户address
var account = null;
//nft链下数据库
var nftDB = new PouchDB("nft_db");
//activty链下数据库
var activityDB = new PouchDB("activity_db");

// nftDB.destroy();
// activityDB.destroy();

const init = {
    getAccount: async function(){
        account = sessionStorage.getItem("account");
    },
    getSolidityObject: async function(){
        const networkId = await new web3.eth.net.getId();
        factory = new web3.eth.Contract(
            factoryArtifact.abi,
            factoryArtifact.networks[networkId].address
        );
        activity = new web3.eth.Contract(
            activityArtifact.abi,
            activityArtifact.networks[networkId].address
        );
        userSolidity = new web3.eth.Contract(
            userArtifact.abi,
            userArtifact.networks[networkId].address
        );
    },
    getIpfs: async function(){
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    }
}

const accountModel = {
    defaultAccountNum: 1,
    getEth: async function(name){
        const { getAddressByName } = userSolidity.methods;

        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[this.defaultAccountNum];
        var address = await getAddressByName(name).call({from:defaultAccount});
        if(this.defaultAccountNum == 10){
            this.defaultAccountNum = 1;
        } else {
            this.defaultAccountNum += 1;
        }
        var _transfer = {
            from:defaultAccount,
            to:address,
            value: web3.utils.toWei('1','ether')
        };
        await web3.eth.sendTransaction(_transfer);
    },
    login: async function (userName, password) {
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        const { signIn } = userSolidity.methods;
        var address = await signIn(userName).call({from:defaultAccount});

        await web3.eth.personal.unlockAccount(address,password,10).then((res,err) =>{
                if(err){
                    message.error("密码错误", 1);
                    sessionStorage.setItem('islogin',false)
                    throw err;
                }
                if (res == true) {
                    sessionStorage.setItem("account",address);
                    account = address;
                    message.success("登陆成功", 1);
                    sessionStorage.setItem('islogin',true)
                }
        })
    },
    register: async function(userName,password){
        const { signUp } = userSolidity.methods;
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        web3.eth.personal.newAccount(password).then(async function(res,err){
            if(err) throw err;
            
            await signUp(userName,res).send({
                from: defaultAccount,
                gas: 1000000
            }).on('error',function(error,receipt){
                message.info("用户名重复",1);
                throw error;
            })
        }).then(res=>{
            this.getEth(userName);
            message.success("注册成功,返回登陆页面",1);
            setTimeout(() => {
                window.location.replace("http://localhost:8081");
            },1000)
        })
    },
    logout: async function(){
        account = null;
        sessionStorage.removeItem("account");
        window.location.replace("http://localhost:8081");
    }
}

const nftModel = {
    setNftStatus: async function(status,price){
        const { setStatus } = factory.methods;

        if(!status){
            price = 0;
        }
        await setStatus(status,price).send({
            from:account,
            gas:1000000
        }).on('error',function(error,receipt){
            console.log("可能状态没变,查看error");
            throw error;
        }).then(function(res){
            console.log(res);
            message.success("设置成功");
        })
    },
    //创建nft
    create: async function(name0,des0,price,status,file0){
        const { mint } = factory.methods;

        var file = file0;
        var name = name0;
        var des = des0;

        var tokenId = null;
        if (file.length != 0) {
            //将文件存入ipfs中并获取cid
            var cid = null;
            var reader = new FileReader();
            //读取文件转为buffer以上传
            reader.readAsArrayBuffer(file[0]);
            reader.onloadend = async function(){
                // console.log(reader.result);
                var img = Buffer.from(reader.result);
                // console.log("前："+img);
                var cids = await ipfs.add(img);
                //返回的cid
                cid = cids[0].hash;
                // console.log("cid:" + cid);
                tokenId = web3.utils.sha3(name + cid);
                if(!status){
                    price = 0;
                }
                console.log(price);
                console.log(status);
                await mint(tokenId,name,cid,des,0,price,status).send({
                    from: account,
                    gas: 1000000
                }).on('error', function (error, receipt) {
                    throw error;
                });
                var doc = {
                    _id : tokenId,
                    name : name,
                    cid : cid,
                    message : des,
                    author : account,
                    activityId : 0
                }
                nftDB.put(doc, function(err, response) {
                    if (err) {
                        return console.log(err);
                    } else {
                        console.log("Document created Successfully");
                        return new Promise((reslove,reject)=> {
                            reslove(true)
                        });
                    }
                })
                // await nftModel.mint(name, des, cid, 1, 0).then(() => {
                //     return new Promise((reslove,reject)=> {
                //         reslove(true)
                //     });
                // });
            }
        } else {
            // console.log(file.length);
            return new Promise((reslove,reject) => {
                reject(false)
            });
        }
    },
    //赠送
    give: async function(){
        var tokenId = prompt("请输入要送出nft的tokenId:","请在此输入");
        if(tokenId != null){
            var to = prompt("请输入要送给的账户：","请在此输入");
            if(to != null){
                // console.log(tokenId);
                // console.log(to);
                const { give } = factory.methods;

                await give(to,tokenId).send({from:account,gas:1000000}).then(res=>{
                    console.log(res);
                });
                //刷新页面
                // pageModel.showMyNFT();
            }
        } 
    },
    // buyNft: async function(){
    //     const { buy } = User.methods;
    //     const { give } = factory.methods;
    // },
    //搜索
    search: async function (value) {
        var regExp = new RegExp('.*' + value + '.*', 'i');
        var content;
        var url;
        var res = [];
        var ipfsResult;
        const res1=await nftDB.find({
            selector: {
                name:{"$regex": regExp},
            },
        }).then(async function(result){
            for (let i = 0; result.docs[i] != null; i++){
                console.log(result.docs[i])
                ipfsResult = await ipfs.get(result.docs[i].cid);
                content = ipfsResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                res.push({
                    url,
                    tokenId: result.docs[i]._id,// res[0]//tokenId
                    cid: result.docs[i].cid,// res[1]//ipfs中的cid
                    nftname: result.docs[i].name, // res[2]//nft名字
                    author: result.docs[i].author,// res[3]//作者
                    des: result.docs[i].message,// res[4]//nft描述
                    number:result.docs[i].status// res[5]//是否是活动的nft: 0=>不是活动发行  其他=>活动发行
                })
            }
            console.log(res);
            return new Promise(reslove => {
                reslove(res)
            })
        })
        return res1;
    }
}

const activityModel = {
    //创建活动
    initiateActivity: async function(name,message1,amount,password,nftName,nftMessage){
        console.log(amount);
        const { initiate } = activity.methods;
        const { getActivityAmount } = activity.methods;
        var file = document.querySelector("#anft").files;

        var cid = null;

        var activityId = await getActivityAmount().call({from:account});

        if (file.length !== 0) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file[0]);
            reader.onloadend = async function(){
                // console.log(reader.result);
                var img = Buffer.from(reader.result);
                // console.log("前："+img);
                var cids = await ipfs.add(img);
                //获取cid
                cid = cids[0].hash;

                await initiate(name,message1,amount,cid,password,nftName,nftMessage)
                .send({
                    from:account,
                    gas: 1000000
                    })
                .on('error',function(error,receipt){
                    console.log("创建失败");
                    throw error;
                }).then(function(res){
                    console.log(res);
                    var doc = {
                        _id:activityId,
                        name:name,
                        message:message1,
                        amount:amount,
                        cid:cid,
                        nftName:nftName,
                        nftMessage:nftMessage
                    }
                    activityDB.put(doc, function(err, response) {
                        if (err) {
                            return console.log(err);
                        } else {
                            console.log("Document created Successfully");
                            return new Promise((reslove, reject) => {
                                message.success("创建活动成功");
                                reslove(true)
                            })
                        }
                    })
                })
            }
        } else {
            return new Promise((reslove, reject) => {
                message.error('创建失败，你没有选择文件',1)
                reject(false)
            })
        }

        // if (file.length !== 0) {
        //     var reader = new FileReader();
        //     reader.readAsArrayBuffer(file[0]);
        //     reader.onloadend = async function(){
        //     // console.log(reader.result);
        //     var img = Buffer.from(reader.result);
        //     // console.log("前："+img);
        //     var cids = await ipfs.add(img);
        //     //获取cid
        //     cid = cids[0].hash;
        //     // var activityId = await getActivityAmount().call({from:account});
        //     // nftModel.mint(nftName,nftMessage,cid,amount,activityId);

        //     const accounts = await web3.eth.getAccounts();
        //     var defaultAccount = accounts[0];
        //     // console.log(defaultAccount);  

        //     var doc = {
        //         _id:activityId,
        //         name:name,
        //         message:message1,
        //         amount:amount,
        //         cid:cid,
        //         nftName:nftName,
        //         nftMessage:nftMessage
        //     }
        //     activityDB.put(doc, function(err, response) {
        //         if (err) {
        //             return console.log(err);
        //         } else {
        //             console.log("Document created Successfully");
        //         }
        //     }).then(
        //         await web3.eth.sendTransaction({
        //         from:defaultAccount,
        //         to:account,
        //         value: web3.utils.toWei('1','ether')
        //     })).then(
        //         await initiate(name,message1,amount,cid,password).send({
        //         from:account,
        //         gas:1000000
        //     }).then(res=>{
        //         console.log(res);
        //         return new Promise((reslove, reject) => {
        //             message.success("创建活动成功");
        //             reslove(true)
        //         })
        //         //刷新活动页面
        //     }))
        //     }
        // } else {
        //     return new Promise((reslove, reject) => {
        //         message.error('创建失败，你没有选择文件',1)
        //         reject(false)
        //     })
        // }
    },

    //领取活动nft
    getNFT: async function(id,password){
        if(password.trim() != ''){
            const { getActivityNFT } = activity.methods;
            // const { give } = factory.methods;
            const { mint } = factory.methods;
            var tokenId = null;
            //0=>cid  1=>nft索引 2=>nft名字  3=>nft描述 
            await getActivityNFT(id,password).call({from:account}).then(async function(res){
                console.log(res[1]);
                await getActivityNFT(id,password).send({
                    from:account,
                    gas:1000000
                }).on('error',function(error,receipt){
                    console.log("nft可能被领完,查看error");
                    throw error;
                }).then(async function(){
                    console.log(res);
                    tokenId = web3.utils.sha3(res[2] + res[1] + res[0]);
                    await mint(tokenId,res[2],res[0],res[3],id,0,false).send({
                        from:account,
                        gas:1000000
                    })
                }).then(()=>{
                    var doc = {
                        _id : tokenId,
                        name : res[2],
                        cid : res[0],
                        message : res[3],
                        author : account,
                        activityId : id
                    }
                    nftDB.put(doc, function(err, response) {
                        if (err) {
                            return console.log(err);
                        } else {
                            console.log("Document created Successfully");
                            return new Promise((reslove,reject)=> {
                                reslove(true)
                            });
                        }
                    })
                })  
            })
        }
        else message.error('您没有密钥或输入的密钥为空字符串',1)
        // // console.log(num);
        // //获取输入的领取密钥
        // if(password.trim() != ''){
        //     const { getActivityNFT } = activity.methods;
        //     const { give } = factory.methods;
        //     //活动id
        //     // var activityId = document.getElementById("activityId"+num).innerText;
        //     var activityId = id;
        //     console.log(activityId);
            
        //     //转入以太以便调用方法
        //     const accounts = await web3.eth.getAccounts();
        //     var defaultAccount = accounts[0];
        //     // console.log(defaultAccount);  

        //     await web3.eth.sendTransaction({
        //         from:defaultAccount,
        //         to:account,
        //         value: web3.utils.toWei('1','ether')
        //     });

        //     await getActivityNFT(activityId,password).call().then(async function(res){
        //         console.log(res);

        //         var tokenId = web3.utils.sha3(res[0] + res[1]); 

        //         await web3.eth.sendTransaction({
        //             from:defaultAccount,
        //             to:res[2],
        //             value: web3.utils.toWei('1','ether')
        //         });
        //         await give(account,tokenId).send({
        //             from:res[2],
        //             gas:1000000
        //         }).then((res)=>{
        //             console.log(res);
        //         })
        //     })
        //     await getActivityNFT(activityId,password).send({
        //         from:account,
        //         gas:1000000
        //     }).on("receipt",function(receipt){
        //         console.log(receipt);
        //     })
        // }
        // else message.error('您没有密钥或输入的密钥为空字符串',1)
    },
    //搜索活动
    search: async function(value){
        var regExp = new RegExp('.*' + value + '.*', 'i');
        var res = [];
        var res1=await activityDB.find({
            selector: {
                name:{"$regex": regExp},
            },
        }).then(function(result){
            for(let i=0;result.docs[i]!=null;i++){
                // _id,name,message,amount,cid,nftName,nftMessage
                res.push({
                    id:result.docs[i]._id,
                    name:result.docs[i].name,
                    message:result.docs[i].message,
                    number:result.docs[i].amount,
                    cid:result.docs[i].cid,
                    nftname:result.docs[i].nftName,
                    des:result.docs[i].nftMessage,
                })
            }
            return new Promise(reslove => {
                reslove(res)
            })
        })
        return new Promise((reslove) => {
            reslove(res1)
        })
    }
}

const pageModel = {
    showNumber: 4,

    indexId: 0,

    activityHomeIndex: 1,

    /**
     * 返回用户个人信息
     */
    showMe: async function(){
        const { getUserInfoByAddress } = userSolidity.methods;
        var result = await getUserInfoByAddress(account).call();
        var info = [];
        info.push(result[0]);//用户名
        info.push(account);//用户链上id
        info.push(result[1]);//拥有的money
        return info;
    },

    showMyNFT: async function(){
        const { getPersonalNFT } = factory.methods;
        const { balanceOf } = factory.methods;

        //获取个人拥有的nft数量
        var amount = await balanceOf(account).call();

        //用于接受文件内容
        var content = null;
        //用于获取ipfs中的cid
        var cid = null;
        //用于获取url
        var url = null;

        var result = [];
        if(amount > 0){
            for(let i = 0; i < amount; i++){
                await getPersonalNFT(i).call({from:account}).then((res)=>{

                    cid = res[1];
                    ipfs.get(cid,function(err,files){
                        if(err) throw err;
                        //nft图片
                        content = files[0].content;
                        url = window.URL.createObjectURL(new Blob([content]))

                        result.push({
                            url,
                            tokenId: res[0],
                            cid: res[1],
                            nftname: res[2],
                            author: res[3],
                            des: res[4],
                            number:res[5]
                        })
                        //将res中数据渲染到前端
                        // res[0]//tokenId
                        // res[1]//ipfs中的cid
                        // res[2]//nft名字
                        // res[3]//作者
                        // res[4]//nft描述
                        // res[5]//是否是活动的nft: 0=>不是活动发行  其他=>活动发行 
                    })       
                })
            }
        } 

        return new Promise((reslove, reject) => {
            reslove(result)
        })
    },

    showAllNFT: async function(){
        const { getNFTAmount } = factory.methods;
        //获取查询信息的方法
        const { getProperty } = factory.methods;
        //获取nft总量
        var NFTAmount = await getNFTAmount().call();

        var result = [];
        if (NFTAmount > 0) {
            //用于接受文件内容
            var content = null;
            //用于获取ipfs中的cid
            var cid = null;
            //用于获取url
            var url = null;

            for (let num1 = 0; num1 < NFTAmount; num1++) {
                var res = await getProperty(num1).call();
                cid = res[1];
                await ipfs.get(cid, function (err, files) {
                    if (err) throw err;

                    //nft图片
                    content = files[0].content;
                    url = window.URL.createObjectURL(new Blob([content]));
                    result.push(
                        {
                            url,
                            tokenId: res[0],
                            cid: res[1],
                            nftname: res[2],
                            author: res[3],
                            nftdes: res[4],
                            nft: res[5]
                        });
                    // res[0]//tokenId
                    // res[1]//ipfs中的cid
                    // res[2]//nft名字
                    // res[3]//作者
                    // res[4]//nft描述
                    // res[5]//是否是活动的nft: 0=>不是活动发行  其他=>活动发行 
                })
            }
        }
        return new Promise((reslove, reject) => {
            reslove (result)
        });
    }, 

    showAllActivities: async function(){
        const { getActivityAmount } = activity.methods;

        //获取活动总量
        var amount = await getActivityAmount().call();
        var result = [];
        if(amount > 1){
            const { getActivityProperty } = activity.methods;
            var res = null;
            var content = null;
            var url = null;
            var getResult = null;
            for(let num = 1;num < amount; num++){
                res = await getActivityProperty(num).call();
                getResult = await ipfs.get(res[4]);
                //res: 0=>活动名  1=>活动描述  2=>活动id  3=>活动发起者 4=>该活动nft的cid 5=>该活动发行nft数量
                // console.log(getResult);
                // nft图片
                content = getResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                
                result.push({
                    url,
                    name: res[0],
                    des: res[1],
                    id: res[2],
                    person: res[3],
                    nftcid: res[4],
                    number:res[5]
                });
            }
            
        }
        return new Promise((reslove, reject) => {
            reslove(result)
        })
    },

    //图片预览
    preview: async function(){
        var files = document.querySelector("#nft").files;
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onloadend = async function(){
            console.log(reader.result);
            var file = Buffer.from(reader.result);

            var url = window.URL.createObjectURL(new Blob([file]));

            var img = document.getElementById("nftShower");
            img.src = url;
        }
    },
    apreview: async function(){
        var files = document.querySelector("#anft").files;
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onloadend = async function(){
            console.log(reader.result);
            var file = Buffer.from(reader.result);

            var url = window.URL.createObjectURL(new Blob([file]));

            var img = document.getElementById("anftShower");
            img.src = url;
        }
    },

    getMaxHomePage: function(){
        const { getNFTAmount } = factory.methods;
        var amount = getNFTAmount().call();
        return amount;
    },
    
    getMaxPersonalPage: async function(){
        const { balanceOf } = factory.methods;
        var amount = balanceOf(account).call();
        return amount;
    }
}

window.accountModel = accountModel;
window.nftModel = nftModel;
window.pageModel = pageModel;
window.activityModel = activityModel;

window.onload = async function(){
    web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );
    
    //获取合约实例
    await init.getSolidityObject();
    
    //获取ipfs实例
    await init.getIpfs();
    
    //获取当前账号address
    await init.getAccount();
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HashRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </HashRouter>)