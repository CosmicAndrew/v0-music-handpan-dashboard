# Handpan Worship Studio

## Overview
Interactive handpan worship experience with YataoPan D Kurd 10 tuned to 432Hz. The application includes worship songs, devotional content, and an authentic handpan playing interface.

## Recent Changes

### October 7, 2025 - User Experience Enhancements
- **Feature Cards Optimized**: Reduced stackable card height from 36rem to 28rem for better mobile viewing and less scrolling
- **Export Navigation Added**: Re-added Export page to main navigation with 📦 icon for easy access to export functionality
- **Mobile Viewport Adjustment**: Changed viewport initial-scale from 1.0 to 0.65 (35% zoom out) for optimal mobile display across all screen sizes
- **Handpan Information Panel**: Added comprehensive D Kurd scale and chord information panel showing:
  - All 10 notes with exact 432Hz frequencies
  - Available chords (Major: F, C, Bb, G | Minor: Dm, Am | Seventh: Fmaj7, Cmaj7, Bbmaj7, Dm7)
  - D Kurd scale pattern explanation
  - Visual chord badges categorized by type
  - Usage tips for worship songs
- **Audio Initialization Guidance**: Updated handpan header with "Click any note to play" instruction for clear user guidance

### October 7, 2025 - Critical Mobile Fixes & Full Mobile Optimization
- **CRITICAL: Viewport Configuration Added**: Fixed missing viewport meta tag that was breaking mobile rendering completely. Now properly configured with device-width and initial-scale while allowing user zoom for accessibility
- **CRITICAL: Header Visibility Fixed**: Resolved issue where navigation header was invisible on mobile devices, making navigation impossible. Added:
  - Increased z-index to 100 with explicit sticky positioning
  - Safe-area support for devices with notches (iPhone X+)
  - Proper top padding (pt-20) to prevent content from hiding under header
  - Mobile-specific CSS rules to ensure header always stays visible
- **Enhanced Navigation**: Improved header with larger touch targets (48px minimum), better icon sizing, and horizontal scrolling support
- **Responsive Dashboard**: Mobile-first layout with reordered card placement, responsive text sizes, and touch-friendly pagination controls  
- **Optimized Feature Cards**: Responsive sizing using clamp() for proper mobile viewport scaling with touch-manipulation for fast tap response
- **Mobile Touch Support**: Comprehensive touch-action: manipulation applied to all interactive elements (buttons, links, cards, navigation) to eliminate 300ms tap delay and prevent unwanted zoom on iOS Safari
- **Handpan Interface Mobile Optimization**: 
  - Hidden left/right sidebars on mobile (< lg screens) to maximize handpan space
  - Responsive control buttons showing only icons on mobile
  - Optimized SVG scaling with proper viewport constraints
  - Enhanced touch targets for all interactive elements (44px minimum)
- **Song Library Enhancements**: Responsive headers, stat badges, and filter buttons optimized for mobile screens
- **CSS Utilities**: Added scrollbar-hide utility, touch-manipulation class, safe-area utilities, and comprehensive mobile-specific breakpoints
- **Accessibility**: Viewport configuration follows WCAG guidelines, allowing pinch-zoom while maintaining proper mobile layout

### October 7, 2025 - Comprehensive Mobile Performance Optimization
- **Lazy Loading & Code Splitting**: Implemented React.lazy for all heavy components (InteractiveHandpan, SongLibrary, Devotions, ExportProgress, RecentlyPlayed, Settings) to reduce initial bundle size
- **Loading States**: Added ComponentLoader with spinning animation for better UX during component loading
- **Suspense Boundaries**: Wrapped all lazy components with Suspense for proper loading state management
- **3D Background Optimization**: Lazy loaded Spline 3D iframe with 100ms delay and loading="lazy" attribute to prevent blocking initial render
- **Resource Hints**: Added preconnect and DNS prefetch for my.spline.design to improve external resource loading
- **CSS Performance (Mobile)**:
  - Reduced backdrop-filter blur from 70px to 20px on mobile devices (< 768px) for better 60fps performance
  - Added GPU acceleration with transform: translateZ(0) and backface-visibility: hidden
  - Added will-change: transform for animated elements
  - Optimized glassmorphism effects specifically for mobile
- **Scroll & Touch Optimization**:
  - Added -webkit-overflow-scrolling: touch for smooth momentum scrolling
  - Added overscroll-behavior: contain to prevent bounce effects
  - Disabled tap highlights with -webkit-tap-highlight-color: transparent
  - Added -webkit-touch-callout: none for better touch experience
- **Animation Performance**: Added content-visibility: auto, smooth scroll-behavior, and font smoothing optimizations
- **Touch Interaction**: Disabled text selection on interactive elements for better mobile UX

### October 7, 2025 - Comprehensive Debugging & Code Cleanup
- **Runtime Error Fix**: Resolved critical "TypeError: e[o] is not a function" error through server restart (stale build state)
- **Code Cleanup**: Removed all debug console.log statements from components (page.tsx, interactive-handpan.tsx, song-library.tsx)
- **Error Handling**: Kept console.error in handpan-player.tsx for proper error reporting
- **Configuration Fix**: Moved allowedDevOrigins from experimental to top-level in next.config.mjs (Next.js 15 requirement)
- **Cross-Origin Warning**: Fixed allowedDevOrigins configuration to eliminate development warnings
- **Technical Debt**: 37 TypeScript LSP diagnostics remain (non-breaking, scheduled for future cleanup)
- **Verification**: All features tested and working correctly, no runtime errors

### October 6, 2025 - Replit Migration
- **Migrated from Vercel to Replit**: Successfully configured the Next.js 15 application to run in Replit's environment
- **Port Configuration**: Updated dev and start scripts to bind to port 5000 with host 0.0.0.0 for Replit compatibility
- **Development Workflow**: Configured workflow to run `pnpm run dev` on port 5000
- **Deployment Setup**: Configured autoscale deployment for production publishing
- **Bug Fixes**: Removed console.log statement from JSX that was causing compilation errors

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
