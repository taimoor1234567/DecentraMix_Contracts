// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/Math.sol";
import "./interfaces/IDeMixInstance.sol";
import "./interfaces/IDeMixTrees.sol";

contract DeMixProxy {
  using SafeERC20 for IERC20;

  event EncryptedNote(address indexed sender, bytes encryptedNote);
  event InstanceStateUpdated(IDeMixInstance indexed instance, InstanceState state);
  event DeMixTreesUpdated(IDeMixTrees addr);

  enum InstanceState { DISABLED, ENABLED, MINEABLE }

  struct Instance {
    bool isERC20;
    IERC20 token;
    InstanceState state;
  }

  struct DeMix {
    IDeMixInstance addr;
    Instance instance;
  }

  IDeMixTrees public demixTrees;
  address public immutable governance;
  mapping(IDeMixInstance => Instance) public instances;

  modifier onlyGovernance() {
    require(msg.sender == governance, "Not authorized");
    _;
  }

  constructor(
    address _demixTrees,
    address _governance,
    DeMix[] memory _instances
  ) public {
    demixTrees = IDeMixTrees(_demixTrees);
    governance = _governance;

    for (uint256 i = 0; i < _instances.length; i++) {
      _updateInstance(_instances[i]);
    }
  }

  function deposit(
    IDeMixInstance _demix,
    bytes32 _commitment,
    bytes calldata _encryptedNote
  ) public payable virtual {
    Instance memory instance = instances[_demix];
    require(instance.state != InstanceState.DISABLED, "The instance is not supported");

    if (instance.isERC20) {
      instance.token.safeTransferFrom(msg.sender, address(this), _demix.denomination());
    }
    _demix.deposit{ value: msg.value }(_commitment);

    if (instance.state == InstanceState.MINEABLE) {
      demixTrees.registerDeposit(address(_demix), _commitment);
    }
    emit EncryptedNote(msg.sender, _encryptedNote);
  }

  function withdraw(
    IDeMixInstance _demix,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _recipient,
    address payable _relayer,
    uint256 _fee,
    uint256 _refund
  ) public payable virtual {
    Instance memory instance = instances[_demix];
    require(instance.state != InstanceState.DISABLED, "The instance is not supported");

    _demix.withdraw{ value: msg.value }(_proof, _root, _nullifierHash, _recipient, _relayer, _fee, _refund);
    if (instance.state == InstanceState.MINEABLE) {
      demixTrees.registerWithdrawal(address(_demix), _nullifierHash);
    }
  }

  function backupNotes(bytes[] calldata _encryptedNotes) external virtual {
    for (uint256 i = 0; i < _encryptedNotes.length; i++) {
      emit EncryptedNote(msg.sender, _encryptedNotes[i]);
    }
  }

  function updateInstance(DeMix calldata _demix) external virtual onlyGovernance {
    _updateInstance(_demix);
  }

  function setDeMixTreesContract(IDeMixTrees _demixTrees) external virtual onlyGovernance {
    demixTrees = _demixTrees;
    emit DeMixTreesUpdated(_demixTrees);
  }

  /// @dev Method to claim junk and accidentally sent tokens
  function rescueTokens(
    IERC20 _token,
    address payable _to,
    uint256 _amount
  ) external virtual onlyGovernance {
    require(_to != address(0), "DEWO: can not send to zero address");

    if (_token == IERC20(0)) {
      // for Ether
      uint256 totalBalance = address(this).balance;
      uint256 balance = Math.min(totalBalance, _amount);
      _to.transfer(balance);
    } else {
      // any other erc20
      uint256 totalBalance = _token.balanceOf(address(this));
      uint256 balance = Math.min(totalBalance, _amount);
      require(balance > 0, "DEWO: trying to send 0 balance");
      _token.safeTransfer(_to, balance);
    }
  }

  function _updateInstance(DeMix memory _demix) internal {
    instances[_demix.addr] = _demix.instance;
    if (_demix.instance.isERC20) {
      IERC20 token = IERC20(_demix.addr.token());
      require(token == _demix.instance.token, "Incorrect token");
      uint256 allowance = token.allowance(address(this), address(_demix.addr));

      if (_demix.instance.state != InstanceState.DISABLED && allowance == 0) {
        token.safeApprove(address(_demix.addr), uint256(-1));
      } else if (_demix.instance.state == InstanceState.DISABLED && allowance != 0) {
        token.safeApprove(address(_demix.addr), 0);
      }
    }
    emit InstanceStateUpdated(_demix.addr, _demix.instance.state);
  }
}
