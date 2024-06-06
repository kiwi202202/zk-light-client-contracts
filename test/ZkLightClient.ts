import { expect } from "chai";
import { ethers } from "hardhat";
import { ZkLightClient } from "../typechain-types"; 
import { Signer } from "ethers";
import { compile_yul, deploySpvYul } from "../scripts/deployYul";

describe("ZkLightClient", function () {
  let ZkLightClient: ZkLightClient;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  const txHash = "0xcc09db256949c2f0f1b4484dc8e1724a532ac124819e629b2a3e9c8520624c61";
  const mockProof = "0x000000000000000000000000000000000000000000eebb130ecf879049f614bd00000000000000000000000000000000000000000026f9244e83e5e14595412000000000000000000000000000000000000000000000083c5fc8ccac199fe2bb00000000000000000000000000000000000000000086df3af0052f41c29761bd0000000000000000000000000000000000000000004c960b13ed4928d4e2e21100000000000000000000000000000000000000000000006fa4745fea7c295e5b000000000000000000000000000000000000000000d164dd491d0c758223fcf2000000000000000000000000000000000000000000307915444c457fb762a3e1000000000000000000000000000000000000000000000d53be97cd02c6a102590000000000000000000000000000000000000000002a9b3d4b4695f545ba2f9a000000000000000000000000000000000000000000f485869a763f8634efe33100000000000000000000000000000000000000000000034d3f20c2b3fdaebd11000000000000000000000000000000000e622d492af31fa4f1c0f6fd35b6303c000000000000000000000000000000004f91872a0857c97917edc5a6b2f8537900000000000000000000000000000000cc09db256949c2f0f1b4484dc8e1724a00000000000000000000000000000000532ac124819e629b2a3e9c8520624c610000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000005e76573dc2100d23a329e9c62823b785000000000000000000000000000000002ce1a4864883e207d87ece7be9c6d37400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000004961bc67b5ae940dde78b902bdb0c950000000000000000000000000000000015f900bbe6b1c1f49143067e95696959000000000000000000000000000000005e76573dc2100d23a329e9c62823b785000000000000000000000000000000002ce1a4864883e207d87ece7be9c6d37401f0f15faefd1454626e2490e210264c9047eca25f055e0c68aa42aa1682e0432be81586fb012d5da5db1ab28b50753192da61c1965a9a2cc9c889cb0a3754722a0761b47c690dae0fb0081bec389632d546ecb1d234c22c91cf652f31bc1b951096f241f781e450d07504a11678ff66b7ae38c9f9864079154013f7064ecc98034dd386c41dcdd727bb3dd78b5b607e03c130e9f6c68d2423c4945f49945451272f9c7897cd5250194d7fcb305ee90dc9ab9c95d5b9acd920dbe82bb16f450a2aa9b12e7d1be5cd5083c8ec8840587c7c5e3321f627f1ebcbd5720afec1701210317f325d8fc52f1c9895a6c1730c59dac722d7314295a64f024aaa0ed5ca332e1fe79af5b701f28a9f0c87353117cb3de8fdcfcae2aa5186eb19d9ddc5b6f203a8706878e93d196938e65a90f519e10a2f49935d91a89142f0b3610fba93b61613e62f2fed80e3fb04084ea284ce5d5fdd3164703931e10b7cb818f3025f6f29356a034ac3ec91a220c43144aa2222426e520982422e6037eae3e0e20604ea3016a152d242838e55494b02d53e06513502cfed4eb99efa0dac4caee133737a257d70d6f89a37951421dbd55499c8cf35e7b6d1853234ce9f85a4756531dc05163bf211d953e1d44952dbf6b0b7350c70b69948ddc7d5d4db74ec9ba93f1ccb2ce04750d0b43d450286d449c21af2a2c0ee358b07990b0c0bab288de7372087291812af2321177469cf97b741138c54b532e90a0455aaae7176833f8a18abcb2f1bd97dbe2c6b478b4687ef12ae5bc8f0c0ac63b4c53e025765f74487479b021baa0e279198348ef1b82b297220652db329e68446fd95ad91ee909da36c62e20377b1f760a10a9e52231516aa009b61629b286e1694062612dcecb849768a2c01cd8db7c4544401835ccd1b178d5dcf65b4fe7cea5ee281c7ae877a5ae9d8a92ac0760a8e0a2a9c0576ea4a8498599b0bbb67ede2fc19d298805cec3b4aecd621ccd2a736b25ebf29a7c240c4dc81d1566c44bf8825a64ea08131179fbc228310e79709ff7ecc337ae24ec790937c68d682956ebe15940c7d1600dfdcc28a7f270da62ec20240bdb34911ee61863c85450964efeb63ca7832e075bad8dfbcaa22ab8a3417795179ad92afb964057c868a73aafced6302a610d107824d7db9c20d0dc31f00594995e2a856249352685f5cfd78a1b1d5ac11dc97bf5559e442070638f36fd7e17a2d77fcd58025f3a3fd815987fe9d3ffe2859e4a62ba1477b891cd64785c20aa73552d5ebffcf47b2c6a28969294b2621f690cabad2088250b30195bd89cf564ea92d48a20f5c0ea800b28adbb28b521638b4e8563d5f43b04a03e19aaa2cb86541f266a36bf7d42d1d2ea48abc4870d13214124264c37a8b052ce41fe93e592319093ef88343032864057bcad001028825f28c9f273520382c21e01f7fdc4b4fa8039ab54a7acb92907eac6c8836a96db0034b601cb280530414dd528e7407b36a4e237ae4c5f70f5f6d0aa9bfc18035d65e1c361b1c7350ad0b62aa927f32980ca733809030cdafa19d870985b4f4b469c379e65f9204b03a28085b46ea0e868f93253041c94c38b290710d50769d11cd8588508f9344b08f259e60bfcb9fce9b55f9ba8ea4e35a0ba295cde9cb528ecc56e28fa064ebfefe2b53c68315d7cc600318d7448f47155496954ba554a55544970c72473a3f25451a7274ec239f867481b692c715ead765719b80d687ad78aaea61a556455683cf01dac034e1b2860c408e53499387fc5ff4302dbbba41a587ccca21affda2e0ee1042c278da262922d403c267ac519fe930d0a84bc577cf5539acc6f8075d006a1ec61c1aae519a10e2dab97f13f31b198a02849d501cacea1d13e4a4b02b90f2232459cc583f3a1d60e8ff86a55388498e39ee5d9dbf57d202eb0bc411e8911a";
  const mockTxRawData = "0x02f89482012c820278843b9aca0084464c78dc8401748b6894471a42fd2330cd716dd316918d90a21aa78dad3880a46a627842000000000000000000000000a3f770ec86acfb5807a8d8b98a7fa36c5d2c480ec001a0cd8198c3c34ab96a2ea67a8fb33cefecafb51106b1b4dd5ccad8dc92cb891edca07c67099bdbca75d2ca068d97cbb055085ea7ea4937bf5259aec4b67bef044ac7";

  beforeEach(async function () {

    const [deployer] = await ethers.getSigners();

    // Deploy Verifier contract
    console.log("Compiling Verifier.yul...");
    const compiledCode = await compile_yul('./contracts/Verifier.yul'); 

    console.log("Deploying Verifier contract...");
    const contractAddress = await deploySpvYul(compiledCode, deployer);
    
    console.log(`Verifier deployed to address: ${contractAddress}`);

    const verifierContractAddress = contractAddress; 

    // Deploy the ZkSpv Contract
    const ZKSpv = await ethers.getContractFactory("ZKSpv");

    const zkSpv = await ZKSpv.deploy(deployer, verifierContractAddress);

    console.log("ZKSpv deployed to:", await zkSpv.getAddress());

    const spvMockAddress = await zkSpv.getAddress();

    // Deploy the ZkLightClient Contract
    const ZkLightClient0 = await ethers.getContractFactory("ZkLightClient");
    [owner, addr1, addr2] = await ethers.getSigners();
    // const spvMockAddress = ethers.getAddress(ethers.hexlify(ethers.keccak256(ethers.toUtf8Bytes("spvMock"))).slice(0, 42));
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
        // const transactionResponse = await ZkLightClient.connect(addr1).verifyQuery(txHash, mockProof, mockTxRawData);
  
        // const receipt = await transactionResponse.wait();

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
