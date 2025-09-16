# Neon Veil Auctions

A decentralized auction platform built with FHE (Fully Homomorphic Encryption) privacy protection, enabling secure and private bidding processes on the blockchain.

## Features

- **Privacy-First Auctions**: All bidding data is encrypted using FHE technology
- **Decentralized Platform**: Built on Ethereum with smart contract integration
- **Secure Wallet Integration**: Support for multiple wallet providers including Rainbow, MetaMask, and WalletConnect
- **Real-time Bidding**: Live auction updates with encrypted bid processing
- **Transparent Results**: Verifiable auction outcomes while maintaining bid privacy

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Privacy**: FHE (Fully Homomorphic Encryption) via Zama
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/moonman889/neon-veil-auctions.git
cd neon-veil-auctions
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

## Smart Contracts

The platform uses FHE-enabled smart contracts for secure auction management:

- **Auction Contract**: Manages auction creation, bidding, and settlement
- **FHE Integration**: Encrypts sensitive bidding data
- **Privacy Protection**: Ensures bid amounts remain private until auction end

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.
