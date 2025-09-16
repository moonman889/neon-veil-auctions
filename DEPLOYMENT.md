# Vercel Deployment Guide for Neon Veil Auctions

This guide provides step-by-step instructions for deploying the Neon Veil Auctions application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Environment variables ready

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "New Project" or "Add New..." → "Project"
3. Import the `moonman889/neon-veil-auctions` repository
4. Click "Import" to proceed

### 2. Configure Project Settings

#### Framework Preset
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Add the following environment variables in the Vercel dashboard:

```
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
VITE_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
VITE_ALTERNATIVE_RPC_URL=https://1rpc.io/sepolia
```

**To add environment variables:**
1. In the project settings, go to "Environment Variables"
2. Add each variable with its value
3. Make sure to select "Production", "Preview", and "Development" for each variable
4. Click "Save"

### 3. Deploy

1. Click "Deploy" to start the deployment process
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a live URL (e.g., `https://neon-veil-auctions.vercel.app`)

### 4. Custom Domain (Optional)

1. Go to "Domains" in your project settings
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (up to 24 hours)

## Post-Deployment Configuration

### 1. Update Contract Address

After deploying your smart contract to Sepolia testnet:

1. Update the contract address in `src/config/contracts.ts`
2. Commit and push the changes
3. Vercel will automatically redeploy

### 2. Verify Deployment

1. Visit your deployed URL
2. Test wallet connection
3. Verify that the application loads correctly
4. Check browser console for any errors

## Troubleshooting

### Common Issues

#### Build Failures
- Check that all dependencies are properly installed
- Verify environment variables are set correctly
- Check the build logs in Vercel dashboard

#### Wallet Connection Issues
- Ensure WalletConnect Project ID is correct
- Verify RPC URLs are accessible
- Check that the correct network (Sepolia) is configured

#### Contract Interaction Issues
- Verify contract address is correct
- Ensure contract is deployed on Sepolia testnet
- Check that ABI matches the deployed contract

### Environment Variables Checklist

- [ ] `VITE_CHAIN_ID` = 11155111 (Sepolia)
- [ ] `VITE_RPC_URL` = Valid Sepolia RPC endpoint
- [ ] `VITE_WALLET_CONNECT_PROJECT_ID` = Valid WalletConnect project ID
- [ ] `VITE_INFURA_API_KEY` = Valid Infura API key
- [ ] `VITE_ALTERNATIVE_RPC_URL` = Backup RPC endpoint

## Monitoring and Maintenance

### 1. Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and user interactions

### 2. Updates
- Push changes to main branch for automatic deployment
- Use preview deployments for testing changes

### 3. Performance
- Monitor Core Web Vitals
- Optimize images and assets
- Use Vercel's Edge Functions if needed

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to the repository
2. **API Keys**: Rotate API keys regularly
3. **HTTPS**: Vercel provides HTTPS by default
4. **CORS**: Configure CORS settings if needed for API calls

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Check GitHub repository for latest updates
4. Contact the development team

## Deployment URLs

- **Production**: `https://neon-veil-auctions.vercel.app`
- **GitHub Repository**: `https://github.com/moonman889/neon-veil-auctions`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

---

**Note**: This deployment guide assumes you have already deployed the smart contract to Sepolia testnet. If not, please deploy the contract first and update the contract address in the configuration files.
