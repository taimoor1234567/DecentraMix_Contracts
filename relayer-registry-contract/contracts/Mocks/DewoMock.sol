// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DewoMock is ERC20("DEWO", "DEWO") {
  constructor() public {
    _mint(msg.sender, 1e25);
  }
}
