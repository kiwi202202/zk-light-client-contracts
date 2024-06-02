// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IZKSpv.sol";
import "./interfaces/ISpvData.sol";
import {PublicInputParseLib} from "./library/ZkSpvLib.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "solidity-rlp/contracts/RLPReader.sol";


import "hardhat/console.sol";

contract ZkLightClient is Ownable{
    struct Query {
        address user;
        uint256 timestamp;
        bool isSuccessful; // Indicates if the query is successful and refunded
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
    
    struct VerificationResult {
        uint256 receipt_status;  
        EIP1559Transaction tx_fields;
    }

    mapping(bytes32 => Query) public queries;
    uint256 public constant LOCK_AMOUNT = 0.05 ether;
    uint256 public constant TIMEOUT = 1 days;  // Time after which an unsuccessful query can be reset

    event QueryInitiated(bytes32 indexed txHash, address indexed user, bool isSuccessful);
    event QueryVerified(bytes32 indexed txHash, address indexed user, bool isSuccessful);
    event QueryWithdrawn(bytes32 indexed txHash, address indexed user);

    address public spvAddress;
    address public manager;

    using RLPReader for RLPReader.RLPItem;
    using RLPReader for RLPReader.Iterator;
    using RLPReader for bytes;

    constructor(address _owner, address _spvAddress, address _manager) Ownable(_owner){
        spvAddress = _spvAddress;
        manager = _manager;
    }

    // Setter functions for SPV and manager addresses, only callable by the owner
    function setSpvAddress(address _spvAddress) external onlyOwner {
        spvAddress = _spvAddress;
    }

    function setManager(address _manager) external onlyOwner {
        manager = _manager;
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
            isSuccessful: false
        });

        emit QueryInitiated(txHash, msg.sender, false);
    }

    // Verifies a query and refunds the user if successful
    // TODO: spvAddress and manager should be set only once for each ZkLightClient contract
    function verifyQuery(bytes32 txHash, bytes calldata proof, bytes memory rawTxData) external returns (VerificationResult memory) {
        Query storage query = queries[txHash];
        require(query.user != address(0) && !query.isSuccessful, "Query non-existent or already successful");

        // Verify the ZKP using the IZkSpv contract
        IZKSpv zkSpv = IZKSpv(spvAddress);
        require(zkSpv.verifyTx(proof), "Verification failed");

        // Parse the public input data from the proof
        PublicInputParseLib.PublicInputData memory publicInputData = zkSpv.parseTxProof(proof);

        // // Verify Merkle root exists in the IORSpvData contract
        // ISpvData spvData = ISpvData(manager);

        // require(
        //     spvData.getStartBlockNumber(publicInputData.merkle_root) != 0,
        //         "Invalid Merkle root"
        //     );

        // // Verify the commit block hash and target block hash
        // require(
        //         publicInputData.commit_tx_block_hash == publicInputData.commit_tx_batch_target_block_hash,
        //         "Commit block hash does not match target block hash in batch"
        //     );



        // Raw data
        console.logString("rawTxData:");
        console.logBytes(rawTxData);
        bytes32 computedHash = keccak256(rawTxData);

        // require(computedHash == txHash, "Computed Hash does not match tx Hash.");
        console.logString("computedHash:");
        console.logBytes32(computedHash);

        bytes memory actualRlpData = slice(rawTxData, 1, rawTxData.length - 1);

        RLPReader.RLPItem[] memory ls = actualRlpData.toRlpItem().toList();

        console.logString("actualRlpData:");
        console.logBytes(actualRlpData);

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

        console.log("chainId", eip1559Tx.chainId);
        console.log("nonce", eip1559Tx.nonce);
        console.log("maxPriorityFeePerGas", eip1559Tx.maxPriorityFeePerGas);
        console.log("maxFeePerGas", eip1559Tx.maxFeePerGas);
        console.log("gasLimit", eip1559Tx.gasLimit);
        console.log("to", eip1559Tx.to);
        console.log("value", eip1559Tx.value);
        console.log("data");
        console.logBytes(eip1559Tx.data);
        console.log("v", eip1559Tx.v);
        console.log("r");
        console.logBytes32(eip1559Tx.r);
        console.log("s");
        console.logBytes32(eip1559Tx.s);


        // Receipt
        VerificationResult memory result = VerificationResult({
            receipt_status: publicInputData.receipt_status,
            tx_fields: eip1559Tx
        });

        query.isSuccessful = true;
        payable(query.user).transfer(LOCK_AMOUNT);
        emit QueryVerified(txHash, query.user, true);

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
    function getQueryStatus(bytes32 txHash) public view returns (address user, uint256 timestamp, bool isSuccessful) {
        Query storage query = queries[txHash];
        return (query.user, query.timestamp, query.isSuccessful);
    }


    function slice(bytes memory data, uint256 start, uint256 length) internal pure returns (bytes memory) {
        bytes memory part = new bytes(length);
        for (uint i = 0; i < length; i++) {
            part[i] = data[i + start];
        }
        return part;
    }
}
