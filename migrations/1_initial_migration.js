var Migrations = artifacts.require("./Migrations.sol");
var decentralizedBank = artifacts.require("./decentralizedBank.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(decentralizedBank);
};
