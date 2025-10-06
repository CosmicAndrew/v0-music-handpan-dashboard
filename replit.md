# Handpan Worship Studio

## Overview
Interactive handpan worship experience with YataoPan D Kurd 10 tuned to 432Hz. The application includes worship songs, devotional content, and an authentic handpan playing interface.

## Recent Changes (October 6, 2025)
- **Migrated from Vercel to Replit**: Successfully configured the Next.js 15 application to run in Replit's environment
- **Port Configuration**: Updated dev and start scripts to bind to port 5000 with host 0.0.0.0 for Replit compatibility
- **Development Workflow**: Configured workflow to run `pnpm run dev` on port 5000
- **Deployment Setup**: Configured autoscale deployment for production publishing
- **Bug Fixes**: Removed console.log statement from JSX that was causing compilation errors
- **Cross-Origin Configuration**: Added allowedDevOrigins config to support Replit's iframe environment

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.2.4 (App Router)
- **Package Manager**: pnpm
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4.1.9
- **Audio**: Tone.js for handpan sounds
- **Fonts**: Geist Sans, Inter

### Project Structure
```
app/                    # Next.js App Router
  ├── layout.tsx       # Root layout with fonts and metadata
  ├── page.tsx         # Main dashboard page
  └── globals.css      # Global styles

components/            # React components
  ├── ui/             # Reusable UI components (badges, buttons, cards, etc.)
  ├── dashboard.tsx
  ├── devotions.tsx
  ├── handpan-player.tsx
  ├── interactive-handpan.tsx
  ├── song-library.tsx
  ├── settings.tsx
  └── theme-provider.tsx

lib/                   # Utilities and data
  ├── audio-engine.ts  # Tone.js audio engine
  ├── handpan-data.ts  # Handpan note configurations
  └── utils.ts         # Utility functions

hooks/                 # Custom React hooks
  └── use-theme.ts

public/               # Static assets (images, etc.)
```

### Key Features
1. **Dashboard**: Draggable feature cards showcasing the app's capabilities
2. **Interactive Handpan**: Virtual handpan with 432Hz tuning
3. **Song Library**: 27 worship songs compatible with D Kurd 10
4. **Devotions**: Biblical meditation content
5. **Export Progress**: Practice analytics and progress tracking
6. **Settings**: Theme and configuration options

### Development Notes
- The app uses a 3D Spline background loaded via iframe (may show WebGL errors in screenshot tools but works fine in browsers)
- Development server runs on port 5000 with 0.0.0.0 host for Replit compatibility
- TypeScript and ESLint errors are ignored during builds (legacy from Vercel migration)
- Images are configured as unoptimized for compatibility

## Running the Project

### Development
```bash
pnpm run dev
```
Server runs on http://0.0.0.0:5000

### Production Build
```bash
pnpm run build
pnpm run start
```

### Deployment
The project is configured for Replit's autoscale deployment:
- Build command: `pnpm run build`
- Start command: `pnpm run start`
- Port: 5000

## User Preferences
- None specified yet
