import { exec } from 'child_process';
import { promisify } from 'util';
import { ethers, Wallet } from 'ethers';
import { Signer } from "ethers";

const executeCommand = async (command: string): Promise<string> => {
  const execAsync = promisify(exec);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout;
  } catch (error) {
    throw new Error(`Failed to execute command: ${error}`);
  }
};

export const compile_yul = async (codePath: string): Promise<string> => {
  const cmd = `solc --bin --yul --optimize-runs 200 ${codePath}`;
  // console.log(`cmdString ${cmd}`);

  const output = await executeCommand(cmd);
  const string_slice = output.split(/[\s\n]/);
  const evm_compiled_code = string_slice[string_slice.length - 2];

  return evm_compiled_code;
};


export const VerifierAbi = [
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
];
  
  export const deploySpvYul = async (
    bytesCode: string,
    deployer: Signer,
  ): Promise<string> => {
    const verifierFactory = new ethers.ContractFactory(
      VerifierAbi,
      bytesCode!,
      deployer,
    );
  
    const verifier = await verifierFactory.deploy();
    return verifier.getAddress();
  };
  