// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PublicInputParseLib} from "./library/ZkSpvLib.sol";
import "./interfaces/IZKSpv.sol";
import "./interfaces/IVerifier.sol";


contract ZKSpv is Ownable, IZKSpv {
    address private verifierContractAddress;

    // Constructor that sets the initial verifier contract address
    constructor(address _owner, address _verifierContract) Ownable(_owner) {
        verifierContractAddress = _verifierContract;
    }

    // Function to update the address of the verifier contract, restricted to the contract owner
    function setVerifierContract(address _verifierContract) external onlyOwner {
        verifierContractAddress = _verifierContract;
    }

    // Function to verify a transaction proof by calling another contract
    function verifyTx(bytes calldata proof) external override returns (bool) {
        IVerifier verifier = IVerifier(verifierContractAddress);
        return verifier.verify(proof);
    }

    function parseTxProof(bytes calldata proofData) external pure override returns (PublicInputParseLib.PublicInputData memory) {

        uint256 ProofLength = 384;
        uint256 SplitStep = 32;
        uint256 TransactionSplitStart = ProofLength;// 384 is proof length
        uint256 TrackBlockSplitStart = TransactionSplitStart + SplitStep * 14;

        // Extracting tx_hash
        bytes32 tx_hash = bytes32(uint256(bytes32(proofData[TransactionSplitStart+SplitStep*2:TransactionSplitStart+SplitStep*3])) << 128 | uint256(bytes32(proofData[TransactionSplitStart+SplitStep*3:TransactionSplitStart+SplitStep*4])));

        uint256 receipt_status = uint256(bytes32(proofData[TransactionSplitStart + SplitStep * 4:TransactionSplitStart + SplitStep * 5]));
        // Extracting commit_tx_block_hash
        bytes32 commit_tx_block_hash = bytes32(uint256(bytes32(proofData[TransactionSplitStart:TransactionSplitStart+SplitStep])) << 128 | uint256(bytes32(proofData[TransactionSplitStart+SplitStep:TransactionSplitStart+SplitStep*2])));

        // Extracting commit_tx_batch_target_block_hash
        bytes32 commit_tx_batch_target_block_hash = bytes32(uint256(bytes32(proofData[TrackBlockSplitStart+SplitStep*2:TrackBlockSplitStart+SplitStep*3])) << 128 | uint256(bytes32(proofData[TrackBlockSplitStart+SplitStep*3:TrackBlockSplitStart+SplitStep*4])));

        // Extracting merkle_root
        bytes32 merkle_root = bytes32(uint256(bytes32(proofData[TrackBlockSplitStart:TrackBlockSplitStart+SplitStep])) << 128 | uint256(bytes32(proofData[TrackBlockSplitStart+SplitStep:TrackBlockSplitStart+SplitStep*2])));

        return PublicInputParseLib.PublicInputData({
            tx_hash: tx_hash,
            commit_tx_block_hash: commit_tx_block_hash,
            commit_tx_batch_target_block_hash: commit_tx_batch_target_block_hash,
            merkle_root: merkle_root,
            receipt_status: receipt_status
        });
    }

}


