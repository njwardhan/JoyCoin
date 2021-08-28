// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract JoyToken{
    // Constructor - it runs anytime our smart contract is deployed
    // Set the total number of tokens
    // Read the total number of tokens
    
    uint256 public totalSupply; // Public visibility for our Solidity state variable

    constructor() public {
        totalSupply = 1000000;
    }
}