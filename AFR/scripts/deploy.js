
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mock = await MockUSDC.deploy();
  await mock.waitForDeployment();
  const mockAddress = await mock.getAddress();
  console.log("MockUSDC deployed to:", mockAddress);

  
  const SavingsVault = await hre.ethers.getContractFactory("SavingsVault");
  const vault = await SavingsVault.deploy(
    mockAddress,
    "AFR Savings Share",
    "aSHARE"
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("SavingsVault deployed to:", vaultAddress);

  
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(mockAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  
  const seedAmount = hre.ethers.parseUnits("1000000", 6); 
  const txSeed = await mock.transfer(faucetAddress, seedAmount);
  await txSeed.wait();
  console.log("Seeded faucet with 1,000,000 mUSDC");

  console.log("Done!");
  console.log("\nAddresses:");
  console.log("  mUSDC   :", mockAddress);
  console.log("  Vault   :", vaultAddress);
  console.log("  Faucet  :", faucetAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});