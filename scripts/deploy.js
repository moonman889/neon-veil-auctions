// Deployment script for Neon Veil Auctions contract
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Neon Veil Auctions contract...");
  
  // Get the contract factory
  const NeonVeilAuctions = await ethers.getContractFactory("NeonVeilAuctions");
  
  // Set deployment parameters
  const verifier = process.env.FHE_VERIFIER_ADDRESS || "0x0000000000000000000000000000000000000000"; // Replace with actual verifier address
  const platformFeePercentage = 250; // 2.5% platform fee
  
  // Deploy the contract
  const neonVeilAuctions = await NeonVeilAuctions.deploy(verifier, platformFeePercentage);
  
  await neonVeilAuctions.waitForDeployment();
  
  const contractAddress = await neonVeilAuctions.getAddress();
  
  console.log("Neon Veil Auctions deployed to:", contractAddress);
  console.log("Verifier address:", verifier);
  console.log("Platform fee percentage:", platformFeePercentage);
  console.log("Please update VITE_CONTRACT_ADDRESS in your .env.local file with this address");
  
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
