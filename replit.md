# Handpan Worship Studio

## Overview
Premium 3D interactive handpan worship experience with YataoPan D Kurd 10 tuned to 432Hz. Features a photorealistic 3D handpan model with cymatic particle visualizations, GSAP animations, and six worship environments. Includes 40 worship songs, devotional content, and dual 2D/3D interfaces.

## Recent Changes (October 7, 2025)
- **3D Worship Experience**: Transformed app into premium 3D platform using Three.js and React Three Fiber
- **Photorealistic 3D Handpan**: Bronze handpan model with adaptive geometry and realistic lighting/shadows
- **Cymatic Particle System**: Sacred geometry particles responding to 432Hz frequencies with visual effects
- **GSAP Animation System**: Synchronized timeline animations with Tone.js audio events
- **Six Worship Environments**: Cosmic, Temple, Nature, Blood Covenant, Cross Victory, Resurrection Light
- **Adaptive Quality System**: Device detection with LOD optimization (low/medium/high/ultra settings)
- **Performance Optimization**: Progressive enhancement for mobile devices, adaptive post-processing
- **Dual Interface**: Toggle between classic 2D designer and immersive 3D worship experience
- **Audio-Visual Sync**: Real-time visual feedback synchronized with handpan note frequencies

## Previous Changes (October 6, 2025)
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
- **3D Rendering**: Three.js, React Three Fiber, @react-three/drei, @react-three/postprocessing
- **Animations**: GSAP 3.x, @gsap/react
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4.1.9
- **Audio**: Tone.js for 432Hz handpan synthesis
- **Fonts**: Geist Sans, Inter

### Project Structure
```
app/                                  # Next.js App Router
  ├── layout.tsx                     # Root layout with fonts and metadata
  ├── page.tsx                       # Main dashboard with 2D/3D toggle
  └── globals.css                    # Global styles

components/                          # React components
  ├── ui/                           # Reusable UI components (badges, buttons, cards, etc.)
  ├── 3d-worship-experience.tsx     # Main 3D worship platform with controls
  ├── 3d-worship-environment.tsx    # Six themed 3D environments
  ├── cymatic-particles.tsx         # Particle system and sacred geometry
  ├── dashboard.tsx                 # Dashboard component
  ├── devotions.tsx                 # Devotional content
  ├── handpan-player.tsx            # Handpan player component
  ├── interactive-handpan.tsx       # Classic 2D SVG handpan
  ├── song-library.tsx              # Song library
  ├── settings.tsx                  # Settings component
  └── theme-provider.tsx            # Theme provider

lib/                                 # Utilities and data
  ├── audio-engine.ts               # Tone.js 432Hz audio synthesis
  ├── handpan-data.ts               # Handpan note configurations
  └── utils.ts                      # Utility functions

hooks/                               # Custom React hooks
  └── use-theme.ts                  # Theme hook

public/                              # Static assets (images, etc.)
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
- **3D Rendering**: WebGL context errors in headless browsers/screenshots are expected and do not affect real user experience
- **Compilation Time**: First compilation takes ~90 seconds due to Three.js modules (3800+ modules)
- **Mobile Optimization**: Adaptive quality system automatically detects device capabilities and adjusts:
  - Low: 16 segments geometry, no particles, no post-processing, no orbit controls, no GSAP animations
  - Medium: 32 segments, particles enabled, basic lighting
  - High: 48 segments, full particle effects, advanced lighting
  - Ultra: 64 segments, bloom/chromatic aberration post-processing, maximum visual fidelity
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
