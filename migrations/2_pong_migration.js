var Pong = artifacts.require("./Pong.sol");

module.exports = function(deployer) {
  deployer.deploy(Pong);
};
