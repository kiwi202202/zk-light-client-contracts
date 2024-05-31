// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {PublicInputParseLib} from "../library/ZkSpvLib.sol";

interface IZKSpv {
    function verifyTx(bytes calldata proof) external returns (bool);
    function parseTxProof(bytes calldata proof) external returns (PublicInputParseLib.PublicInputData memory);
}
