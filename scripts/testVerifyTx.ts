import { ethers } from "hardhat";

async function main(): Promise<void> {
    const ZKSpv = await ethers.getContractAt("ZKSpv", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    // Example proof data
    const proofData: string = "0x000000000000000000000000000000000000000000b6ac64938b92b0c7e78f64000000000000000000000000000000000000000000b07b6f86f0b20f88313fb90000000000000000000000000000000000000000000015ff20d57faf9c9b0ec10000000000000000000000000000000000000000003b3488c32d6e10e22219aa000000000000000000000000000000000000000000690d1c2aa593a354340e3c00000000000000000000000000000000000000000000292f66942468c75db7df000000000000000000000000000000000000000000837c342094e98f90874d8d000000000000000000000000000000000000000000425f928c329ed06ef32847000000000000000000000000000000000000000000001746187ac0ed09a4a765000000000000000000000000000000000000000000df45cb77c0db42eeff09c30000000000000000000000000000000000000000006c150bd24446737500a8a00000000000000000000000000000000000000000000012289c26fb6ca1e5a31500000000000000000000000000000000b34572f8d0b08c80100f82c61bbb711c00000000000000000000000000000000b2b98aae9655b947c8902cf248b2932f000000000000000000000000000000002da1acad4115bcd35e410018fe2578c900000000000000000000000000000000f9cfa195efdd37f3724cd0683b636f2e00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000024a7d1180dee4d6944231eb4288c7644000000000000000000000000000000007879d007e92b29261025dbd6e6a1cf5800000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000094b75bf9f1510f176f07f2028f6e147e00000000000000000000000000000000f8375dbb13163e864b13896f7d2601e70000000000000000000000000000000043e8c5a25ee8e970c3f8f75db80764d5000000000000000000000000000000008bf8f1fb31c9294b9491c715fb0966ca0caa6fbd1f46b72a151ff45bbfd4ca086a556ef785cd35c0d7aa723d840e290222d124b0954e9454d1ff60f3bf8c544b23e40c853c72be7aa16724b442a6d29d1907127562f289015c4d418328119c316ab91f8fc10066c3d9924bfe509a37dd20c862f9dd7acec0b4c22d641413e37f83194446f440d7ddfd218483e0faa3412cfe45955327e7c9e0f5a3ee6f44d2f4727593621c5129048e97eb73e284a618138828f4bc235dce7b991707bc6f71fd038b6a39af04d7cc53af545cec88312a1b49daa1c78326cdb7fdff99c667152b323fddbd21a2cec41f3a4b5b0fa0fb802742cb5f1fa2f05397fd08d10e6e27ca726940f66fa1378d0ec234a423f6ea0f0e560535f594b8816bd3cb09bb296fe7707a9e2d1d1520c94ea668b443b37e360d43a9b3282d9562c91189c64e15a6a0073db86a58d6fa6358c208173bc04ada00dca25550d079a09628720b4c2ed0084175ca8a3561d5bd4ef85c7752797f23123a32fb933961f9f43d714289927b1560776b068ee57b4e45f770d4749c7cb207d2195b735a99dcc6a5a3a0301e0664fecd561e79a6dac60f6b83ca08ce7472052bc246ba6b789382595f3087424ea6cfea4ffb7d5e1fd59326dc935f44937d2dd83427430c48296a755a276d5f254e3f730ee78dbe49802806ba36c10124c7068ea7968a45cfeb8dfbe63d7dafc89f9ca7ee6567951ee3546d6151b4b29c5c24d39cf220f713176c0e38780b16399cf5c1579fed73620dfb7cef0250161cf618c113f3bc3d139513e20095e500831cac6ce219a56fb36b45cc55feeaf6dcec16797a9a87436f2396043a4e92019d9156b8b22cbffe9a8408915b2f8f3d82c01a4a8d2c4ca2193d2a64f89092bd18a41af18e1bfb3203bf3ecc2e3fa51767c91d44fb217c57cb347a0bd85f80e996aa0f4f53707ebbfd724058e17bd75392c7126e0ce0a801005e1ac065e79c7dcbd2edef3040b95db6a90447cd92b8d7c3f40f712a8479e9d656fc681b50f9f2b11e831e5684d9bb7174bfb7e7e940dbbd8525e23e3e9fcfd7effbec552a0e17a278c523108aa26031bf172b1fc5eca907ce22dde79059bb5073fd28bd9bc6b7eae96f7f459e3ea72dc61533b82ebc1f24fd0b5eb24cf5b677254af3c516e45fa3f49a04f1d1c4c844a91680848c4e1e1f181365caaa908553f01812434172b58226763b1450be5a7fe6a96439959856c9ab11dc51c4c04d1fc66fae5bca35c9a8dee753c516f9f071ff5a754195c91bfb59171ac69dba0e35dd69375bd489512237aa321ea185d51c0ae061d47eabcd811a12347209d3135c25c629f107124b6e87103a30591de02f55c41e1aa6f8cfa3e50d1856b7b0b0cd499c6f9358e0dc49ba49ed739273c2fbe7080fc15cbb7caa4d254a6aff1e1e8b4e2ecda203474354fe4a6e52d026c870b47658e59d8818a5fa0cc3fdb6e3c1f988ee04a06b35589a45d15ab9b05829e8c569765c7d9a99f6c21afddb8ef52cdfe392d7f450e763016971be0eff78cb0c554bca5dd6315ded4e2db6401cfa0a287b9e352a13e793a029e3a2b027e559fa042288ab2e210c936a2b65244fcbe6464520673ee660008e16cad52fa36411bdffa4c307c0f26dc2672f027f31f621622f6f4b76f3b3c14994d1131d87e22d453d477f72aeb226efcf14f3a182f75304087352a920adedefd03436a045c0b6a6b51a1447fb2458e12e02e909885c0313a0d6daa7257bd374029304edf9bd3ddd87dcee7de5740b66c40c5badccbbc3487d6b7c16137a24ba4f1a6530c914fcaa2a8d3858cf132a4d1f1b7fb3b06b54162d2976c7edf8fb96bec680ce10a1646d560cc43ac56a4e19351cf1be5425eaaa3a996ecdbb46750729330300b9ff8e01dd2092f8a498351e020378cbed11aa7a79271e63e5a6e92a41c7722cb320e0fac3211f4f7db2acd34a"; 

    // Calling verifyTx
    const result = await ZKSpv.verifyTx(proofData);
    console.log("Verification Result:", result);


    const txReceipt = await result.wait();
    console.log("Transaction Receipt:", txReceipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});