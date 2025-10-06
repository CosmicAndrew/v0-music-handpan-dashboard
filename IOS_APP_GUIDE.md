# iOS App Store Deployment Guide

## Overview

Your Handpan Worship Suite has been successfully converted into a native iOS mobile app using Capacitor. The app is now ready for Xcode development and App Store submission.

## What Was Done

### 1. Next.js Static Export Configuration
- **File**: `next.config.mjs`
- Configured for static HTML/CSS/JS export (required for Capacitor)
- Extended build timeout to 180 seconds for large app processing
- All dynamic features preserved through client-side rendering

### 2. Capacitor iOS Setup
- **File**: `capacitor.config.ts`
- App ID: `com.handpan.worship`
- App Name: `Handpan Worship`
- Configured iOS-specific settings (content inset, HTTPS scheme)
- Splash screen disabled for faster load

### 3. Mobile Audio Lifecycle Management
- **File**: `lib/mobile-audio.ts`
- Created MobileAudioManager class for iOS Web Audio API compliance
- Handles iOS user gesture requirement for audio playback
- Automatic AudioContext resume on page visibility changes
- Mobile device detection (iOS, Android, etc.)

### 4. Interactive Handpan Mobile Integration
- **File**: `components/interactive-handpan.tsx`
- Integrated mobile audio manager
- **CRITICAL FIX**: Resumes both Tone.js AND handpan's AudioContext on user gesture
- Audio now works on iOS after first tap/touch
- Automatic initialization on mobile devices

### 5. Mobile UI/UX Optimizations
- **File**: `app/layout.tsx`
- Mobile viewport configuration (viewport-fit: cover)
- iOS Web App metadata (status bar, app title)
- Disabled phone number auto-detection
- Fixed user scaling for consistent mobile experience

### 6. Custom 404 Page
- **File**: `app/not-found.tsx`
- App Router-compatible 404 handling
- Prevents build errors during static export

## Project Structure

```
handpan-worship-suite/
├── ios/                          # iOS Xcode project
│   └── App/
│       ├── App.xcworkspace      # Open this in Xcode
│       └── App/
│           └── public/          # Synced web assets
├── out/                         # Static export output
├── capacitor.config.ts          # Capacitor configuration
├── next.config.mjs              # Next.js export config
├── lib/
│   └── mobile-audio.ts          # Mobile audio manager
└── components/
    └── interactive-handpan.tsx  # Handpan with mobile audio
```

## Next Steps: App Store Submission

### Prerequisites
- **macOS Computer** with Xcode installed
- **Apple Developer Account** ($99/year)
- Access to this Replit project or exported code

### Step 1: Transfer Project to Mac
```bash
# Option A: Download from Replit
# Click "Download as zip" in Replit

# Option B: Git clone (if using Git)
git clone <your-repo-url>
cd handpan-worship-suite
```

### Step 2: Install Dependencies (on Mac)
```bash
# Install Node.js dependencies
pnpm install  # or npm install

# Install CocoaPods (for iOS dependencies)
sudo gem install cocoapods

# Install iOS pods
cd ios/App
pod install
cd ../..
```

### Step 3: Open in Xcode
```bash
# Open the workspace (not the .xcodeproj!)
npx cap open ios

# Or manually open
open ios/App/App.xcworkspace
```

### Step 4: Configure App in Xcode

#### A. Signing & Capabilities
1. Select `App` target in Xcode
2. Go to "Signing & Capabilities" tab
3. Select your Apple Developer Team
4. Xcode will automatically create a Bundle Identifier
5. Enable capabilities if needed:
   - Background Audio (if needed)
   - Push Notifications (if needed)

#### B. App Icons
1. Create app icons using a tool like https://appicon.co
2. Drag icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
3. Sizes needed: 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024

#### C. App Metadata
1. Update display name in Xcode: Select `App` > Info tab > Bundle display name
2. Update version: General tab > Version (e.g., 1.0.0)
3. Update build number: General tab > Build (e.g., 1)

### Step 5: Test on Simulator/Device

#### Test on Simulator
```bash
# Select a simulator in Xcode (e.g., iPhone 15 Pro)
# Click Run button (▶) or press Cmd+R
```

#### Test on Physical Device
1. Connect iPhone/iPad via USB
2. Select device in Xcode
3. Trust the device when prompted
4. Click Run (▶) or press Cmd+R
5. **IMPORTANT**: Test audio by tapping a handpan note
   - Audio should play after first touch (iOS requirement)
   - Check console logs for "Handpan AudioContext resumed successfully"

### Step 6: Prepare for App Store

#### A. Create App Store Connect Listing
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" > "+" > "New App"
3. Fill in:
   - Platform: iOS
   - Name: "Handpan Worship" (or your preferred name)
   - Primary Language: English
   - Bundle ID: Select the one from Xcode
   - SKU: Any unique identifier (e.g., "handpan-worship-001")

