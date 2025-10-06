# Handpan Worship Suite - 432 Hz D Kurd 10

## Overview

An interactive web application for worship music exploration and handpan instrument practice. The application provides a digital handpan interface tuned to 432 Hz in D Kurd 10 scale, a curated library of worship songs compatible with the handpan's key, and devotional content focused on Christian worship themes.

The application is designed as a worship tool that combines:
- Interactive handpan playing with authentic frequency modeling
- Song compatibility matching based on musical keys
- Devotional content and meditation guides
- Practice analytics and session tracking

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### October 6, 2025 - iOS Mobile App Conversion (Latest)
- **Converted web app to native iOS mobile app** using Capacitor framework
- Configured Next.js for static export with extended timeout (180s) to support mobile packaging
- Installed Capacitor CLI and iOS platform with app metadata (com.handpan.worship)
- **Created mobile audio lifecycle manager** (`lib/mobile-audio.ts`) for iOS Web Audio API compliance:
  - Handles iOS user gesture requirement for audio playback
  - Manages AudioContext resumption on visibility changes
  - Provides mobile device detection utilities
- **Fixed critical iOS audio issue**: Both Tone.js context AND handpan's AudioContext now properly resume on user gesture
- Added mobile viewport configuration and iOS web app metadata in `app/layout.tsx`
- Created custom 404 page (`app/not-found.tsx`) for App Router compatibility
- Successfully built static export and synced to iOS platform (`ios/` directory)
- **App Store ready**: Created comprehensive deployment guide in `IOS_APP_GUIDE.md`
- Mobile app tested and verified with successful build output

**Technical Notes**:
- Used Capacitor wrapper approach (not React Native) to preserve existing Next.js/Tone.js/Spline functionality
- Mobile audio manager ensures audio plays after first user tap (iOS requirement)
- Build process takes ~200 seconds due to app complexity
- iOS project location: `ios/App/App.xcworkspace` (requires Mac with Xcode for final steps)

### October 6, 2025 - Vercel to Replit Migration & Spline 3D Integration
- Migrated project from Vercel to Replit hosting environment
- Updated package.json scripts to bind Next.js to port 5000 and host 0.0.0.0 for Replit compatibility
- Fixed TypeScript JSX error in app/page.tsx (removed console.log from render tree)
- Fixed CSS syntax errors in app/globals.css (media query syntax corrections)
- Integrated Spline 3D background (https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY) across all sections:
  - Added Spline iframe to song-library.tsx, settings.tsx, export-progress.tsx, devotions.tsx, interactive-handpan.tsx
  - Implemented consistent z-index layering with Spline at -z-10 and content at z-10
  - Each section has its own iframe instance to ensure visibility across different stacking contexts
- Fixed JSX syntax errors and wrapper structure issues in devotions and interactive-handpan components
- Configured development workflow: "Next.js Dev Server" running `pnpm run dev`
- Configured deployment settings for autoscale deployment
- Application successfully compiled and running without errors on port 5000

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with App Router and React Server Components
- Uses TypeScript for type safety
- Implements client-side rendering for interactive components
- Tailwind CSS with custom design system for styling

**UI Component System**: shadcn/ui with Radix UI primitives
- Consistent component library using CVA (Class Variance Authority) for variant management
- Custom theme system with light/dark mode support via custom hook (`use-theme.ts`)
- Glassmorphism and gradient-based design aesthetic

**State Management**: React hooks (useState, useEffect, useRef)
- Component-level state management without global state library
- Local storage for persisting user preferences (volume, BPM, theme)

**Audio Engine**: Tone.js library for Web Audio API abstraction
- Synthesizer configuration mimics handpan metallic timbre using FM synthesis
- Real-time audio generation based on precise 432 Hz frequency calculations
- Supports polyphonic playback, metronome, and drone functionality

### Component Structure

**Page-Level Components**:
- `app/page.tsx` - Main application shell with section routing
- `app/layout.tsx` - Root layout with metadata and font configuration

**Feature Components**:
- `interactive-handpan.tsx` - Visual handpan interface with SVG-based note layout
- `song-library.tsx` - Searchable/filterable worship song database
- `devotions.tsx` - Devotional content display
- `dashboard.tsx` - Overview and quick access interface
- `settings.tsx` - User preferences and configuration

**UI Components**: Located in `components/ui/`
- Reusable primitives (Button, Card, Badge, Input, Slider)
- Consistent styling via variant system

### Data Architecture

**Static Data**: Defined in `lib/handpan-data.ts`
- Expanded song library with metadata (key, chords, platform, tier)
- Song compatibility tiers based on key matching with D Kurd scale

**Audio Frequency Data**: Defined in `lib/audio-engine.ts`
- Precise frequency calculations for 432 Hz tuning
- YataoPan D Kurd 10 note layout (center D3 + 9-note outer ring)
- Nonagon geometric positioning for visual layout

### Design System

**Theme Architecture**:
- Custom CSS variables for color system (`--studio-*`, `--sacred-*`, `--futurist-*`)
- Glassmorphism effects using backdrop-blur and transparency
- Gradient-based backgrounds for visual depth
- High-contrast text rendering with text-shadow for readability

**Typography**: 
- Geist Sans as primary font
- Inter as secondary font
- Responsive font sizing

**Animation**:
- CSS animations via tw-animate-css
- Fade-up effects for content reveal
- Transition states for interactive elements

### Routing & Navigation

**Single Page Application** with section-based routing:
- Dashboard, Handpan, Songs, Devotions, Settings, Export sections
- Navigation state managed in main page component
- Sticky navigation header with section indicators

## External Dependencies

### Core Framework & Runtime
- **Next.js 15.2.4** - React framework with App Router
- **React 18+** - UI library (implied by Next.js version)
- **TypeScript** - Type safety and development tooling

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component primitives (@radix-ui/react-*)
- **shadcn/ui** - Component system built on Radix
- **Lucide React** - Icon library
- **Class Variance Authority** - Variant management utility
- **clsx** - Conditional className utility
- **Geist Font** - Primary typography
- **Inter Font** - Secondary typography

### Audio & Media
- **Tone.js** - Web Audio API framework for sound synthesis
- Audio Context API (browser native)
- No external audio file dependencies (synthesized audio)

### Video Integration
- **YouTube** - Primary video platform for song references
- **Vimeo** - Secondary video platform
- External links to worship song videos (no embedded players)

### Deployment & Analytics
- **Vercel** - Hosting platform
- **@vercel/analytics** - Usage analytics

### Form & Validation
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Validation resolvers
- **Zod** (implied by resolvers) - Schema validation

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **PostCSS/Autoprefixer** - CSS processing

### Storage & Persistence
- **LocalStorage API** (browser native) - User preferences, settings, practice history
- No external database currently configured
- No authentication system currently implemented

### Browser APIs Used
- Web Audio API (via Tone.js)
- LocalStorage API
- MediaQuery API (for theme detection)
- SVG rendering for handpan interface

### Notable Absence
The application does NOT currently use:
- Backend API or server routes
- Database (Postgres, MongoDB, etc.)
- Authentication service
- State management library (Redux, Zustand, etc.)
- Real-time features (WebSockets, etc.)

All data is static or client-side generated, making this a fully client-side application suitable for static deployment.