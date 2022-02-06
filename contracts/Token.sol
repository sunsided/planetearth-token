// SPDX-License-Identifier: ISC
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IBEP20.sol";

contract Token is IBEP20, ERC20, Ownable {

    // TODO: Change decimals!
    constructor(uint256 initialSupply) ERC20("One Planet Earth", "PLANETEARTH") Ownable() {
        _mint(msg.sender, initialSupply);
    }

    // BEP20: Wrapper around Ownable.owner()
    function getOwner() external view returns (address) {
        return owner();
    }
}
