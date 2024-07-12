import { ethers } from "hardhat";

async function main() {
  const zkSpvContractAddress = "0x0b2916A72E2Cc7dC86dBA9B7351b2a87e7c84b75";
  const spvDataContractAddress = "0xc406ab4F70e287000aaf5C4ED43731a4f79Fbc2d";

  // Get the ContractFactory and signers
  const ZkLightClient = await ethers.getContractFactory("ZkLightClient");
  const signers = await ethers.getSigners();

  // Deploy the contract
  const zkLightClient = await ZkLightClient.deploy(
    signers[0].address,
    zkSpvContractAddress,
    spvDataContractAddress
  );

  console.log("zkLightClient deployed to:", await zkLightClient.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
