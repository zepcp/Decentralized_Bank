const decentralizedBank = artifacts.require('./decentralizedBank.sol');
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")) // Hardcoded development port

var lastAction = 365;
var heir = '0x3db82142DC5857b30741FfFA87dF09dCe9D21B7F';
var amount = 10;
var send = 2;

const timeTravel = function (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}

const mineBlock = function () {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_mine"
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}

contract('decentralizedBank', function(BalanceOf) {    
  it("Take1 - Deposit", async function() {
    //Create Account / 1st Deposit
    let MyBank = await decentralizedBank.deployed();
    await MyBank.deposit(lastAction, heir, {value:amount});
    check_balance = await MyBank.checkAccount();
    assert.equal(await amount, check_balance[0], "KO - Balance Not Correct");
    console.log("Take1 - Deposit - " + await MyBank.checkAccount());
  });
    
  it("Take2 - Transfer", async function() {
    //Transfer Funds
    let MyBank = await decentralizedBank.deployed();
    await MyBank.transfer(send, heir);
    check_balance = await MyBank.checkAccount();
    assert.equal(await amount-send, check_balance[0], "KO - Balance Not Correct");
    console.log("Take2 - Transfer - " + await MyBank.checkAccount());
  });

  it("Take3 - Try Execute Will", async function() {
    //Execute Will
    let MyBank = await decentralizedBank.deployed();
    try {
      await MyBank.executeWill(account);
    } catch (KO) {
      console.log("Tried to Exec Will -> NOT YET");  
      //e.getMessage();  
    }
    check_balance = await MyBank.checkAccount();
    assert.equal(await amount-send, check_balance[0], "KO - Balance Not Correct");
    console.log("Take3 - Try Execute Will - " + await MyBank.checkAccount());
  });

  it("Take4 - Deposit", async function() {
    //Create Account / 1st Deposit
    let MyBank = await decentralizedBank.deployed();
    await MyBank.deposit(0, 0, {value:amount});
    check_balance = await MyBank.checkAccount();
    assert.equal(await amount*2-send, check_balance[0], "KO - Balance Not Correct");
    console.log("Take4 - Deposit - " + await MyBank.checkAccount());
  });

  it("Take5 - Deposit", async function() {
    //Create Account / 1st Deposit
    let MyBank = await decentralizedBank.deployed();
    await MyBank.deposit(21, 0, {value:amount});
    check_balance = await MyBank.checkAccount();
    assert.equal(await amount*3-send, check_balance[0], "KO - Balance Not Correct");
    console.log("Take5 - Deposit - " + await MyBank.checkAccount());
  });

  it("Take6 - Execute Will After timeTravel", async function() {
    //Execute Will
    let MyBank = await decentralizedBank.deployed();
    await timeTravel(86400 * 400) //400 days later
    try {
      await MyBank.executeWill(BalanceOf[0]);
    } catch (KO) {
      console.log("Tried to Exec Will -> NOT YET");  
      //e.getMessage();  
    }
    check_balance = await MyBank.checkAccount();
    assert.equal(await 0, check_balance[0], "KO - Balance Not Correct");
    console.log("Take6 - Execute Will After timeTravel - " + await MyBank.checkAccount());
  });
});
