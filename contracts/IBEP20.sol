// SPDX-License-Identifier: ISC

pragma solidity >=0.6.4 ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// https://github.com/binance-chain/bsc-genesis-contract/blob/v1.0.3/contracts/interface/IBEP20.sol
interface IBEP20 is IERC20 {
    /**
     * @dev Returns the bep token owner.
     */
    function getOwner() external view returns (address);

    // Already in IBEP20
    // function balanceOf(address account) external view returns (uint256);
    // function transfer(address recipient, uint256 amount) external returns (bool);
    // function allowance(address _owner, address spender) external view returns (uint256);
    // function approve(address spender, uint256 amount) external returns (bool);
    // function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    // function totalSupply() external view returns (uint256);

    // Already in IBEP20Metadata
    // function decimals() external view returns (uint8);
    // function symbol() external view returns (string memory);
    // function name() external view returns (string memory);

    // Already in IBEP20
    // event Transfer(address indexed from, address indexed to, uint256 value);
    // event Approval(address indexed owner, address indexed spender, uint256 value);
}