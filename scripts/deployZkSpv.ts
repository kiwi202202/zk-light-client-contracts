import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const verifierContractAddress = "0x7739C3D3C9eeB02a808A2c496374e45b48e7E0a6";

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
