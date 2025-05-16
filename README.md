# Solana dApp

A production-ready Solana dApp with authentication, embedded wallets, and NFT-gated content.

## Features

- **Authentication & Embedded Wallets**
  - Civic Auth integration for Google and Apple OAuth login
  - Auto-provisioned embedded Solana wallet for each user
  - Wallet address, SOL/SPL balances, and transaction history
  - Send and receive SOL and SPL tokens

- **UX & Design**
  - Next.js + React + Tailwind CSS tech stack
  - Framer Motion animations
  - Responsive, accessible UI with ARIA labels and keyboard navigation
  - Seamless flow from landing to dashboard

- **NFT-Gated Content**
  - Mint NFT at signup
  - Access premium content gated by NFT ownership

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Solana CLI (optional, for local development)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# Civic Auth
NEXT_PUBLIC_CIVIC_APP_ID=your_civic_app_id
CIVIC_APP_ID=your_civic_app_id
CIVIC_APP_SECRET=your_civic_app_secret

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_CLUSTER=devnet

# Database
DATABASE_URL=your_database_url
\`\`\`

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/solana-dapp.git
cd solana-dapp
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn
\`\`\`

3. Set up the database:
\`\`\`bash
npx prisma migrate dev
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
/src
  /app                 # Next.js App Router
    /api               # API routes
      /wallet          # Wallet-related endpoints
      /nft             # NFT-related endpoints
    /auth              # Authentication pages
    /dashboard         # Dashboard pages
  /components          # React components
    /dashboard         # Dashboard components
    /landing           # Landing page components
    /ui                # UI components (shadcn/ui)
  /lib                 # Utility functions
    /auth              # Authentication utilities
    /wallet            # Wallet utilities
    /nft               # NFT utilities
  /prisma              # Prisma schema and migrations
\`\`\`

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Testing

This project uses Jest and React Testing Library for testing:

\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
\`\`\`

## Deployment

This project can be deployed to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
