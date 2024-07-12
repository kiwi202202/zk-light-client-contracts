// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IZKSpv.sol";
import "./interfaces/ISpvData.sol";
import {PublicInputParseLib} from "./library/ZkSpvLib.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "solidity-rlp/contracts/RLPReader.sol";


contract ZkLightClient is Ownable{
    struct Query {
        address user;
        uint256 timestamp;
        bool isSuccessful; // Indicates if the query is successful and refunded
        bool receiptStatus; // L2 tx receipt status
    }

    struct EIP1559Transaction {
        uint256 chainId;
        uint256 nonce;
        uint256 maxPriorityFeePerGas;
        uint256 maxFeePerGas;
        uint256 gasLimit;
        address to;
        uint256 value;
        bytes data;
        RLPReader.RLPItem[] accessList;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
    
    struct TxResult {
        bool receipt_status;  
        EIP1559Transaction tx_fields;
    }

    mapping(bytes32 => Query) public queries;
    uint256 public constant LOCK_AMOUNT = 0.05 ether;
    uint256 public constant TIMEOUT = 1 days;  // Time after which an unsuccessful query can be reset

    event QueryInitiated(bytes32 indexed txHash, address indexed user, bool isSuccessful, uint256 timestamp);
    event QueryVerified(bytes32 indexed txHash, address indexed user, bool isSuccessful);
    event QueryWithdrawn(bytes32 indexed txHash, address indexed user);

    address public spvAddress;
    address public dataManager;

    using RLPReader for RLPReader.RLPItem;
    using RLPReader for RLPReader.Iterator;
    using RLPReader for bytes;

    constructor(address _owner, address _spvAddress, address _dataManager) Ownable(_owner){
        spvAddress = _spvAddress;
        dataManager = _dataManager;
    }

    // Setter functions for SPV and dataManager addresses, only callable by the owner
    function setSpvAddress(address _spvAddress) external onlyOwner {
        spvAddress = _spvAddress;
    }

    function setManager(address _dataManager) external onlyOwner {
        dataManager = _dataManager;
    }

    // Initiates a query or refuses if conditions are not met
    function initiateQuery(bytes32 txHash) external payable {
        require(msg.value == LOCK_AMOUNT, "Incorrect amount: 0.05 ETH required");

        Query storage existingQuery = queries[txHash];

        if (existingQuery.user != address(0)) {
            require(!existingQuery.isSuccessful, "Query already completed successfully");
            require(block.timestamp > existingQuery.timestamp + TIMEOUT, "Query not yet timed out");
            payable(existingQuery.user).transfer(LOCK_AMOUNT);
        }

        queries[txHash] = Query({
            user: msg.sender,
            timestamp: block.timestamp,
            isSuccessful: false,
            receiptStatus: false
        });

        emit QueryInitiated(txHash, msg.sender, false, block.timestamp);
    }

    // Verifies a query and refunds the user if successful
    function verifyQuery(bytes32 txHash, bytes calldata proof) external {
        Query storage query = queries[txHash];
        require(query.user != address(0) && !query.isSuccessful, "Query non-existent or already successful");

        // Verify the ZKP using the IZkSpv contract
        IZKSpv zkSpv = IZKSpv(spvAddress);
        require(zkSpv.verifyTx(proof), "Verification failed");

        // Parse the public input data from the proof
        PublicInputParseLib.PublicInputData memory publicInputData = zkSpv.parseTxProof(proof);

        // Verify Merkle root exists in the ISpvData contract
        ISpvData spvData = ISpvData(dataManager);

        require(
            spvData.getStartBlockNumber(publicInputData.merkle_root) != 0,
                "Invalid Merkle root"
            );

        // Verify that the commit block hash and target block hash are consistent
        require(
                publicInputData.commit_tx_block_hash == publicInputData.commit_tx_batch_target_block_hash,
                "Commit block hash does not match target block hash in batch"
            );

        // Verify that the query txHash and the txHash of the proof are consistent
        require(publicInputData.tx_hash == txHash, "Tx Hash in proof public data does not match target tx Hash.");

        query.isSuccessful = true;
        query.receiptStatus = publicInputData.receipt_status != 0;

        payable(query.user).transfer(LOCK_AMOUNT);
        emit QueryVerified(txHash, query.user, true);
    }


    function decodeTxRawData(bytes memory rawTxData, bytes32 txHash) external view returns (TxResult memory) {
        // Ensure the query is existent and successfully processed
        Query storage query = queries[txHash];
        require(query.user != address(0) && query.isSuccessful, "Query non-existent or not yet successful");

        // Verify that the rawTxData Hash and the txHash of the query are consistent
        bytes32 computedHash = keccak256(rawTxData);

        require(computedHash == txHash, "Computed Hash does not match tx Hash.");

        // RLP decoding for rawTxData
        bytes memory actualRlpData = slice(rawTxData, 1, rawTxData.length - 1);

        RLPReader.RLPItem[] memory ls = actualRlpData.toRlpItem().toList();

        EIP1559Transaction memory eip1559Tx = EIP1559Transaction({
            chainId: ls[0].toUint(),
            nonce: ls[1].toUint(),
            maxPriorityFeePerGas: ls[2].toUint(),
            maxFeePerGas: ls[3].toUint(),
            gasLimit: ls[4].toUint(),
            to: ls[5].toAddress(),
            value: ls[6].toUint(),
            data: ls[7].toBytes(),
            accessList: ls[8].toList(),
            v: 0,  
            r: bytes32(0),
            s: bytes32(0)
        });
        
        if (ls.length > 9) {
            eip1559Tx.v = uint8(ls[9].toUint());
            eip1559Tx.r = bytes32(ls[10].toBytes());
            eip1559Tx.s = bytes32(ls[11].toBytes());
        }

        // Receipt
        TxResult memory result = TxResult({
            receipt_status: query.receiptStatus,
            tx_fields: eip1559Tx
        });

        return result;
    }

    // Allows the user to withdraw their query and receive a refund in case the tx hash is wrong
    function withdrawQuery(bytes32 txHash) external {
        Query storage query = queries[txHash];
        require(query.user == msg.sender, "Only the query initiator can withdraw");
        require(!query.isSuccessful, "Cannot withdraw a successful query");

        // Delete the query from the mapping
        delete queries[txHash];

        // Refund the locked amount back to the user
        payable(msg.sender).transfer(LOCK_AMOUNT);

        // Emit an event indicating the query was withdrawn
        emit QueryWithdrawn(txHash, msg.sender);
    }

    // Retrieves the status of a specific query
    function getQueryStatus(bytes32 txHash) public view returns (address user, uint256 timestamp, bool isSuccessful, bool receiptStatus) {
        Query storage query = queries[txHash];
        return (query.user, query.timestamp, query.isSuccessful, query.receiptStatus);
    }


    function slice(bytes memory data, uint256 start, uint256 length) internal pure returns (bytes memory) {
        bytes memory part = new bytes(length);
        for (uint i = 0; i < length; i++) {
            part[i] = data[i + start];
        }
        return part;
    }
}
