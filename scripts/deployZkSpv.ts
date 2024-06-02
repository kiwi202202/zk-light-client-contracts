import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const verifierContractAddress = "0xeE4831daE1663373C0d7245ca3e8FB3dBa67AeCd";

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
