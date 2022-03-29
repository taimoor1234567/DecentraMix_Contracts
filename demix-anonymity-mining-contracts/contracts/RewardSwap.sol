// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "dewo-token-contracts/contracts/ENS.sol";
import "./utils/FloatMath.sol";

/**
  Let's imagine we have 1M DEWO tokens for anonymity mining to distribute during 1 year (~31536000 seconds).
  The contract should constantly add liquidity to a pool of claimed rewards to DEWO (REWD/DEWO). At any time user can exchange REWD->DEWO using
  this pool. The rate depends on current available DEWO liquidity - the more DEWO are withdrawn the worse the swap rate is.

  The contract starts with some virtual balance liquidity and adds some DEWO tokens every second to the balance. Users will decrease
  this balance by swaps.

  Exchange rate can be calculated as following:
  BalanceAfter = BalanceBefore * e^(-rewardAmount/poolWeight)
  tokens = BalanceBefore - BalanceAfter
*/

contract RewardSwap is EnsResolve {
  using SafeMath for uint256;

  uint256 public constant DURATION = 365 days;

  IERC20 public immutable dewo;
  address public immutable miner;
  uint256 public immutable startTimestamp;
  uint256 public immutable initialLiquidity;
  uint256 public immutable liquidity;
  uint256 public tokensSold;
  uint256 public poolWeight;

  event Swap(address indexed recipient, uint256 pDEWO, uint256 DEWO);
  event PoolWeightUpdated(uint256 newWeight);

  modifier onlyMiner() {
    require(msg.sender == miner, "Only Miner contract can call");
    _;
  }

  constructor(
    bytes32 _dewo,
    bytes32 _miner,
    uint256 _miningCap,
    uint256 _initialLiquidity,
    uint256 _poolWeight
  ) public {
    require(_initialLiquidity <= _miningCap, "Initial liquidity should be lower than mining cap");
    dewo = IERC20(resolve(_dewo));
    miner = resolve(_miner);
    initialLiquidity = _initialLiquidity;
    liquidity = _miningCap.sub(_initialLiquidity);
    poolWeight = _poolWeight;
    startTimestamp = getTimestamp();
  }

  function swap(address _recipient, uint256 _amount) external onlyMiner returns (uint256) {
    uint256 tokens = getExpectedReturn(_amount);
    tokensSold += tokens;
    require(dewo.transfer(_recipient, tokens), "transfer failed");
    emit Swap(_recipient, _amount, tokens);
    return tokens;
  }

  /**
    @dev
   */
  function getExpectedReturn(uint256 _amount) public view returns (uint256) {
    uint256 oldBalance = dewoVirtualBalance();
    int128 pow = FloatMath.neg(FloatMath.divu(_amount, poolWeight));
    int128 exp = FloatMath.exp(pow);
    uint256 newBalance = FloatMath.mulu(exp, oldBalance);
    return oldBalance.sub(newBalance);
  }

  function dewoVirtualBalance() public view returns (uint256) {
    uint256 passedTime = getTimestamp().sub(startTimestamp);
    if (passedTime < DURATION) {
      return initialLiquidity.add(liquidity.mul(passedTime).div(DURATION)).sub(tokensSold);
    } else {
      return dewo.balanceOf(address(this));
    }
  }

  function setPoolWeight(uint256 _newWeight) external onlyMiner {
    poolWeight = _newWeight;
    emit PoolWeightUpdated(_newWeight);
  }

  function getTimestamp() public view virtual returns (uint256) {
    return block.timestamp;
  }
}
