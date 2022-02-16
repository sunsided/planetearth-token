// SPDX-License-Identifier: ISC
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IBEP20.sol";

contract Token is ERC20Capped, ERC20Burnable, IBEP20, Ownable {
    uint8 private constant _decimals = 18;
    uint256 private constant _maximumSupply = 1 * 10**_decimals;

    constructor(uint256 initialSupply)
        ERC20("One Planet Earth", "PLANETEARTH")
        Ownable()
        ERC20Capped(_maximumSupply)
    {
        _mint(msg.sender, initialSupply);
    }

    // BEP20: Wrapper around Ownable.owner()
    function getOwner() external view returns (address) {
        return owner();
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override (ERC20) returns (uint8) {
        return _decimals;
    }

    /**
     * @dev See {ERC20-_mint}.
     */
    function _mint(address account, uint256 amount) internal override (ERC20Capped, ERC20) {
        ERC20Capped._mint(account, amount);
    }
}
