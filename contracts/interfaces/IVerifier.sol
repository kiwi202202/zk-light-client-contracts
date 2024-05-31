// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVerifier {
    function verify(bytes calldata proof) external returns (bool);
}
