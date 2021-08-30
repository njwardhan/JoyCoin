// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./JoyToken.sol";

contract JoyTokenSale{
    address admin;
    JoyToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);
 
    constructor(JoyToken _tokenContract, uint256 _tokenPrice) public {
        // Admin (external account connected to the blockcahin having special previleges)
        admin = msg.sender;

        // Interact with the Token contract
        tokenContract = _tokenContract;

        // Token price (in Ethers)
        tokenPrice = _tokenPrice;
    }

    // Safe Solidity multiplication: https://github.com/dapphub/ds-math/blob/master/src/math.sol#L25
    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y == 0 || (z = x * y) / y == x);
    }

    // Buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable{

        // Require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        // Require that there are enough tokens in the contract
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        // Require that a transfer is successful - Buy functionality!
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // Keep track of number of tokens sold
        tokensSold += _numberOfTokens;

        // Trigger the sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // Ending Token JoyTokenSale
    function endSale() public {
        // Require admin
        require(msg.sender == admin);

        // Transfer remaning JoyTokens (from this contract) back to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        
        // One more transfer is done to ensure that this contract has 0 balance .. 
        tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));

        // Destroy this smart contract :(
    }

}   
