# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Architecture Overview

This is a Next.js 15 application with the App Router, implementing a user authentication system with protected routes. The architecture follows these key patterns:

### Database Layer (`src/lib/db.ts`)
- Uses SQLite with the `sqlite3` package for local development
- Implements automatic database initialization and migration system
- Two main tables: `users` (authentication) and `orders` (e-commerce functionality)
- Database file: `main.db` in project root
- Includes graceful shutdown handling and error management

### Authentication System
- **Session Management**: Uses `iron-session` with encrypted cookies (`src/lib/session.ts`)
- **Password Security**: bcrypt for hashing with 10 salt rounds
- **Route Protection**: Next.js middleware (`middleware.ts`) protects `/dashboard` routes
- **API Routes**: 
  - `/api/auth/register` - User registration with validation
  - `/api/auth/login` - User authentication
  - `/api/auth/logout` - Session cleanup

### Frontend Architecture
- **Styling**: Tailwind CSS with `shadcn/ui` components for consistent UI
- **Components**: Located in `src/components/ui/` with reusable design system
- **Pages**: App Router structure with nested layouts
- **Authentication Flow**: `/auth` page handles both login/register, redirects to `/dashboard`

### Key Dependencies
- **UI**: `@radix-ui` primitives with `shadcn/ui` components
- **Styling**: `tailwindcss` with `class-variance-authority` for component variants
- **Icons**: `lucide-react`
- **Session**: `iron-session` for secure cookie-based sessions
- **Database**: `sqlite3` with custom migration system

### Environment Variables
- `SECRET_COOKIE_PASSWORD`: Required for session encryption (iron-session)
- `NODE_ENV`: Determines secure cookie settings

### Route Structure
- `/` - Landing page
- `/auth` - Combined login/register page
- `/dashboard` - Protected user dashboard
- `/api/auth/*` - Authentication API endpoints
- `/api/orders` - Order management API

### Database Schema
- **users**: `id`, `email`, `password_hash`, `address`, `phone`, `created_at`
- **orders**: Full e-commerce order tracking with foreign keys to users
- **order_items**: Line items for orders with product details

## Important Notes

- Database migrations run automatically on application start
- Session cookies are named `myapp_session`
- Protected routes are defined in middleware matcher configuration
- Uses Next.js 15 features including React 19 and Turbopack
- TypeScript strict mode enabled throughout