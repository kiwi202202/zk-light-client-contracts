// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ISpvData {
    function getStartBlockNumber(bytes32 merkleRoot) external view returns (uint256);
}
