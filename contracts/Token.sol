//SPDX-License-Identifier: ISC
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    // TODO: Change decimals!

    constructor(uint256 initialSupply) ERC20("One Planet Earth", "PLANETEARTH") {
        _mint(msg.sender, initialSupply);
    }
}
