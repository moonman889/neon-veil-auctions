# 🔮 Neon Veil Auctions

> *Where Privacy Meets Decentralized Commerce*

A revolutionary auction platform that combines the transparency of blockchain with the privacy of fully homomorphic encryption, creating the world's first truly private yet verifiable auction system.

## ✨ What Makes Us Different

### 🛡️ **Zero-Knowledge Bidding**
- Your bid amounts remain encrypted until auction completion
- Even the smart contract cannot see your bid during the auction
- Complete privacy without sacrificing transparency

### ⚡ **Real-Time Encrypted Processing**
- FHE-powered bid processing on-chain
- Instant bid validation without decryption
- Seamless user experience with maximum security

### 🌐 **Multi-Chain Ready**
- Built on Ethereum with Sepolia testnet support
- Modular architecture for easy chain expansion
- Cross-chain compatibility in development

### 🎯 **Smart Auction Features**
- Dynamic reserve pricing with encrypted thresholds
- Automated bid increment validation
- Reputation system for trusted participants

## 🚀 Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **FHE Bidding** | Fully encrypted bid processing | ✅ Active |
| **Wallet Integration** | Rainbow, MetaMask, WalletConnect | ✅ Active |
| **Real-time Updates** | Live auction monitoring | ✅ Active |
| **Reputation System** | Trust scoring for participants | 🔄 In Development |
| **Mobile Support** | Responsive design | ✅ Active |
| **Multi-language** | Internationalization ready | 📋 Planned |

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   FHE           │
│   (React/Vite)  │◄──►│   Contracts     │◄──►│   Network       │
│                 │    │   (Solidity)    │    │   (Zama)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Wallet        │    │   Ethereum      │    │   Privacy       │
│   Integration   │    │   (Sepolia)     │    │   Layer         │
│   (RainbowKit)  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (Lightning fast)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Wagmi

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **Wallet**: RainbowKit + Wagmi + Viem
- **Smart Contracts**: Solidity 0.8.24
- **Privacy**: FHE via Zama Network

### Development
- **Package Manager**: npm
- **Linting**: ESLint + TypeScript
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

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
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
VITE_ALTERNATIVE_RPC_URL=https://1rpc.io/sepolia
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
