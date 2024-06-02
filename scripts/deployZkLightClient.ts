import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const zkSpvContractAddress = "0xB6D0101fc62cB90a0b5984C527a9eC116CdB9D59";
  const spvDataContractAddress = "0xc406ab4F70e287000aaf5C4ED43731a4f79Fbc2d";

  // Get the ContractFactory and signers
  const ZkLightClient = await ethers.getContractFactory("ZkLightClient");
  const signers = await ethers.getSigners();

  // Deploy the contract
  const zkLightClient = await ZkLightClient.deploy(signers[0].address, zkSpvContractAddress, spvDataContractAddress);

  console.log("zkLightClient deployed to:", await zkLightClient.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
