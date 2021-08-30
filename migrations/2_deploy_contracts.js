const JoyToken = artifacts.require("JoyToken");
const JoyTokenSale = artifacts.require("JoyTokenSale");

module.exports = function(deployer) {
  deployer.deploy(JoyToken, 1000000).then(function() {
    
    var tokenPrice = 1000000000000000; // 0.01 Ether is the token price
    return deployer.deploy(JoyTokenSale, JoyToken.address, tokenPrice);
  });
};
