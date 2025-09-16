// Deployment script for Neon Veil Auctions contract
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Neon Veil Auctions contract...");
  
  // Get the contract factory
  const NeonVeilAuctions = await ethers.getContractFactory("NeonVeilAuctions");
  
  // Set deployment parameters
  const verifier = "0x742d35Cc6634C0532925a3b8D0C0C1C1C1C1C1C1"; // Replace with actual verifier address
  const platformFeePercentage = 250; // 2.5% platform fee
  
  // Deploy the contract
  const neonVeilAuctions = await NeonVeilAuctions.deploy(verifier, platformFeePercentage);
  
  await neonVeilAuctions.waitForDeployment();
  
  const contractAddress = await neonVeilAuctions.getAddress();
  
  console.log("Neon Veil Auctions deployed to:", contractAddress);
  console.log("Verifier address:", verifier);
  console.log("Platform fee percentage:", platformFeePercentage);
  
  // Verify contract deployment
  console.log("Verifying contract deployment...");
  const owner = await neonVeilAuctions.owner();
  const deployedVerifier = await neonVeilAuctions.verifier();
  const platformFee = await neonVeilAuctions.platformFeePercentage();
  
  console.log("Contract owner:", owner);
  console.log("Contract verifier:", deployedVerifier);
  console.log("Contract platform fee:", platformFee.toString());
  
  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
