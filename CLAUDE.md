# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with memory optimization
- `npm run build` - Build for production with memory optimization  
- `npm start` - Start production server
- `npm run lint` - Run ESLint (ESLint ignores errors during builds)
- `npm test` - Run tests with Vitest
- `npm run refresh-data` - Manually refresh portfolio data (local dev)
- `npm run refresh-data -- --prod` - Manually refresh production data
- `npm run refresh-data -- --url=https://your-domain.com` - Refresh custom URL

## Architecture Overview

This is a Next.js 15 AI Engineer portfolio website built with TypeScript, React 18, and Tailwind CSS.

### Key Architecture Components

**Data Management:**
- Static data system in `lib/static-data.ts` - serves fallback content when external APIs are unavailable
- Portfolio data cached from `data/portfolio-data.json` with 5-minute cache duration
- Manual data refresh via `/api/refresh-data` endpoint (secured with token)
- No automatic API calls - data updates only on manual trigger
- Vercel Analytics and Speed Insights integrated for comprehensive monitoring

**Styling System:**
- CSS-in-JS with Tailwind CSS and custom CSS variables
- shadcn/ui components built on Radix UI primitives
- Dark/light theme support via `next-themes`
- Custom animations using Framer Motion and GSAP

**Content Structure:**
- MDX blog posts in `src/content/blog/`
- JSON data files for projects (`src/content/projects.json`) and talks (`src/content/talks.json`)
- Site configuration centralized in `src/config/siteConfig.ts`

### Directory Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - Reusable UI components and shadcn/ui components
- `/lib` - Utility functions, API integrations, and static data management
- `/src/content` - Content files (projects, talks, blog MDX)
- `/src/config` - Site configuration and constants
- `/scripts` - Python data syncing scripts for external APIs
- `/data` - Static portfolio data JSON files

### Import Aliases

- `@/*` - Root directory
- `@/src/*` - Source directory
- `@/components/*` - Components directory  
- `@/lib/*` - Library directory
- `@/hooks/*` - Hooks directory

## Development Notes

**Memory Optimization:**
- Development and build scripts use `NODE_OPTIONS='--max_old_space_size=4096'` for memory management
- Webpack cache disabled in development to prevent memory issues
- Performance hints disabled in webpack config

**Data Flow:**
- Portfolio displays data from `lib/static-data.ts` which loads from cached JSON files
- External APIs are synchronized separately via background scripts, not during build
- Fallback data ensures site works even without external API data

**Deployment & Monitoring:**
- Optimized for Vercel deployment with custom functions configuration
- Images are unoptimized for static hosting
- ESLint errors ignored during builds for faster deployment
- Vercel Analytics tracks page views, user sessions, and engagement metrics
- Speed Insights monitors Core Web Vitals and performance metrics
- Manual data refresh system prevents build-time API dependency issues

**Data Refresh System:**
- Use `DATA_REFRESH_TOKEN` environment variable for secure access
- POST to `/api/refresh-data` with Bearer token authentication
- Terminal script: `npm run refresh-data` for local, `-- --prod` for production
- No prebuild data syncing - all updates are manual and controlled