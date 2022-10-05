import Web3 from "web3";
const ipfsAPI = require('ipfs-api');

import factoryArtifact from "../../build/contracts/Factory.json";
import activityArtifact from "../../build/contracts/Activity.json";

//web3实例
var web3 = null;
//factory合约实例
var factory = null;
//artivity合约实例
var activity = null;
//ipfs实例
var ipfs = null;
//当前账户
var account = null;
//用户数据库(用于配对用户名和用户链上id)
var userDB = new PouchDB("user_db");
//nft链下数据库
var nftDB = new PouchDB("nft_db");
//activty链下数据库
var activityDB = new PouchDB("activity_db");

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
        )
    },
    getIpfs: async function(){
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    }
}

const accountModel = {
    login: async function(){
        var userName = document.getElementById("userName").value;
        var password = document.getElementById("password").value;
        var tempAccount = null;
        if((""!=userName)&&(""!=password)){
            userDB.find({
                selector: {
                    userName : userName
                },
            }).then(async (result)=>{
                if(null!=result.docs[0]){
                    try{
                        tempAccount = result.docs[0]._id;
                        await web3.eth.personal.unlockAccount(tempAccount,password,10).then((res,err) =>{
                            if(err)throw err;
                            if(res == true){
                                sessionStorage.setItem("account",tempAccount);
                                account = tempAccount;
                                alert("登陆成功");
                                //跳转到登陆页面
                                window.location.replace("http://localhost:8081/home.html");
                            }
                        })
                    } catch (err) {
                        alert("密码错误");
                    }
                }else alert("账号不存在");
            })
        }else alert("用户名和密码不能为空")
    },

    register: async function(){
        var userName = document.getElementById("userName").value;
        var password = document.getElementById("password").value;//密码

        if((""!=userName)&&(""!=password)){
            userDB.find({
                selector: {
                    userName : userName
                },
            }).then(async (result)=>{
                if(null!=result.docs[0]){
                    alert("用户名重复");
                }else{
                    try {
                        web3.eth.personal.newAccount(password).then(function(res,err){
                            if(err)throw err;
                            //优化交互体验
                            var doc = {
                                _id : res,//用户链上id
                                userName : userName//用户名
                            }
                            userDB.put(doc, function(err, response) {
                                if (err) {
                                    throw err;
                                } else {
                                    alert("注册成功,即将返回登陆页面");
                                    window.location.replace("http://localhost:8081");
                                }
                            });
                        })
                    } catch (err) {
                        alert("注册失败，再试试？")
                    }
                }
            })
        } else {
            alert("用户名和密码不能为空")
        }
    },
    logout: async function(){
        account = null;
        sessionStorage.removeItem("account");
        window.location.replace("http://localhost:8081");
    }
}

