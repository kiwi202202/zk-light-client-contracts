import { ethers } from 'hardhat';
import { compile_yul, deploySpvYul } from './deployYul'; 

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Compiling Verifier.yul...");
    const compiledCode = await compile_yul('./contracts/Verifier.yul'); 

    console.log("Deploying contract...");
    const contractAddress = await deploySpvYul(compiledCode, deployer);
    
    console.log(`Contract deployed to address: ${contractAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
