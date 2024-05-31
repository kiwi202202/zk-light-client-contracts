import { expect } from "chai";
import { ethers } from "hardhat";
import { ZkLightClient } from "../typechain-types"; 
import { Signer } from "ethers";

describe("ZkLightClient", function () {
  let ZkLightClient: ZkLightClient;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  const txHash = ethers.encodeBytes32String("transactionhash");
  const mockProof = "0x1234567812345678";

  beforeEach(async function () {
    const ZkLightClient0 = await ethers.getContractFactory("ZkLightClient");
    [owner, addr1, addr2] = await ethers.getSigners();
    const spvMockAddress = ethers.getAddress(ethers.hexlify(ethers.keccak256(ethers.toUtf8Bytes("spvMock"))).slice(0, 42));
    const managerMockAddress = ethers.getAddress(ethers.hexlify(ethers.keccak256(ethers.toUtf8Bytes("managerMock"))).slice(0, 42));
  
    let ZkLightClient1 = (await ZkLightClient0.deploy(owner, spvMockAddress, managerMockAddress)) as ZkLightClient;
    ZkLightClient = await ZkLightClient1.waitForDeployment();
  });

  describe("initiateQuery", function () {
    it("should initiate a query correctly", async function () {
        await expect(ZkLightClient.connect(addr1).initiateQuery(txHash, { value: ethers.parseEther("0.05") }))
        .to.emit(ZkLightClient, "QueryInitiated")
        .withArgs(txHash, await addr1.getAddress(), false);

        const query = await ZkLightClient.queries(txHash);
        expect(query.user).to.equal(await addr1.getAddress());
        expect(query.isSuccessful).to.equal(false);

        const status = await ZkLightClient.getQueryStatus(txHash);
        expect(status.user).to.equal(await addr1.getAddress());
        expect(status.timestamp).to.equal(query.timestamp);
        expect(status.isSuccessful).to.equal(false);
    });


    it("should fail if query already exists and is pending", async function () {
      await ZkLightClient.connect(addr1).initiateQuery(txHash, { value: ethers.parseEther("0.05") });

      await expect(ZkLightClient.connect(addr2).initiateQuery(txHash, { value: ethers.parseEther("0.05") }))
      .to.be.revertedWith("Query not yet timed out");
  });

    it("should fail if query already exists and is successful", async function () {
        await ZkLightClient.connect(addr1).initiateQuery(txHash, { value: ethers.parseEther("0.05") });

        await ZkLightClient.connect(addr1).verifyQuery(txHash, mockProof);

        const query = await ZkLightClient.queries(txHash);
        expect(query.user).to.equal(await addr1.getAddress());
        expect(query.isSuccessful).to.equal(true);

        await expect(ZkLightClient.connect(addr2).initiateQuery(txHash, { value: ethers.parseEther("0.05") }))
        .to.be.revertedWith("Query already completed successfully");
    });
  });

  describe("verifyQuery", function () {
    it("should verify and refund successfully", async function () {
        await ZkLightClient.connect(addr1).initiateQuery(txHash, { value: ethers.parseEther("0.05") });
        await expect(ZkLightClient.connect(addr1).verifyQuery(txHash, mockProof))
            .to.emit(ZkLightClient, "QueryVerified")
            .withArgs(txHash, await addr1.getAddress(), true);
    });
  });

  

  describe("withdrawQuery", function () {
    it("should allow withdrawal and delete the query", async function () {
        await ZkLightClient.connect(addr1).initiateQuery(txHash, { value: ethers.parseEther("0.05") });
        await expect(ZkLightClient.connect(addr1).withdrawQuery(txHash))
        .to.emit(ZkLightClient, "QueryWithdrawn")
        .withArgs(txHash, await addr1.getAddress());

        const query = await ZkLightClient.queries(txHash);
        expect(query.user).to.equal(ethers.ZeroAddress);
    });
  });
});
