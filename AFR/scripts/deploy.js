const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // 1. Deploy MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed at:", mockUSDCAddress);

  // 2. Deploy SavingsVault
  const SavingsVault = await ethers.getContractFactory("SavingsVault");
  const vault = await SavingsVault.deploy(
    mockUSDCAddress,
    "AFR Savings Vault Share",
    "aSHARE"
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("SavingsVault deployed at:", vaultAddress);

  // Optional: mint extra mUSDC to yourself for testing
  const mintTx = await mockUSDC.mint(
    deployer.address,
    ethers.parseUnits("100000", 6) // 100,000 mUSDC
  );
  await mintTx.wait();
  console.log("Minted extra mUSDC to deployer");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});