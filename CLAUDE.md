# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14+ dashboard application built with the App Router, TypeScript, and Tailwind CSS. It's based on the [Next.js Learn Course](https://nextjs.org/learn) and demonstrates a full-stack invoice management system with customer data.

## Development Commands

### Running the Application
```bash
pnpm dev          # Start development server with Turbopack on port 3000
pnpm build        # Create production build
pnpm start        # Start production server
```

### Database Setup
The application uses PostgreSQL via the `postgres` package. Database connection requires `POSTGRES_URL` environment variable.

**Seed the database:**
- Navigate to `http://localhost:3000/seed` in the browser (GET endpoint)
- This creates tables (users, customers, invoices, revenue) and seeds with placeholder data
- Uses bcrypt for password hashing with salt rounds of 5

**Test database connection:**
- Navigate to `http://localhost:3000/test-db`

## Architecture

### Directory Structure
```
app/
├── dashboard/              # Dashboard routes (nested layout)
│   ├── layout.tsx         # Dashboard-specific layout with SideNav
│   ├── page.tsx           # Dashboard home
│   ├── invoices/          # Invoice management pages
│   └── customers/         # Customer pages
├── lib/                   # Shared utilities and data layer
│   ├── data.ts           # Database queries (all data fetching)
│   ├── definitions.ts    # TypeScript type definitions
│   ├── utils.ts          # Helper functions (formatCurrency, etc.)
│   └── placeholder-data.ts
├── ui/                    # React components organized by feature
│   ├── dashboard/        # Dashboard-specific components
│   ├── invoices/         # Invoice-specific components
│   └── customers/        # Customer-specific components
├── seed/                  # Database seeding route handler
└── layout.tsx            # Root layout with global CSS and fonts
```

### Key Architectural Patterns

**Data Layer (`app/lib/data.ts`):**
- Centralized database queries using `postgres` package
- All functions are async Server Components/Server Actions
- Direct SQL queries (no ORM)
- Pagination constant: `ITEMS_PER_PAGE = 6`
- Currency amounts stored in cents, converted to dollars for display

**Type System (`app/lib/definitions.ts`):**
- Manual TypeScript type definitions for all entities
- Separate types for raw DB data vs. formatted display data
- Example: `LatestInvoiceRaw` (amount as number) vs `LatestInvoice` (amount as string)

**Component Organization:**
- UI components in `app/ui/` organized by feature (dashboard, invoices, customers)
- Each feature has its own subdirectory with related components
- Components are client components where interactivity is needed, otherwise Server Components

**Routing:**
- Uses Next.js App Router file-based routing
- Nested layouts: root layout → dashboard layout
- Route handlers in `app/seed/route.ts` and `app/test-db/route.ts`

### Database Schema
- **users**: id (UUID), name, email, password (hashed)
- **customers**: id (UUID), name, email, image_url
- **invoices**: id (UUID), customer_id (UUID), amount (INT in cents), status ('pending' | 'paid'), date
- **revenue**: month (VARCHAR(4)), revenue (INT)

### Styling
- Tailwind CSS with custom configuration in `tailwind.config.ts`
- Global styles in `app/ui/global.css`
- Custom fonts loaded via `app/ui/fonts.ts` using `next/font`
- Responsive design with mobile-first approach

### TypeScript Configuration
- Path alias: `@/*` maps to `./*`
- Strict mode enabled
- Target: ES2017

## Important Implementation Notes

**Data Fetching:**
- All database queries go through `app/lib/data.ts`
- Server Components fetch data directly (no client-side fetching for initial loads)
- Parallel queries demonstrated in `fetchCardData()` using `Promise.all()`

**Currency Handling:**
- Database stores amounts in cents (INT)
- `formatCurrency()` in `app/lib/utils.ts` converts to dollar strings
- Invoice form amounts need division by 100 when loading for editing

**Search and Filtering:**
- Invoices support search by customer name, email, amount, date, status
- Uses PostgreSQL ILIKE for case-insensitive search
- Pagination handled at query level with LIMIT/OFFSET

**Package Manager:**
- Uses pnpm (see `pnpm-lock.yaml`)
- Special build dependencies: bcrypt, sharp (specified in package.json pnpm config)
