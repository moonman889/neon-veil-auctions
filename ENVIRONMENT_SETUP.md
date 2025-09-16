# Environment Setup Guide

This guide explains how to set up environment variables for Neon Veil Auctions.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Chain Configuration
VITE_CHAIN_ID=11155111

# RPC Configuration
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
VITE_ALTERNATIVE_RPC_URL=https://1rpc.io/sepolia

# Wallet Connect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Infura Configuration
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY

# Smart Contract Configuration
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS

# FHE Configuration (for contract deployment)
FHE_VERIFIER_ADDRESS=YOUR_FHE_VERIFIER_ADDRESS
PRIVATE_KEY=YOUR_DEPLOYER_PRIVATE_KEY
```

## How to Get API Keys

### 1. Infura API Key
1. Go to [Infura.io](https://infura.io/)
2. Create an account or sign in
3. Create a new project
4. Select "Ethereum" network
5. Copy your Project ID (API Key)
6. Replace `YOUR_INFURA_API_KEY` with your actual key

### 2. WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account or sign in
3. Create a new project
4. Copy your Project ID
5. Replace `YOUR_WALLET_CONNECT_PROJECT_ID` with your actual ID

### 3. Smart Contract Address
1. Deploy the smart contract to Sepolia testnet
2. Copy the deployed contract address
3. Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with the actual address

### 4. FHE Verifier Address
1. Deploy the FHE verifier contract to Sepolia testnet
2. Copy the deployed verifier address
3. Replace `YOUR_FHE_VERIFIER_ADDRESS` with the actual address

### 5. Private Key (for deployment only)
1. Use a dedicated wallet for contract deployment
2. Ensure it has sufficient Sepolia ETH for gas fees
3. Replace `YOUR_DEPLOYER_PRIVATE_KEY` with the private key
4. **Never use your main wallet's private key**

## Security Notes

- **Never commit your `.env.local` file to version control**
- Keep your API keys secure and don't share them publicly
- Use different keys for development and production
- Regularly rotate your API keys for security

## File Structure

```
neon-veil-auctions/
├── .env.local          # Your actual environment variables (DO NOT COMMIT)
├── .env.example        # Example file (safe to commit)
├── ENVIRONMENT_SETUP.md # This guide
└── ...
```

## Troubleshooting

### Common Issues

1. **"Invalid API Key" errors**
   - Verify your Infura API key is correct
   - Check that your project is active on Infura

2. **Wallet connection issues**
   - Verify your WalletConnect Project ID is correct
   - Ensure the project is properly configured

3. **RPC connection errors**
   - Try the alternative RPC URL
   - Check your internet connection
   - Verify the chain ID is correct (11155111 for Sepolia)

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your API keys are valid and active
4. Check the project documentation for updates