const nftModel = {
    //创建nft
    create: async function(){
        var file = document.querySelector("#nft").files;
        var name = document.getElementById("nftName").value;
        var message = document.getElementById("nftMessage").value;
        
        //将文件存入ipfs中并获取cid
        var cid = null;
        var tokenId = null;
        // console.log(file[0]);
        var reader = new FileReader();
        //读取文件转为buffer以上传
        reader.readAsArrayBuffer(file[0]);
        reader.onloadend = async function(){
            // console.log(reader.result);
            var img = Buffer.from(reader.result);
            // console.log("前："+img);
            var cids = await ipfs.add(img);

            cid = cids[0].hash;
            // console.log("cid:" + cid);
            
            tokenId = web3.utils.sha3(cid);
            await nftModel.mint(name,message,cid,1,0);
            alert("创建成功");
            window.location.replace("http://localhost:8081/home.html");
        }
        
    },

    //铸造nft
    mint: async function(name,message,cid,amount,status){
        console.log(amount);
        //转入以太以便使用
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        var _transfer = {
            from:defaultAccount,
            to:account,
            value: web3.utils.toWei('1','ether')
        };

        await web3.eth.sendTransaction(_transfer);
        //调用合约的铸造方法
        const { mint } = factory.methods;
        for(let i = 0;i < amount;i++){
            var tokenId = web3.utils.sha3(cid+i);
            await mint(tokenId,name,cid,message,status).send({
                from: account,
                gas: 1000000
            }).then((res) =>{
                console.log(res);
            })
            var doc = {
                _id : tokenId,
                name : name,
                cid : cid,
                message : message,
                author : account,
                status : status
            }
            nftDB.put(doc, function(err, response) {
                if (err) {
                    return console.log(err);
                } else {
                      console.log("Document created Successfully");
                }
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
                //转入以太以便调用方法
                const accounts = await web3.eth.getAccounts();
                var defaultAccount = accounts[0];
                // console.log(defaultAccount);  
                var _transfer = {
                    from:defaultAccount,
                    to:account,
                    value: web3.utils.toWei('1','ether')
                };

                await web3.eth.sendTransaction(_transfer);

                await give(to,tokenId).send({from:account,gas:1000000}).then(res=>{
                    console.log(res);
                });
                //刷新页面
                pageModel.showMyNFT();
            }
        } 
    },
    //搜索
    search: async function(value){
        var regExp = new RegExp('.*' + value + '.*', 'i');
        nftDB.find({
            selector: {
                name:{"$regex": regExp},
                status:0
            },
        }).then(function(result){
            for(let i=0;result.docs[i]!=null;i++){
                console.log(result.docs[i]._id);
            }
        })
    }
}

const activityModel = {
    //创建活动
    initiateActivity: async function(){
        const { initiate } = activity.methods;
        const { getActivityAmount } = activity.methods;
        //活动名字
        var name = document.getElementById("activityName").value;
        //活动描述
        var message = document.getElementById("activityMessage").value;
        //nft奖品数量
        var amount = document.getElementById("nftAmount").value;
        //领取nft的密钥
        var password = document.getElementById("password").value;

        //创建nft
        var nftName = document.getElementById("nftName").value;
        var file = document.querySelector("#nft").files;
        var nftMessage = document.getElementById("nftMessage").value;

        var cid = null;

        var reader = new FileReader();
        reader.readAsArrayBuffer(file[0]);
        reader.onloadend = async function(){
            // console.log(reader.result);
            var img = Buffer.from(reader.result);
            // console.log("前："+img);
            var cids = await ipfs.add(img);

            cid = cids[0].hash;
            var activityId = await getActivityAmount().call({from:account});
            nftModel.mint(nftName,nftMessage,cid,amount,activityId);

            const accounts = await web3.eth.getAccounts();
            var defaultAccount = accounts[0];
            // console.log(defaultAccount);  

            var doc = {
                _id:activityId,
                name:name,
                message:message,
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
                }
            }).then(
                await web3.eth.sendTransaction({
                from:defaultAccount,
                to:account,
                value: web3.utils.toWei('1','ether')
            })).then(await initiate(name,message,amount,cid,password).send({
                from:account,
                gas:1000000
            }).then(res=>{
                console.log(res);
                alert("创建活动成功");
                //刷新活动页面
            }))
        }
    },

    //领取活动nft
    getNFT: async function(num){
        console.log(num);
        //获取输入的领取密钥
        var password = prompt("请输入领取密钥:","请在此输入");
        if(password != null){
            const { getActivityNFT } = activity.methods;
            const { give } = factory.methods;
            //活动id
            var activityId = document.getElementById("activityId"+num).innerText;
            console.log(activityId);
            
            //转入以太以便调用方法
            const accounts = await web3.eth.getAccounts();
            var defaultAccount = accounts[0];
            // console.log(defaultAccount);  

            await web3.eth.sendTransaction({
                from:defaultAccount,
                to:account,
                value: web3.utils.toWei('1','ether')
            });

            await getActivityNFT(activityId,password).call().then(async function(res){
                console.log(res);

                var tokenId = web3.utils.sha3(res[0] + res[1]); 

                await web3.eth.sendTransaction({
                    from:defaultAccount,
                    to:res[2],
                    value: web3.utils.toWei('1','ether')
                });
                await give(account,tokenId).send({
                    from:res[2],
                    gas:1000000
                }).then((res)=>{
                    console.log(res);
                })
            })
            await getActivityNFT(activityId,password).send({
                from:account,
                gas:1000000
            }).on("receipt",function(receipt){
                console.log(receipt);
            })
        }
    },
    //搜索活动
    search: async function(value){
        var regExp = new RegExp('.*' + value + '.*', 'i');
        activityDB.find({
            selector: {
                name:{"$regex": regExp},
            },
        }).then(function(result){
            for(let i=0;result.docs[i]!=null;i++){
                // _id,name,message,amount,cid,nftName,nftMessage
                console.log(result.docs[i].name);
            }
        })
    }
}

