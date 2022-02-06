// SPDX-License-Identifier: ISC
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IBEP20.sol";

contract Token is IBEP20, ERC20 {

    address private _owner;

    // TODO: Change decimals!
    constructor(uint256 initialSupply) ERC20("One Planet Earth", "PLANETEARTH") {
        _owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    function getOwner() external view returns (address) {
        return _owner;
    }
}
