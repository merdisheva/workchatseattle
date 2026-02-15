# WorkChatSeattle

A professional network website for Russian-speaking women in the Seattle area. Built with Next.js 16, Prisma 7, PostgreSQL (Neon), and Tailwind CSS.

## Features

- **Events**: Browse upcoming events and watch recordings of past events
- **Mentorship**: Register as a mentor or find mentors by industry and expertise
- **Authentication**: Sign in with Google OAuth or email/password
- **Admin Panel**: Manage events and approve mentor applications

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Neon
- **ORM**: Prisma 7
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Authentication**: NextAuth.js v5
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database account (free tier available)
- Google OAuth credentials (optional, for Google sign-in)

## Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd workchatseattle
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Neon Database URL
DATABASE_URL="postgresql://username:password@ep-xxx.region.neon.tech/workchatseattle?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Admin emails (comma-separated)
ADMIN_EMAILS="your-email@example.com"
```

### 3. Set Up Database

Push the schema to your database and seed initial data:

```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── auth/               # Sign in/Sign up pages
│   ├── events/             # Events listing
│   ├── mentor/             # Mentor registration/profile
│   ├── mentors/            # Mentor directory
│   ├── about/              # About page
│   └── contact/            # Contact page
├── components/
│   ├── events/             # Event-related components
│   ├── layout/             # Navbar, Footer, AdminSidebar
│   ├── mentors/            # Mentor-related components
│   ├── providers/          # Context providers
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
└── types/                  # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Deployment on Vercel

1. Create a [Vercel](https://vercel.com) account
2. Import your repository
3. Add environment variables in Vercel dashboard
4. Deploy

For Google OAuth, update the authorized redirect URI to include your production URL:
```
https://your-domain.vercel.app/api/auth/callback/google
```

## Admin Access

Add your email to `ADMIN_EMAILS` environment variable to get admin access. Multiple emails can be separated by commas.

## License

MIT
