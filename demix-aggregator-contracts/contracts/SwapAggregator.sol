// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "demix-anonymity-mining-contracts/contracts/RewardSwap.sol";

contract SwapAggregator {
  function swapState(RewardSwap swap) public view returns (uint256 balance, uint256 poolWeight) {
    balance = swap.dewoVirtualBalance();
    poolWeight = swap.poolWeight();
  }
}
