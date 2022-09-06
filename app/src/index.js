import Web3 from "web3";
const ipfsAPI = require('ipfs-api');
import factoryArtifact from "../../build/contracts/Factory.json";

//web3实例
var web3 = null;
//factory合约实例
var factory = null;
//ipfs实例
var ipfs = null;

const init = {
    getFactory: async function(){
        const networkId = await new web3.eth.net.getId();
        factory = new web3.eth.Contract(
            factoryArtifact.abi,
            factoryArtifact.networks[networkId].address
        );
    },

    getIpfs: async function(){
        //'/ip4/127.0.0.1/tcp/5001'
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
    }
}

const accountModel = {
    login: async function(){
        var tempAccount = document.getElementById("account").value;
        var password = document.getElementById("password").value;

        web3.eth.personal.unlockAccount(tempAccount,password,10).then((res) =>{
            if(res == true){
                sessionStorage.setItem("account",tempAccount);
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
        var file = document.getElementById("nft").value;
        console.log(file);
        var name = document.getElementById("nftName").value;
        //暂时没用
        var message = document.getElementById("nftMessage").value;
        
        //将文件存入ipfs中并获取cid
        //fs.readFileSync(file)
        var img = new Image(file);
        var buffer = Buffer.from(getBase64Image(img));

        var cid = await ipfs.add(buffer);
        var trueCid = cid[0].hash;
        console.log(trueCid);
        await ipfs.get(cid[0].hash,function(err,files){
            console.log(files);
        });
        //计算tokenId
        var tokenId = web3.utils.sha3(trueCid);
        console.log(tokenId);

        //获取登录的账号
        var account = sessionStorage.getItem("account");

        //转入以太以便调用方法
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        console.log(defaultAccount);
        var transfer = {
            from:defaultAccount,
            to:account,
            value: web3.utils.toWei('1','ether')
        };

        await web3.eth.sendTransaction(transfer).then(function(res){
            console.log(res);
        });

        //调用合约的铸造方法
        const { mint } = factory.methods;
        await mint(tokenId,name,trueCid).send({
            from: account,
            gas: 1000000
        }).then((res) =>{
            console.log(res);
        })
    },
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}

window.accountModel = accountModel;
window.nftModel = nftModel;

window.onload = async function(){
    web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );
    
    //获取factory合约实例
    init.getFactory();
    
    //获取ipfs实例
    init.getIpfs();
}