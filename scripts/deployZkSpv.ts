import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const verifierContractAddress = "0x2F117e5706Ece40e1F1F52b1067DE05b6156676F";

  // Get the ContractFactory and signers
  const ZKSpv = await ethers.getContractFactory("ZKSpv");
  const signers = await ethers.getSigners();

  // Deploy the contract
  const zkSpv = await ZKSpv.deploy(signers[0].address, verifierContractAddress);

  console.log("ZKSpv deployed to:", await zkSpv.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