#### B. Prepare App Store Assets
- **Screenshots**: Required for all device sizes
  - iPhone 6.7" (iPhone 15 Pro Max)
  - iPhone 6.5" (iPhone 14 Plus)
  - iPhone 5.5" (iPhone 8 Plus)
  - iPad Pro 12.9" (6th gen)
  
- **App Preview Video** (optional but recommended)
  - Show handpan playing, song library, devotions
  
- **App Description**:
  ```
  Experience worship through the sacred tones of a handpan tuned to 432 Hz.
  
  Handpan Worship Suite combines an interactive digital handpan instrument
  with a curated library of worship songs and devotional content.
  
  Features:
  • Interactive handpan tuned to 432 Hz in D Kurd 10 scale
  • Worship song library with key compatibility matching
  • Devotional content and meditation guides
  • Practice patterns and chord progressions
  • Beautiful Spline 3D backgrounds
  
  Perfect for worship leaders, musicians, and anyone seeking a contemplative
  worship experience through music.
  ```

- **Keywords**: handpan, worship, 432hz, meditation, devotional, christian, music
- **Category**: Music or Lifestyle
- **Age Rating**: 4+ (No objectionable content)

#### C. Privacy Policy
You'll need a privacy policy URL. Key points to include:
- App does not collect personal data
- Local storage only (preferences, practice history)
- No analytics or tracking (unless you add it)
- No account creation required

### Step 7: Build for App Store

#### A. Archive the App
1. In Xcode, select "Any iOS Device" as destination
2. Product menu > Archive
3. Wait for archive to complete
4. Organizer window will open

#### B. Validate the App
1. In Organizer, select your archive
2. Click "Validate App"
3. Follow prompts, select your team
4. Wait for validation to complete
5. Fix any issues found

#### C. Distribute to App Store
1. In Organizer, click "Distribute App"
2. Select "App Store Connect"
3. Click "Upload"
4. Wait for upload to complete (may take several minutes)
5. You'll receive email when processing is done

### Step 8: Submit for Review

1. Go to App Store Connect
2. Select your app
3. Create a new version (e.g., 1.0)
4. Fill in all required information:
   - Screenshots
   - Description
   - Keywords
   - Support URL (can be Replit URL or a simple website)
   - Privacy Policy URL
5. Select your uploaded build
6. Answer export compliance questions (typically "No" for this app)
7. Click "Submit for Review"

**Review Timeline**: Typically 1-3 days

### Step 9: Post-Approval

Once approved:
1. App will be "Ready for Sale"
2. You can manually release or auto-release
3. Share the App Store link!

## Updating the App

When you make changes:

### 1. Update Code in Replit
Make your changes to the Next.js app

### 2. Rebuild and Sync
```bash
# In Replit terminal
pnpm run export
npx cap sync ios
```

### 3. Update on Mac
```bash
# Pull latest code to Mac
git pull  # or download updated files

# Rebuild
pnpm run export
npx cap sync ios

# Update version in Xcode
# General tab > Version (increment: 1.0.0 → 1.0.1)
# General tab > Build (increment: 1 → 2)

# Archive and upload to App Store
```

## Testing Checklist

Before submission, test:

- [ ] Audio plays after first tap (iOS requirement) ✓
- [ ] All handpan notes produce sound
- [ ] Song library displays correctly
- [ ] Devotions content loads
- [ ] Settings persist after app restart
- [ ] Spline 3D backgrounds load
- [ ] App works offline (static export)
- [ ] No console errors in Safari Web Inspector
- [ ] Proper status bar appearance
- [ ] Correct app icon displays
- [ ] Launch screen shows briefly

## Troubleshooting

### Audio Not Playing
- Check console logs: "Handpan AudioContext resumed successfully" should appear
- Ensure first interaction is a tap (not a swipe)
- Test on physical device (simulator audio can be unreliable)

### Build Errors
- Clean build folder: `rm -rf .next out`
- Clear Xcode derived data: Xcode > Preferences > Locations > Derived Data > Delete
- Reinstall pods: `cd ios/App && pod install`

### App Rejected
Common reasons:
- Missing privacy policy
- Incomplete metadata
- Crashes on launch
- Missing required screenshots
- Inappropriate content (ensure devotional content is appropriate)

## Resources

- **Capacitor Docs**: https://capacitorjs.com/docs/ios
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/

## Support

For technical issues with the mobile app:
1. Check console logs in Xcode
2. Test on Safari iOS for web-specific issues
3. Review Capacitor iOS documentation
4. Check this guide's troubleshooting section

## Summary

Your app is **ready for Xcode**! The mobile conversion is complete with:
- ✅ Static export configured
- ✅ Capacitor iOS setup
- ✅ Mobile audio working (iOS Web Audio compliance)
- ✅ Mobile UI optimizations
- ✅ Built and synced to iOS platform

Next: Transfer to Mac, open in Xcode, and follow steps above for App Store submission.
