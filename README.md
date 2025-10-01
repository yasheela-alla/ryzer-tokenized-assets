# Ryzer Tokenized Assets

A modern, professional web application for trading tokenized real estate and assets. Built with Next.js, TypeScript, and Tailwind CSS.

## Overview

Ryzer Tokenized Assets is a platform that demonstrates fractional ownership of real estate through blockchain-inspired tokenization. Users can browse available assets, purchase tokens, and view transaction history in a clean, professional interface.

## Features

- Asset Marketplace - Browse tokenized real estate with detailed information
- Token Trading - Purchase fractional ownership tokens instantly
- Transaction History - View all completed purchases with full details
- Modern UI - Clean, professional design with Tailwind CSS
- Fully Responsive - Works perfectly on all devices

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Shadcn/ui** for UI components
- **Next.js API Routes** for backend functionality

## Quick Start

### Running in v0 Preview

Click the preview button in v0 to see the app running immediately. No configuration needed!

### Running Locally

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser**
   Navigate to http://localhost:3000

That's it! The app uses mock data so it works immediately without any database setup.

## Project Structure

\`\`\`
ryzer-tokenized-assets/
├── app/
│   ├── api/                  # API routes with mock data
│   │   ├── assets/          # Asset endpoints
│   │   ├── buy/             # Purchase endpoint
│   │   └── transactions/    # Transaction history
│   ├── assets/              # Assets marketplace page
│   ├── transactions/        # Transaction history page
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles & design tokens
├── components/
│   ├── ui/                  # Shadcn UI components
│   └── buy-asset-dialog.tsx # Purchase modal
└── scripts/
    └── seed.sql             # Database schema (for production)
\`\`\`

## API Endpoints

### GET /api/assets
Returns list of all available tokenized assets.

### POST /api/buy
Process a token purchase.

Request body:
\`\`\`json
{
  "assetId": 1,
  "quantity": 5,
  "buyerName": "John Doe"
}
\`\`\`

### GET /api/transactions
Returns list of all transactions in reverse chronological order.

## Design Philosophy

The UI follows a modern fintech aesthetic with:
- **Professional color palette** - Indigo accent with neutral grays
- **Clean typography** - Space Grotesk for headings, DM Sans for body
- **Intuitive navigation** - Clear hierarchy and user flows
- **Smooth interactions** - Hover effects and loading states

## Demo Flow

For your presentation:
1. Start on the homepage - notice the hero section and feature cards
2. Click "Explore Assets" to view the marketplace
3. Select any asset and click "Buy Tokens"
4. Enter your name and quantity (try buying 5 tokens)
5. Confirm the purchase
6. Navigate to "Transactions" to see your purchase
7. Go back to "Assets" - notice the supply decreased!

## Production Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy - it works immediately!

### Adding a Real Database (Optional)

The `scripts/seed.sql` file contains the PostgreSQL schema for production use. You can:
1. Set up a database (Supabase, Neon, etc.)
2. Run the seed script
3. Update the API routes to use the database instead of mock data

## Notes for Bhargav

This application demonstrates:
- Full-stack development with Next.js
- Clean, professional UI design
- RESTful API architecture
- TypeScript for type safety
- Responsive design principles
- Production-ready code with error handling

The code is well-commented and follows best practices. The architecture is scalable and can easily be extended with a real database, authentication, and more features.

## License

MIT License - Built for Ryzer.app internship application

---

**Good luck with your demo!**