const pageModel = {
    showNumber: 4,

    indexId: 0,

    activityHomeIndex: 1,

    showMyNFT: async function(){
        const { getPersonalNFT } = factory.methods;
        const { balanceOf } = factory.methods;

        //获取个人拥有的nft数量
        var amount = await balanceOf(account).call();
        //计算出最大页数
        var maxPage = (amount % this.showNumber == 0)?(amount / this.showNumber):(Math.ceil(amount / this.showNumber));
        // console.log(maxPage);
        //获取页面的当前页数
        var page = document.getElementById("page").innerText;
        
        //实际展示数量
        var trueNum = this.showNumber * page;
        if(page == maxPage && (amount % this.showNumber) != 0 ){
            trueNum = (page - 1) * this.showNumber + amount % this.showNumber;
            for(let i = amount % this.showNumber; i < this.showNumber;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
        }

        //用于接受文件内容
        var content = null;
        //用于获取ipfs中的cid
        var cid = null;
        //用于获取url
        var url = null;
        //用于记录第几个的临时变量
        var num = 0;
        if(amount > 0){
            for(let i = (page-1) * this.showNumber;i < trueNum;i++){
                await getPersonalNFT(i).call({from:account}).then((res)=>{
                    //将res中数据渲染到前端
                    //获取图片信息
                    //res: 0=>tokenId  1=>cid  2=>name 3=>author 4=>description
                    // console.log(res);
                    cid = res[1];
                    ipfs.get(cid,function(err,files){
                        if(err) throw err;
                        content = files[0].content;
                        url = window.URL.createObjectURL(new Blob([content]));
                        var img = document.getElementById("num"+num);
                        img.src = url;
                        document.getElementById("id"+num).innerText="tokenId："+web3.utils.toHex(res[0]);
                        document.getElementById("name"+num).innerText="nft名称："+res[2];
                        document.getElementById("description"+num).innerText="nft描述："+res[4];
                        num++;
                    })       
                })
            }
        } else {
            for(let i = 0;i < 4;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
        }
    },

    showAllNFT: async function(){
        const { getNFTAmount } = factory.methods;
        const { getCountAmount } = activity.methods;
        const { getActivityNFTAmount } = activity.methods;

        var numberForCountAmount = await getCountAmount().call();
        console.log("用于计算的数："+numberForCountAmount);
        //获取nft总量
        var tempAmount = await getNFTAmount().call();
        console.log("总量:" + tempAmount);
        //获取真实显示数量
        var amount = tempAmount - numberForCountAmount;
        console.log("真实数量:" + amount);
        //获取页面的当前页数
        var page = document.getElementById("page").innerText;
        
        var maxHomePage = (amount % this.showNumber == 0)?(amount / this.showNumber):(Math.ceil(amount / this.showNumber));
        console.log("maxPage:"+maxHomePage);
        //获取查询信息的方法
        const { getProperty } = factory.methods;
        
        //实际展示数量
        var trueNum = this.showNumber;
        if(page == maxHomePage && (amount % this.showNumber) != 0 ){
            trueNum = amount % this.showNumber;
            for(let i = amount % this.showNumber; i < this.showNumber;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
            for(let i = 0;i<trueNum;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="block";
            }
        }
        console.log("展示数量: "+ trueNum);

        if(amount > 0){
            //用于接受文件内容
            var content = null;
            //用于获取ipfs中的cid
            var cid = null;
            //用于获取url
            var url = null;

            for(let num = 0;num < trueNum;num++){
                var res = await getProperty(this.indexId).call();
                cid = res[1];
                await ipfs.get(cid,function(err,files){
                    if(err) throw err;
                    content = files[0].content;
                    url = window.URL.createObjectURL(new Blob([content]));
                    var img = document.getElementById("num"+num);
                    img.src = url;
                    document.getElementById("name"+num).innerText = "name："+res[2];
                    document.getElementById("tokenId"+num).innerText = "tokenId："+web3.utils.toHex(res[0]);
                    document.getElementById("author"+num).innerText = "author："+res[3];
                    document.getElementById("description"+num).innerText = "nft描述："+res[4];
                })      
                if(res[5] != 0){
                    var addAmount = getActivityNFTAmount(res[5]).call();
                    this.indexId += addAmount;
                    document.getElementById("activityNFTAmount"+num).innerText = addAmount;
                } else {
                    this.indexId++;
                    document.getElementById("activityNFTAmount"+num).innerText = '1';
                }
                console.log(this.indexId);
            }
        } else {
            for(let i = 0;i < 4;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
        }
    },

    showAllActivities: async function(){
        const { getActivityAmount } = activity.methods;

        //获取活动总量
        var amount = await getActivityAmount().call() - 1;

        var maxPage = (amount % this.showNumber == 0)?(amount / this.showNumber):(Math.ceil(amount / this.showNumber));

        // //获取页面的当前页数
        var page = document.getElementById("page").innerText;

        //实际展示数量
        var trueNum = this.showNumber * page;
        if(page == maxPage && (amount % this.showNumber) != 0 ){
            trueNum = (page - 1) * this.showNumber + amount % this.showNumber;
            for(let i = amount % this.showNumber; i < this.showNumber;i++){
                var activityObj = document.getElementById("activity"+i);
                activityObj.style.display="none";
            }
        }

        if(amount > 0){
            const { getActivityProperty } = activity.methods;
            //用于接受查询结果
            //res: 0=>活动名  1=>活动描述  2=>活动id  3=>活动发起者
            var res = null;
            for(let num = 0;num < this.showNumber;num++){
                res = await getActivityProperty(this.activityHomeIndex).call();
                this.activityHomeIndex++;
                document.getElementById("name"+num).innerText = res[0];
                document.getElementById("host"+num).innerText = res[3];
                document.getElementById("description"+num).innerText = res[1];
                document.getElementById("activityId"+num).innerText = res[2];
                console.log(res[2]);
            }
        }else {
            for(let i = 0;i < 4;i++){
                var activityObj = document.getElementById("activity"+i);
                activityObj.style.display="none";
            }
        }
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
    init.getIpfs();

    init.getAccount();

    var url = window.location.href;
    if(url == "http://localhost:8081/home.html"){
        pageModel.showAllNFT();
    }
    if(url == "http://localhost:8081/myInformation.html"){
        pageModel.showMyNFT();
    }    
    if(url == "http://localhost:8081/activity.html"){
        pageModel.showAllActivities();
    }
}