import Web3 from "web3";
const ipfsAPI = require('ipfs-api');
import factoryArtifact from "../../build/contracts/Factory.json";

//web3实例
var web3 = null;
//factory合约实例
var factory = null;
//ipfs实例
var ipfs = null;
//当前账户
var account = null;

const init = {
    getAccount: async function(){
        account = localStorage.getItem("account");
    },
    getFactory: async function(){
        const networkId = await new web3.eth.net.getId();
        factory = new web3.eth.Contract(
            factoryArtifact.abi,
            factoryArtifact.networks[networkId].address
        );
    },

    getIpfs: async function(){
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    }
}

const accountModel = {
    login: async function(){
        var tempAccount = document.getElementById("account").value;
        var password = document.getElementById("password").value;

        web3.eth.personal.unlockAccount(tempAccount,password,10).then((res) =>{
            if(res == true){
                // sessionStorage.setItem("account",tempAccount);
                localStorage.setItem("account",tempAccount);
                account = tempAccount;
                alert("登陆成功");
                //跳转到登陆页面
                window.location.replace("http://localhost:8081/home.html");
            } else {
                alert("密码错误，请重新输入密码");
            }
        })
    },

    register: async function(){
        // var tempAccount = document.getElementById("account").value;
        var password = document.getElementById("password").value;

        web3.eth.personal.newAccount(password).then(function(res){
            prompt("注册成功，请记住账号密码\n你的账号：",res);
        })
    },

    logout: async function(){
        this.account = null;
        window.location.replace("http://localhost:8081/index.html");
    }
}

const nftModel = {
    create: async function(){
        var file = document.querySelector("#nft").files;
        var name = document.getElementById("nftName").value;
        //暂时没用
        // var message = document.getElementById("nftMessage").value;
        
        //将文件存入ipfs中并获取cid
        var cid = null;
        var tokenId = null;
        // console.log(file[0]);
        var reader = new FileReader();
        reader.readAsArrayBuffer(file[0]);
        reader.onloadend = async function(){
            // console.log(reader.result);
            var img = Buffer.from(reader.result);
            // console.log("前："+img);
            var cids = await ipfs.add(img);

            cid = cids[0].hash;
            // console.log("cid:" + cid);
            
            tokenId = web3.utils.sha3(cid);
            // console.log("tokenId:" + tokenId);
            //图片预览
            // var buffer = null;
            // await ipfs.get(cid,function (err,files) {
            //     if(err) throw err;
            //     // console.log("后："+files[0].content);
            //     buffer = files[0].content;
            //     var url = window.URL.createObjectURL(new Blob([buffer]));
            //     var img = document.createElement('img');
            //     img.src = url;
            //     img.style.width = "200px";
            //     img.style.height = "200px";
            //     document.getElementById('nftShower').appendChild(img);
            // })
        }
        //计算tokenId
        // var tokenId = web3.utils.sha3(cid);
        // console.log(tokenId);

        //获取登录的账号
        // var account = sessionStorage.getItem("account");
        var account = localStorage.getItem("account");

        //转入以太以便调用方法
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        console.log(defaultAccount);
        var transfer = {
            from:defaultAccount,
            to:account,
            value: web3.utils.toWei('1','ether')
        };

        await web3.eth.sendTransaction(transfer);

        //调用合约的铸造方法
        const { mint } = factory.methods;
        await mint(tokenId,name,cid).send({
            from: account,
            gas: 1000000
        }).then((res) =>{
            console.log(res);
        })
    },

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
            }
        }
    }
}

const pageModel = {
    showNumber: 4,

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
                    //res: 0=>tokenId  1=>cid  2=>name 3=>author
                    // console.log(res);
                    cid = res[1];
                    ipfs.get(cid,function(err,files){
                        if(err) throw err;
                        content = files[0].content;
                        url = window.URL.createObjectURL(new Blob([content]));
                        var img = document.getElementById("num"+num);
                        img.src = url;
                        img.style.width = "200px";
                        img.style.height = "200px";
                        document.getElementById("id"+num).innerText="tokenId："+web3.utils.toHex(res[0]);
                        document.getElementById("name"+num).innerText="nft名称："+res[2];
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

        //获取nft总量
        var amount = await getNFTAmount().call();
        //获取页面的当前页数
        var page = document.getElementById("page").innerText;
        
        var maxHomePage = (amount % this.showNumber == 0)?(amount / this.showNumber):(Math.ceil(amount / this.showNumber));
        //获取查询信息的方法
        const { getProperty } = factory.methods;
        
        //实际展示数量
        var trueNum = this.showNumber * page;
        if(page == maxHomePage && (amount % this.showNumber) != 0 ){
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
                await getProperty(i).call().then((res)=>{
                    //将res中数据渲染到前端
                    //获取图片信息
                    //res: 0=>tokenId  1=>cid  2=>name 3=>author
                    cid = res[1];
                    ipfs.get(cid,function(err,files){
                        if(err) throw err;
                        content = files[0].content;
                        url = window.URL.createObjectURL(new Blob([content]));
                        var img = document.getElementById("num"+num);
                        img.src = url;
                        document.getElementById("name"+num).innerText = "name："+res[2];
                        document.getElementById("tokenId"+num).innerText = "tokenId："+web3.utils.toHex(res[0]);
                        document.getElementById("author"+num).innerText = "author："+res[3];
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

window.onload = async function(){
    web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );
    
    //获取factory合约实例
    await init.getFactory();
    
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
}