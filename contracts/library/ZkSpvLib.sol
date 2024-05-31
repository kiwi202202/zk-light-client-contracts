// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

library PublicInputParseLib {
    struct PublicInputData {
        bytes32 tx_hash;
        bytes32 commit_tx_block_hash;
        bytes32 commit_tx_batch_target_block_hash;
        bytes32 merkle_root;
        uint256 receipt_status;
    }
}