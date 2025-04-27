# Lost and Found App

A web application for managing lost and found items at universities.

## Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Maps API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

You can find the Supabase values in your Supabase dashboard under Project Settings > API.

For the Google Maps API key:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select an existing one
3. Enable the Maps JavaScript API and Geocoding API
4. Create an API key with appropriate restrictions
5. Copy the API key to your `.env.local` file

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

## Features

- View lost and found items by university
- Add new lost items with images
- Delete lost items
- Search and filter items
- View locations on Google Maps with pins
- Manage locations with exact addresses

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Storage, Auth)
- Google Maps API

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