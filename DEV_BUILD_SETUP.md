# 🚀 Development Build Setup Guide

**Last Updated**: 2025-11-12
**Expo SDK**: 54
**React Native**: 0.81.5

---

## Overview

This guide walks you through creating **development builds** with EAS (Expo Application Services) for testing features that don't work in Expo Go:

- ✅ **RevenueCat In-App Purchases** (real testing, not mock mode)
- ✅ **Remote Push Notifications** (FCM/APNs)
- ✅ **Full Sentry Performance Metrics** (slow frames, TTID, TTFD)

---

## Prerequisites

### Required Accounts
- **Expo Account**: [expo.dev](https://expo.dev) (free)
- **Apple Developer Program**: $99/year (for iOS builds)
- **Google Play Console**: $25 one-time (for Android builds)

### Required Tools
```bash
# Node.js 18+ and npm/bun installed
node --version  # Should be 18.0.0 or higher

# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version  # Should be latest version
```

---

## Step 1: EAS Account Setup

### 1.1 Login to EAS
```bash
# Login with your Expo account
eas login

# Verify you're logged in
eas whoami
```

### 1.2 Initialize EAS in Project
```bash
# Navigate to project directory
cd /path/to/nexa-app

# Initialize EAS (creates eas.json)
eas init

# Follow prompts:
# - Confirm project slug: nexa
# - Choose owner account
```

---

## Step 2: Configure EAS Build Profiles

### 2.1 Review Generated eas.json
EAS creates `eas.json` with default profiles. Here's the recommended configuration:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2.2 Profile Explanations

**`development`**:
- **Purpose**: Local testing with hot reload on physical devices and simulators
- **Features**: Development client enabled, can install on simulator
- **Use case**: Daily development with full feature testing

**`preview`**:
- **Purpose**: Internal testing (TestFlight, internal tracks)
- **Features**: Production-like but not submitted to stores
- **Use case**: Beta testing before submission

**`production`**:
- **Purpose**: App Store and Google Play submission
- **Features**: Auto-increment build numbers, full optimizations
- **Use case**: Final builds for public release

---

## Step 3: Configure Environment Variables

### 3.1 Set EAS Secrets
Never commit sensitive keys to Git. Use EAS Secrets instead:

```bash
# RevenueCat iOS API Key
eas secret:create --scope project --name EXPO_PUBLIC_RC_IOS_API_KEY --value "appl_your_real_ios_key"

# RevenueCat Android API Key
eas secret:create --scope project --name EXPO_PUBLIC_RC_ANDROID_API_KEY --value "goog_your_real_android_key"

# PostHog Analytics Key
eas secret:create --scope project --name EXPO_PUBLIC_POSTHOG_KEY --value "phc_your_real_key"

# Sentry DSN
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://your-dsn@sentry.io/project-id"

# Supabase Configuration
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://yourproject.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_anon_key"
```

### 3.2 Verify Secrets
```bash
# List all secrets for your project
eas secret:list --scope project
```

---

## Step 4: Install Development Client

### 4.1 Install expo-dev-client
```bash
# Install the development client package
npx expo install expo-dev-client

# This adds development build capabilities to your app
```

### 4.2 Update app.json (if needed)
The development client automatically configures itself, but verify your `app.json` has:

```json
{
  "expo": {
    "plugins": [
      "expo-dev-client"
      // ... other plugins
    ]
  }
}
```

---

## Step 5: Create iOS Development Build

### 5.1 Build for iOS Simulator (Fastest Testing)
```bash
# Build for iOS simulator (no Apple Developer account needed)
eas build --profile development --platform ios

# EAS will:
# 1. Upload your code to EAS servers
# 2. Build the app in the cloud
# 3. Provide a download link

# Download the .tar.gz file
# Extract and install on simulator:
xcrun simctl install booted /path/to/Nexa.app
```

### 5.2 Build for Physical iOS Device
```bash
# Register your device first
eas device:create

# Follow prompts to add device UDID
# (Settings > General > About > find UDID on Mac)

# Build with device provisioning
eas build --profile development --platform ios

# Download and install via Apple Configurator or Xcode
```

### 5.3 Apple Developer Configuration
For physical device builds, you need:

1. **App Identifier**: `com.litmoncloud.nexa`
2. **Provisioning Profile**: EAS creates automatically
3. **Certificates**: EAS manages for you (or use manual if preferred)

**Automatic Signing** (Recommended):
```bash
# EAS will prompt for Apple ID credentials
# It creates certificates and provisioning profiles automatically
```

**Manual Signing**:
```json
// In eas.json, add to iOS configuration:
{
  "build": {
    "development": {
      "ios": {
        "simulator": false,
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## Step 6: Create Android Development Build

### 6.1 Build for Android
```bash
# Build APK for easy installation
eas build --profile development --platform android

# EAS will:
# 1. Generate Android keystore (or use existing)
# 2. Build the APK
# 3. Provide download link

# Download and install:
# - Transfer APK to device
# - Enable "Install from Unknown Sources"
# - Install APK
```

### 6.2 Android Keystore
EAS automatically creates and manages your keystore. To use existing:

```json
// In eas.json
{
  "build": {
    "development": {
      "android": {
        "credentialsSource": "local"
      }
    }
  }
}
```

Then provide your keystore details when prompted.

---

## Step 7: Running Your Development Build

### 7.1 Start Metro Bundler
```bash
# In project directory
npx expo start --dev-client

# This starts the bundler for development builds
# (Different from "npx expo start" for Expo Go)
```

### 7.2 Launch App on Device/Simulator
1. Open the installed development build on your device
2. It will show a connection screen
3. Scan QR code or enter URL manually
4. App loads from your local bundler (hot reload enabled)

### 7.3 Verify Full Features Work
Test the features that require development builds:

**RevenueCat Testing**:
```bash
# Should now connect to real App Store/Google Play
# Test subscription flows with sandbox accounts
```

**Push Notifications Testing**:
```bash
# Should receive remote push notifications
# Test with Expo Push Notification tool or your backend
```

**Sentry Performance Metrics**:
```bash
# Check Sentry dashboard for:
# - Slow and frozen frames
# - Time to Initial Display (TTID)
# - Time to Full Display (TTFD)
```

---

## Step 8: Continuous Development Workflow

### 8.1 Daily Development
```bash
# 1. Start bundler
npx expo start --dev-client

# 2. Open dev build on device (connects to bundler)
# 3. Make code changes (hot reload works)
# 4. Test on real device with full native features
```

### 8.2 Rebuild When Needed
Rebuild development build when:
- Native dependencies change
- app.json configuration changes
- Native modules added/removed
- Major Expo SDK updates

```bash
# Rebuild development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

---

## Step 9: Preview Builds (Internal Testing)

### 9.1 Create Preview Build
```bash
# Build preview for TestFlight (iOS)
eas build --profile preview --platform ios

# Build preview for internal testing (Android)
eas build --profile preview --platform android
```

### 9.2 Submit to TestFlight
```bash
# Submit iOS build to TestFlight
eas submit --platform ios --latest

# Configure in App Store Connect:
# - Add testers
# - Distribute build
# - Collect feedback
```

### 9.3 Google Play Internal Testing
```bash
# Submit Android build to Google Play Console
eas submit --platform android --latest

# Configure in Play Console:
# - Create internal testing track
# - Add testers
# - Upload build
```

---

## Step 10: Production Builds

### 10.1 Create Production Build
```bash
# Build for App Store
eas build --profile production --platform ios

# Build for Google Play
eas build --profile production --platform android
```

### 10.2 Submit to Stores
```bash
# Submit to App Store
eas submit --platform ios --latest

# Submit to Google Play
eas submit --platform android --latest
```

---

## Troubleshooting

### Common Issues

#### Issue 1: "Provisioning profile doesn't include signing certificate"
**Solution**:
```bash
# Clear credentials and regenerate
eas credentials --platform ios

# Choose "Remove all credentials" then rebuild
eas build --profile development --platform ios --clear-cache
```

#### Issue 2: "Build failed: INSTALL_FAILED_UPDATE_INCOMPATIBLE"
**Solution**:
```bash
# Uninstall old version from device
adb uninstall com.litmoncloud.nexa

# Reinstall new APK
adb install /path/to/build.apk
```

#### Issue 3: "Metro bundler not connecting"
**Solution**:
```bash
# 1. Kill Metro bundler
lsof -ti:8081 | xargs kill -9

# 2. Clear cache
npx expo start --dev-client --clear

# 3. Ensure device/simulator on same network
# 4. Check firewall settings
```

#### Issue 4: "RevenueCat still in mock mode"
**Solution**:
- Verify environment variables are set in EAS Secrets
- Rebuild with `eas build --profile development --platform ios --clear-cache`
- Check RevenueCat dashboard for correct API keys

---

## Cost Summary

### One-Time Costs
- **Apple Developer Program**: $99/year (required for iOS)
- **Google Play Developer**: $25 one-time (required for Android)

### EAS Build Pricing
- **Free Tier**: 30 builds/month for priority builds
- **Production**: Unlimited builds after free tier ($29/month)
- **Recommendation**: Free tier sufficient for most indie developers

### Backend Services (Free Tiers)
- **RevenueCat**: Free up to $10k MRR
- **Supabase**: Free up to 500MB database
- **Sentry**: Free up to 5k errors/month
- **PostHog**: Free up to 1M events/month

**Total Monthly Cost**: $0-29 (EAS only if exceeding free tier)

---

## Next Steps

After successful development build testing:

1. ✅ **Complete Feature Testing**: Test all IAP flows, push notifications, analytics
2. ✅ **Fix Any Issues**: Address bugs found during dev build testing
3. ✅ **Create Preview Builds**: Internal TestFlight/Play Console testing
4. ✅ **Collect Feedback**: Beta testers provide feedback
5. ✅ **Create Production Builds**: Final builds for App Store/Play Store
6. ✅ **Submit to Stores**: Follow store submission guidelines
7. ✅ **Monitor Production**: Use Sentry/PostHog for monitoring

---

## Additional Resources

**Official Documentation**:
- EAS Build: https://docs.expo.dev/build/introduction/
- Development Builds: https://docs.expo.dev/develop/development-builds/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/

**Service Documentation**:
- RevenueCat + EAS: https://www.revenuecat.com/docs/getting-started/installation/expo
- Sentry + EAS: https://docs.sentry.io/platforms/react-native/manual-setup/expo/
- Supabase + Expo: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

---

**Summary**: Development builds unlock full native capabilities while maintaining Expo's developer experience. Follow this guide to test RevenueCat, push notifications, and Sentry performance metrics on real devices.

**Last Updated**: 2025-11-12
