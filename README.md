# Lost and Found Application

A Next.js application for managing lost and found items across different universities.

## Features

- View lost and found items by university
- Add new lost items
- Search for items
- Manage locations

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages. Follow these steps:

1. Push your code to a GitHub repository
2. Go to your repository settings
3. Navigate to "Pages" in the sidebar
4. Under "Build and deployment", select "GitHub Actions" as the source
5. Add your Supabase environment variables as repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. The GitHub Actions workflow will automatically build and deploy your site when you push to the main branch

Your site will be available at: `https://yourusername.github.io/lf-folder/`

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: React components
- `src/lib`: Utility functions and API clients
- `src/data`: Type definitions and data models
- `public`: Static assets

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase

## Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

You can find these values in your Supabase dashboard under Project Settings > API.

### Database Setup

1. Install dependencies:

```bash
npm install
```

2. Create the database tables:

```bash
# Make the script executable
chmod +x scripts/setup-db.js

# Run the script
./scripts/setup-db.js
```

Alternatively, you can run the setup through the API:

```bash
curl http://localhost:3000/api/setup-db
```

### Development

Start the development server:

```bash
npm run dev
```

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Storage, Auth)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
