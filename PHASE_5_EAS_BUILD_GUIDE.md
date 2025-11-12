# Phase 5: Production Builds with EAS (Expo Application Services)

**Version:** 1.0.0
**Last Updated:** 2025-11-12
**Project:** Nexa - Cognitive Disorders Support App
**Status:** Ready for Production Build Implementation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [EAS CLI Setup](#eas-cli-setup)
4. [EAS Build Configuration](#eas-build-configuration)
5. [App Configuration](#app-configuration)
6. [Credential Management](#credential-management)
7. [Build Execution](#build-execution)
8. [Build Artifacts](#build-artifacts)
9. [Validation Checklist](#validation-checklist)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### What is EAS Build?

EAS (Expo Application Services) Build is a cloud-based build service that creates production-ready binaries for iOS (.ipa) and Android (.aab/.apk) applications. It handles:

- **Automated Builds**: Cloud-based build infrastructure
- **Credential Management**: Secure storage of signing certificates and keystores
- **Build Profiles**: Development, preview, and production configurations
- **Artifact Generation**: Store-ready binaries for TestFlight and Google Play

### Why Use EAS Build?

1. **Consistency**: Same build environment for all team members
2. **Security**: Credentials never leave EAS servers (unless using local credentials)
3. **Automation**: CI/CD integration and automated workflows
4. **Simplicity**: No need to manage Xcode or Android Studio locally
5. **Speed**: Parallel builds for iOS and Android

### Build Flow Overview

```
Local Code → EAS Build Service → Build Artifacts → App Stores
     ↓              ↓                    ↓              ↓
  app.json      eas.json            .ipa/.aab    TestFlight/Play Store
```

---

## Prerequisites

### Required Accounts

#### 1. Expo Account
- **Cost**: Free (Pro plan recommended for larger teams)
- **Sign Up**: https://expo.dev/signup
- **Purpose**: Access to EAS services

#### 2. Apple Developer Program
- **Cost**: $99/year
- **Enroll**: https://developer.apple.com/programs/
- **Purpose**: iOS app signing and App Store submission
- **Role Required**: Account Holder, Admin, or App Manager

#### 3. Google Play Developer Account
- **Cost**: $25 one-time fee
- **Register**: https://play.google.com/console/signup
- **Purpose**: Android app signing and Play Store submission

### Development Environment

```bash
# Check Node.js version (14.x or higher required)
node --version

# Check npm version
npm --version

# Check Expo CLI (if installed globally)
expo --version
```

### Project Requirements

Before starting, ensure:

- [ ] Legal documents hosted and accessible
- [ ] Environment variables configured in `.env`
- [ ] All TypeScript errors resolved (`npx tsc --noEmit`)
- [ ] All lint errors fixed (`npm run lint`)
- [ ] App tested on physical devices (iOS & Android)
- [ ] Assets validated (`node scripts/validate-assets.js`)
- [ ] Medical disclaimer visible in app

---

## EAS CLI Setup

### 1. Install EAS CLI

```bash
# Install globally
npm install -g eas-cli

# Verify installation
eas --version
```

**Expected Output:**
```
eas-cli/7.x.x darwin-arm64 node-v20.x.x
```

### 2. Login to Expo

```bash
# Login with your Expo account
eas login

# Enter your credentials when prompted
# Email: your-email@example.com
# Password: ********
```

**Verify Login:**
```bash
# Check current user
eas whoami

# Expected output: your-expo-username
```

### 3. Initialize EAS in Project

```bash
# Navigate to project directory
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app

# Initialize EAS (creates eas.json if it doesn't exist)
eas build:configure

# This will:
# 1. Create eas.json with default build profiles
# 2. Link project to your Expo account
# 3. Generate project ID if needed
```

### 4. Link Project to Expo

If you have an existing Expo project:

```bash
# Link to specific project
eas init --id YOUR_EXPO_PROJECT_ID

# Or let EAS create a new project
eas init
```

**Project Configuration:**
- **Project Name**: nexa-cognitive-disorders-support
- **Slug**: nexa-cognitive-disorders-support-ykokwhv
- **Bundle ID (iOS)**: app.rork.nexa-cognitive-disorders-support-ykokwhv
- **Package Name (Android)**: app.rork.nexa-cognitive-disorders-support-ykokwhv

---

## EAS Build Configuration

### Creating eas.json

Create or update `eas.json` in your project root:

```json
{
  "cli": {
    "version": ">= 7.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      },
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "apk"
      },
      "channel": "preview",
      "env": {
        "NODE_ENV": "production"
      }
    },
    "production": {
      "distribution": "store",
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release",
        "autoIncrement": true
      },
      "android": {
        "buildType": "aab",
        "autoIncrement": "versionCode"
      },
      "channel": "production",
      "env": {
        "NODE_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    },
    "preview": {
      "android": {
        "track": "internal"
      }
    }
  }
}
```

### Build Profile Breakdown

#### Development Profile
- **Purpose**: Testing on physical devices and emulators
- **Distribution**: Internal (no store submission)
- **iOS**: Includes development client, builds for simulator
- **Android**: Creates APK for easy installation
- **Use Case**: Daily development and testing

#### Preview Profile
- **Purpose**: Internal testing (TestFlight/Internal Testing)
- **Distribution**: Internal (submitted to test tracks)
- **iOS**: Production-like build for TestFlight
- **Android**: APK for internal testing track
- **Use Case**: QA testing, stakeholder demos

#### Production Profile
- **Purpose**: App Store and Play Store submission
- **Distribution**: Store (public release)
- **iOS**: Creates .ipa with auto-incrementing build number
- **Android**: Creates .aab (Android App Bundle) with auto-incrementing version code
- **Use Case**: Public release on app stores

### Environment Variables

EAS Build supports environment-specific configuration:

```json
{
  "build": {
    "production": {
      "env": {
        "NODE_ENV": "production",
        "EXPO_PUBLIC_ENV": "production",
        "EXPO_PUBLIC_API_URL": "https://api.nexa.app"
      }
    }
  }
}
```

### Resource Classes

For complex builds, you can specify resource classes:

```json
{
  "build": {
    "production": {
      "resourceClass": "large",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    }
  }
}
```

**Available Resource Classes:**
- **default**: 4GB RAM, 4 vCPUs (included in free tier)
- **medium**: 12GB RAM, 4 vCPUs
- **large**: 24GB RAM, 8 vCPUs

---

## App Configuration

### Updating app.json for Production

Your current `app.json` is mostly production-ready. Here are the key sections:

#### 1. Basic Metadata

```json
{
  "expo": {
    "name": "Nexa: Cognitive Disorders Support App",
    "slug": "nexa-cognitive-disorders-support-ykokwhv",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic"
  }
}
```

**Production Checklist:**
- ✅ Name is user-friendly and descriptive
- ✅ Slug is unique and lowercase
- ✅ Version follows semantic versioning (1.0.0)
- ✅ Icon exists at specified path

#### 2. iOS Configuration

```json
{
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "app.rork.nexa-cognitive-disorders-support-ykokwhv",
    "buildNumber": "1",
    "infoPlist": {
      "NSPhotoLibraryUsageDescription": "Nexa needs access to your photos to allow you to attach images to memory journal entries.",
      "NSCameraUsageDescription": "Nexa needs camera access to capture photos for memory journal entries.",
      "NSMicrophoneUsageDescription": "Nexa needs microphone access for voice input features.",
      "NSLocationAlwaysAndWhenInUseUsageDescription": "Nexa uses your location to provide location-based reminders for caregivers.",
      "NSLocationAlwaysUsageDescription": "Nexa uses your location for caregiver safety features.",
      "NSLocationWhenInUseUsageDescription": "Nexa uses your location for location-based reminders.",
      "UIBackgroundModes": ["location"]
    }
  }
}
```

**Privacy Descriptions Best Practices:**
- ✅ Start with app name
- ✅ Explain specific use case
- ✅ Use user-friendly language
- ✅ Be concise but informative

**Add Build Number:**
```json
{
  "ios": {
    "buildNumber": "1"
  }
}
```

#### 3. Android Configuration

```json
{
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": "app.rork.nexa-cognitive-disorders-support-ykokwhv",
    "versionCode": 1,
    "permissions": [
      "android.permission.VIBRATE",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.SCHEDULE_EXACT_ALARM",
      "android.permission.CAMERA",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_LOCATION",
      "android.permission.ACCESS_BACKGROUND_LOCATION"
    ]
  }
}
```

**Add Version Code:**
```json
{
  "android": {
    "versionCode": 1
  }
}
```

**Note on Permissions:**
- Remove `REQUEST_INSTALL_PACKAGES` for Play Store
- `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` are deprecated in Android 13+

**Updated Android Permissions:**
```json
{
  "android": {
    "permissions": [
      "android.permission.VIBRATE",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.SCHEDULE_EXACT_ALARM",
      "android.permission.CAMERA",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_LOCATION",
      "android.permission.ACCESS_BACKGROUND_LOCATION",
      "android.permission.POST_NOTIFICATIONS"
    ]
  }
}
```

#### 4. Plugins Configuration

Your current plugin configuration looks good:

```json
{
  "plugins": [
    ["expo-router", { "origin": "https://rork.com/" }],
    ["expo-notifications", { ... }],
    ["expo-image-picker", { ... }],
    ["expo-location", { ... }],
    "expo-audio"
  ]
}
```

**Production Considerations:**
- ✅ Update `origin` to production domain when available
- ✅ Verify notification icon and sound assets exist
- ✅ Ensure all plugin configurations are production-ready

#### 5. Extra Configuration

Add these optional but recommended fields:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-expo-project-id"
      }
    },
    "owner": "your-expo-username",
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

---

## Credential Management

### Overview

App signing is required to submit apps to app stores. EAS provides two options:

1. **Managed Credentials** (Recommended): EAS generates and stores credentials securely
2. **Local Credentials**: You provide your own credentials

### iOS Credentials

#### Option 1: Automatic (Recommended)

```bash
# Start iOS production build
eas build --profile production --platform ios

# EAS will prompt to generate credentials automatically
# Select: "Generate new credentials"
```

**EAS will create:**
- Distribution certificate (.p12)
- Distribution provisioning profile
- Push notification key (for notifications)

**Credentials are stored securely on EAS servers.**

#### Option 2: Manual Credential Management

**1. Generate Distribution Certificate:**

```bash
# Use EAS CLI to generate
eas credentials

# Select:
# → iOS
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Distribution Certificate
# → Add new Distribution Certificate
```

**2. Create App Identifier:**

Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list):
- Click "+" to add new identifier
- Select "App IDs"
- Description: Nexa
- Bundle ID: `app.rork.nexa-cognitive-disorders-support-ykokwhv`
- Capabilities: Enable required capabilities (Push Notifications, Background Modes, etc.)

**3. Generate Provisioning Profile:**

```bash
eas credentials

# Select:
# → iOS
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Provisioning Profile
# → Add new Provisioning Profile
```

#### App Store Connect API Key (Recommended for Automation)

```bash
# Generate API key in App Store Connect
# https://appstoreconnect.apple.com/access/api

# Add to EAS:
eas credentials

# Select:
# → iOS
# → App Store Connect API Key
# → Add new App Store Connect API Key

# Provide:
# - Issuer ID
# - Key ID
# - .p8 key file path
```

### Android Credentials

#### Option 1: Automatic (Recommended)

```bash
# Start Android production build
eas build --profile production --platform android

# EAS will prompt to generate keystore
# Select: "Generate new keystore"
```

**EAS will create:**
- Java keystore (.jks)
- Keystore password
- Key alias and password

**Credentials are stored securely on EAS servers.**

#### Option 2: Manual Keystore Management

**1. Generate Keystore Locally:**

```bash
# Generate keystore using keytool
keytool -genkeypair \
  -v \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_KEYSTORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -alias YOUR_KEY_ALIAS \
  -keystore nexa-production.jks \
  -dname "CN=Nexa,OU=Mobile,O=Rork,L=City,ST=State,C=US"
```

**2. Upload to EAS:**

```bash
eas credentials

# Select:
# → Android
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Keystore
# → Upload new Keystore

# Provide:
# - Keystore path: ./nexa-production.jks
# - Keystore password
# - Key alias
# - Key password
```

### Google Play Service Account (For Automated Submission)

**1. Create Service Account:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google Play Android Developer API
4. Create service account:
   - Name: `EAS Submit Service Account`
   - Role: `Service Account User`
5. Create JSON key
6. Download `service-account-key.json`

**2. Grant Access in Play Console:**

1. Go to [Google Play Console](https://play.google.com/console/)
2. Settings → API access
3. Link project to service account
4. Grant permissions:
   - ✅ View app information
   - ✅ Create and edit draft releases
   - ✅ Release to testing tracks
   - ✅ Release to production

**3. Add to EAS:**

```bash
# Store service account key in project root
# Add to .gitignore: service-account-key.json

# Reference in eas.json:
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json"
      }
    }
  }
}
```

### Managing Credentials

**View Current Credentials:**
```bash
eas credentials
```

**Remove Credentials:**
```bash
eas credentials

# Select credential to remove
# Confirm deletion
```

**Download Credentials (Backup):**
```bash
eas credentials

# Select:
# → Download credentials
# → Choose iOS or Android
# → Save to secure location
```

### Security Best Practices

1. **Never commit credentials to git:**
   ```gitignore
   # .gitignore
   *.jks
   *.keystore
   *.p12
   *.mobileprovision
   service-account-key.json
   credentials.json
   ```

2. **Use EAS managed credentials** for team projects
3. **Backup credentials** to secure location (1Password, LastPass, etc.)
4. **Rotate credentials** if compromised
5. **Limit access** to App Store Connect and Play Console

---

## Build Execution

### Environment Secrets

Set sensitive environment variables as EAS secrets:

```bash
# Legal document URLs
eas secret:create --scope project --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value "https://nexa.app/legal/privacy"
eas secret:create --scope project --name EXPO_PUBLIC_TERMS_URL --value "https://nexa.app/legal/terms"
eas secret:create --scope project --name EXPO_PUBLIC_ACCESSIBILITY_URL --value "https://nexa.app/legal/accessibility"
eas secret:create --scope project --name EXPO_PUBLIC_SUPPORT_URL --value "https://nexa.app/support"
eas secret:create --scope project --name EXPO_PUBLIC_MARKETING_URL --value "https://nexa.app"

# Optional: Backend services (for future phases)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your-supabase-url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-supabase-key"
eas secret:create --scope project --name EXPO_PUBLIC_RC_API_KEY --value "your-revenuecat-key"
eas secret:create --scope project --name EXPO_PUBLIC_POSTHOG_KEY --value "your-posthog-key"
eas secret:create --scope project --name SENTRY_DSN --value "your-sentry-dsn"
```

**List Secrets:**
```bash
eas secret:list --scope project
```

**Delete Secret:**
```bash
eas secret:delete --scope project --name SECRET_NAME
```

### iOS Production Build

**Step 1: Verify Configuration**

```bash
# Check app.json
cat app.json | grep -A 10 "ios"

# Check eas.json
cat eas.json | grep -A 10 "production"
```

**Step 2: Run Build**

```bash
# Build for iOS App Store
eas build --profile production --platform ios

# Follow prompts:
# 1. Confirm bundle identifier
# 2. Choose automatic credential management (if first build)
# 3. Wait for build to queue and start (~5-20 minutes)
```

**Step 3: Monitor Build**

```bash
# View build status
eas build:list --platform ios --status in-progress

# Or visit: https://expo.dev/accounts/[username]/projects/nexa/builds
```

**Step 4: Build Output**

When complete, you'll receive:
- Build URL in terminal
- Email notification
- Download link for .ipa file

**Expected Build Time:**
- First build: 20-40 minutes
- Subsequent builds: 10-20 minutes

### Android Production Build

**Step 1: Verify Configuration**

```bash
# Check app.json
cat app.json | grep -A 15 "android"

# Check eas.json
cat eas.json | grep -A 10 "production"
```

**Step 2: Run Build**

```bash
# Build for Google Play Store
eas build --profile production --platform android

# Follow prompts:
# 1. Confirm package name
# 2. Choose automatic keystore generation (if first build)
# 3. Wait for build to queue and start (~5-15 minutes)
```

**Step 3: Monitor Build**

```bash
# View build status
eas build:list --platform android --status in-progress

# Or visit: https://expo.dev/accounts/[username]/projects/nexa/builds
```

**Step 4: Build Output**

When complete, you'll receive:
- Build URL in terminal
- Email notification
- Download link for .aab file

**Expected Build Time:**
- First build: 15-30 minutes
- Subsequent builds: 8-15 minutes

### Building Both Platforms Simultaneously

```bash
# Build both iOS and Android
eas build --profile production --platform all

# Builds run in parallel
# Each platform can be monitored independently
```

### Build Commands Reference

```bash
# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview builds (for TestFlight/Internal Testing)
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Production builds
eas build --profile production --platform ios
eas build --profile production --platform android

# All platforms at once
eas build --profile production --platform all

# Local builds (runs on your machine)
eas build --profile production --platform ios --local
eas build --profile production --platform android --local

# Clear cache and rebuild
eas build --profile production --platform ios --clear-cache

# Wait for build to complete
eas build:wait [BUILD_ID]

# Cancel running build
eas build:cancel [BUILD_ID]
```

---

## Build Artifacts

### iOS Build Artifacts

#### .ipa File
- **Purpose**: iOS application archive for App Store submission
- **Location**: Download from EAS dashboard or via CLI
- **Size**: Typically 50-150 MB
- **Format**: Zipped iOS application bundle

**Downloading .ipa:**

```bash
# List recent builds
eas build:list --platform ios --limit 10

# Download specific build
eas build:download [BUILD_ID]

# Download latest production build
eas build:download --platform ios --profile production
```

**Using .ipa:**
1. **TestFlight Upload**: Use `eas submit` or Transporter app
2. **App Store Submission**: Upload via App Store Connect
3. **Ad-hoc Installation**: For registered devices only

#### Build Metadata

Each iOS build includes:
- Bundle identifier
- Version number
- Build number
- Provisioning profile
- Signing certificate
- Build timestamp
- Git commit hash

### Android Build Artifacts

#### .aab File (Android App Bundle)
- **Purpose**: Google Play Store submission (recommended)
- **Location**: Download from EAS dashboard or via CLI
- **Size**: Typically 30-80 MB (smaller than APK)
- **Format**: Optimized bundle for Play Store distribution

**Downloading .aab:**

```bash
# List recent builds
eas build:list --platform android --limit 10

# Download specific build
eas build:download [BUILD_ID]

# Download latest production build
eas build:download --platform android --profile production
```

**Using .aab:**
1. **Play Console Upload**: Use `eas submit` or manual upload
2. **Google Play Submission**: Upload to production track
3. **Internal Testing**: Upload to internal test track

#### .apk File (Android Package)
- **Purpose**: Direct installation on devices
- **Location**: Only generated for development/preview profiles
- **Size**: Typically 50-120 MB (larger than AAB)
- **Format**: Installable Android package

**Note:** Production builds create .aab files by default. To create APK for production:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### Build Metadata

Each Android build includes:
- Package name
- Version name
- Version code
- Signing key fingerprint
- Build timestamp
- Git commit hash

### Build Inspection

**View Build Details:**
```bash
# Get build info
eas build:view [BUILD_ID]

# List all builds
eas build:list

# Filter by platform
eas build:list --platform ios
eas build:list --platform android

# Filter by status
eas build:list --status finished
eas build:list --status errored

# Filter by profile
eas build:list --profile production
```

**Build Information Includes:**
- Build ID
- Platform
- Profile
- Status (queued, in-progress, finished, errored, canceled)
- Created date
- Duration
- Download URL
- Git commit

### Submission Preparation

#### iOS - TestFlight Submission

```bash
# Submit latest production build to TestFlight
eas submit --profile production --platform ios --latest

# Submit specific build
eas submit --platform ios --id [BUILD_ID]

# This will:
# 1. Upload .ipa to App Store Connect
# 2. Make build available in TestFlight
# 3. Notify you when ready for testing
```

#### Android - Google Play Submission

```bash
# Submit latest production build to Play Store
eas submit --profile production --platform android --latest

# Submit to specific track
eas submit --platform android --id [BUILD_ID] --track internal

# Available tracks:
# - internal: Internal testing (up to 100 testers)
# - alpha: Alpha testing (open or closed)
# - beta: Beta testing (open or closed)
# - production: Public release
```

### Build Storage and Retention

**EAS Build Storage:**
- **Free Plan**: Builds stored for 30 days
- **Production Plan**: Builds stored for 6 months
- **Enterprise Plan**: Builds stored for 1 year

**Download and Archive:**
```bash
# Download all recent builds for archival
for build in $(eas build:list --platform all --json | jq -r '.[].id'); do
  eas build:download $build
done
```

**Recommended Archival:**
- Store production builds in secure cloud storage (S3, Google Cloud Storage)
- Keep metadata log (version, build number, date, commit hash)
- Backup signing credentials separately

---

## Validation Checklist

### Pre-Build Validation

**Code Quality:**
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Tests (if configured)
npm test
```

**Asset Validation:**
```bash
# Validate all assets exist
node scripts/validate-assets.js

# Expected output:
# ✅ Icon: ./assets/images/icon.png
# ✅ Splash: ./assets/images/splash-icon.png
# ✅ Adaptive Icon: ./assets/images/adaptive-icon.png
# ✅ All assets valid!
```

**Configuration Validation:**
```bash
# Check app.json syntax
cat app.json | jq '.'

# Check eas.json syntax
cat eas.json | jq '.'

# Verify bundle IDs match
grep -E "(bundleIdentifier|package)" app.json
```

**Environment Variables:**
```bash
# List all secrets
eas secret:list --scope project

# Verify required secrets exist:
# - EXPO_PUBLIC_PRIVACY_POLICY_URL
# - EXPO_PUBLIC_TERMS_URL
# - EXPO_PUBLIC_ACCESSIBILITY_URL
# - EXPO_PUBLIC_SUPPORT_URL
# - EXPO_PUBLIC_MARKETING_URL
```

### Post-Build Validation

**Build Success Verification:**
```bash
# Check build status
eas build:view [BUILD_ID]

# Expected output:
# Status: finished
# Platform: ios/android
# Duration: XX minutes
# Download URL: https://...
```

**Download and Inspect:**
```bash
# Download build
eas build:download [BUILD_ID]

# iOS inspection (macOS only)
unzip -l nexa-app.ipa

# Android inspection
unzip -l nexa-app.aab
```

**Certificate Validation (iOS):**
```bash
# Check certificate validity
eas credentials

# Select:
# → iOS
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Distribution Certificate
# → View details

# Verify:
# - Certificate not expired
# - Team ID matches
# - Bundle ID matches
```

**Keystore Validation (Android):**
```bash
# Check keystore details
eas credentials

# Select:
# → Android
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Keystore
# → View details

# Verify:
# - Alias matches
# - Key not expired
# - Package name matches
```

### Functional Testing

**iOS Testing (TestFlight):**

After submission to TestFlight:

1. **Install on Device:**
   - Open TestFlight app
   - Accept invitation
   - Install Nexa

2. **Test Core Flows:**
   - [ ] App launches successfully
   - [ ] Onboarding flow completes
   - [ ] Task creation works
   - [ ] AI task breakdown functions
   - [ ] Breathing exercises load
   - [ ] Accessibility settings apply
   - [ ] Notifications permission prompt
   - [ ] Location permission prompt (if applicable)
   - [ ] No crashes on critical paths

3. **Test Permissions:**
   - [ ] Camera access works
   - [ ] Photo library access works
   - [ ] Microphone access works (if applicable)
   - [ ] Location access works
   - [ ] Notification access works

4. **Test Legal Links:**
   - [ ] Privacy Policy opens
   - [ ] Terms of Service opens
   - [ ] Accessibility Statement opens
   - [ ] Support link works
   - [ ] All legal links load correctly

**Android Testing (Internal Track):**

After submission to Play Store Internal Testing:

1. **Install on Device:**
   - Accept internal testing invitation
   - Open Play Store
   - Install Nexa

2. **Test Core Flows:**
   - [ ] App launches successfully
   - [ ] Onboarding flow completes
   - [ ] Task creation works
   - [ ] AI task breakdown functions
   - [ ] Breathing exercises load
   - [ ] Accessibility settings apply
   - [ ] Notifications permission prompt
   - [ ] Location permission prompt (if applicable)
   - [ ] No crashes on critical paths

3. **Test Permissions:**
   - [ ] Camera access works
   - [ ] Photo library access works
   - [ ] Microphone access works (if applicable)
   - [ ] Location access works
   - [ ] Notification access works

4. **Test Legal Links:**
   - [ ] Privacy Policy opens
   - [ ] Terms of Service opens
   - [ ] Accessibility Statement opens
   - [ ] Support link works
   - [ ] All legal links load correctly

### Integration Validation

**Crash Reporting (Sentry):**

If Sentry is integrated:

```bash
# Verify Sentry DSN is set
eas secret:list | grep SENTRY

# Trigger test crash
# Check Sentry dashboard for crash report
```

**Analytics (PostHog):**

If PostHog is integrated:

```bash
# Verify PostHog key is set
eas secret:list | grep POSTHOG

# Launch app
# Check PostHog dashboard for events
```

**In-App Purchases (RevenueCat):**

If RevenueCat is integrated:

```bash
# Verify RevenueCat key is set
eas secret:list | grep RC_API_KEY

# Test subscription flow
# Check RevenueCat dashboard for test transaction
```

### Store Listing Validation

**iOS - App Store Connect:**

1. **App Information:**
   - [ ] Name: Nexa
   - [ ] Subtitle: Cognitive support that adapts to you
   - [ ] Bundle ID matches app.json
   - [ ] Privacy Policy URL works
   - [ ] Terms URL works

2. **Screenshots:**
   - [ ] 6.7" iPhone screenshots uploaded (3-10)
   - [ ] 6.1" iPhone screenshots uploaded (3-10)
   - [ ] iPad screenshots uploaded (optional)
   - [ ] Screenshots follow guidelines

3. **Build Status:**
   - [ ] Build appears in App Store Connect
   - [ ] Build processing complete
   - [ ] No warnings or errors
   - [ ] TestFlight enabled

**Android - Play Console:**

1. **App Information:**
   - [ ] Name: Nexa
   - [ ] Short description (80 chars)
   - [ ] Full description (4000 chars)
   - [ ] Package name matches app.json
   - [ ] Privacy Policy URL works

2. **Graphics:**
   - [ ] App icon (512×512)
   - [ ] Feature graphic (1024×500)
   - [ ] Phone screenshots (2-8)
   - [ ] Tablet screenshots (optional)

3. **Build Status:**
   - [ ] Build appears in Play Console
   - [ ] Build uploaded successfully
   - [ ] No warnings or errors
   - [ ] Ready for release

---

## Troubleshooting

### Build Failures

#### "No valid provisioning profile found" (iOS)

**Cause:** Missing or expired provisioning profile

**Solution:**
```bash
# Regenerate credentials
eas credentials

# Select:
# → iOS
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Provisioning Profile
# → Remove existing profile
# → Add new Provisioning Profile

# Retry build
eas build --profile production --platform ios
```

#### "Gradle build failed" (Android)

**Cause:** Dependency conflicts or configuration issues

**Solution:**
```bash
# Check build logs
eas build:view [BUILD_ID]

# Common fixes:
# 1. Clear cache
eas build --profile production --platform android --clear-cache

# 2. Update Gradle version in android/build.gradle
# 3. Check for dependency conflicts in package.json

# 4. Retry build
eas build --profile production --platform android
```

#### "Out of memory" Error

**Cause:** Build requires more resources

**Solution:**

Update `eas.json`:
```json
{
  "build": {
    "production": {
      "resourceClass": "large"
    }
  }
}
```

Then retry build:
```bash
eas build --profile production --platform all
```

#### "Duplicate resources" Error

**Cause:** Conflicting assets or dependencies

**Solution:**
```bash
# Check for duplicate files
find assets -type f -name "*.png" | sort | uniq -d

# Check for conflicting dependencies
npm ls [package-name]

# Update dependencies
npm update
npm dedupe

# Retry build
eas build --profile production --platform all
```

### Credential Issues

#### "Certificate expired" (iOS)

**Solution:**
```bash
# Remove expired certificate
eas credentials

# Select:
# → iOS
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Distribution Certificate
# → Remove

# Generate new certificate
# → Add new Distribution Certificate

# Rebuild
eas build --profile production --platform ios
```

#### "Keystore mismatch" (Android)

**Cause:** Using different keystore than Play Store expects

**Solution:**
```bash
# Check current keystore
eas credentials

# If first upload to Play Store:
# - Download keystore from EAS
# - Use same keystore for all future builds

# If updating existing app:
# - Use original keystore from previous builds
# - Upload original keystore to EAS
eas credentials

# Select:
# → Android
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Keystore
# → Upload existing Keystore
```

### Submission Failures

#### "App crashes on launch" (iOS)

**Solutions:**
1. Test on physical device before submission
2. Check crash logs in Xcode or Sentry
3. Verify all required frameworks are included
4. Test with release build configuration

```bash
# Test release build locally
eas build --profile preview --platform ios --local

# Install on device via TestFlight first
eas submit --platform ios --profile preview
```

#### "Missing privacy policy" (Both)

**Solution:**
```bash
# Verify privacy policy URL is accessible
curl -I https://nexa.app/legal/privacy

# Should return: HTTP/1.1 200 OK

# If not accessible:
# 1. Host legal documents
# 2. Update URLs in app.json
# 3. Update EAS secrets
eas secret:create --scope project --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value "https://nexa.app/legal/privacy" --force

# Rebuild and resubmit
eas build --profile production --platform all
eas submit --platform all --latest
```

#### "Misleading medical claims" (Both)

**Solution:**
1. Add prominent disclaimer in app
2. Update store description to avoid diagnosis language
3. Use phrases like "support for" instead of "treats"
4. Clarify app is not a medical device

**App Disclaimer:**
```
IMPORTANT: This app is not a medical device and does not provide medical advice, diagnosis, or treatment. It is designed to support daily living skills for individuals with cognitive differences. Always consult qualified healthcare professionals for medical decisions.
```

### Environment Issues

#### "Environment variables not working"

**Solutions:**

1. **List current secrets:**
```bash
eas secret:list --scope project
```

2. **Verify secret names match code:**
```bash
# Secrets must be prefixed with EXPO_PUBLIC_ to be accessible
# in client code

# Check your code for:
process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL

# Ensure secret name is:
EXPO_PUBLIC_PRIVACY_POLICY_URL
```

3. **Update secrets:**
```bash
# Update existing secret
eas secret:create --scope project --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value "https://nexa.app/legal/privacy" --force

# Delete and recreate
eas secret:delete --scope project --name EXPO_PUBLIC_PRIVACY_POLICY_URL
eas secret:create --scope project --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value "https://nexa.app/legal/privacy"
```

4. **Rebuild:**
```bash
eas build --profile production --platform all --clear-cache
```

### Performance Issues

#### "Build takes too long"

**Normal build times:**
- First build: 20-40 minutes (iOS), 15-30 minutes (Android)
- Subsequent builds: 10-20 minutes (iOS), 8-15 minutes (Android)

**Optimization strategies:**

1. **Use larger resource class:**
```json
{
  "build": {
    "production": {
      "resourceClass": "large"
    }
  }
}
```

2. **Enable caching:**
```json
{
  "build": {
    "production": {
      "cache": {
        "key": "production-cache",
        "paths": ["node_modules", ".expo"]
      }
    }
  }
}
```

3. **Optimize dependencies:**
```bash
# Remove unused dependencies
npm prune

# Update to latest versions
npm update

# Use npm ci for faster installs
# (EAS does this automatically)
```

#### "Can't install on device"

**iOS Solutions:**

1. **Check device is registered:**
```bash
# Add device UDID to Apple Developer portal
# Devices → Register new device
# Enter device UDID and name

# Regenerate provisioning profile
eas credentials

# Select:
# → iOS
# → app.rork.nexa-cognitive-disorders-support-ykokwhv
# → Provisioning Profile
# → Remove and regenerate
```

2. **Use TestFlight for easier distribution:**
```bash
# Submit to TestFlight
eas submit --platform ios --latest

# Add testers in App Store Connect
# Testers receive email invitation
```

**Android Solutions:**

1. **Enable installation from unknown sources:**
   - Settings → Security → Unknown sources → Enable

2. **Use Internal Testing track:**
```bash
# Submit to Internal Testing
eas submit --platform android --latest --track internal

# Add testers via email in Play Console
```

### Common Error Messages

#### "Cannot find module 'expo-router'"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear Expo cache
npx expo start -c

# Rebuild
eas build --profile production --platform all --clear-cache
```

#### "Invariant Violation: Native module cannot be null"

**Cause:** Native module not properly linked or installed

**Solution:**
```bash
# Clear cache and rebuild
eas build --profile production --platform all --clear-cache

# If issue persists, check package.json for:
# - Missing dependencies
# - Version mismatches
# - Peer dependency conflicts

# Update dependencies
npm update
npm install
```

#### "Build timed out"

**Cause:** Build exceeds timeout limit

**Solutions:**

1. **Use larger resource class:**
```json
{
  "build": {
    "production": {
      "resourceClass": "large"
    }
  }
}
```

2. **Optimize build:**
```bash
# Remove unnecessary assets
# Optimize images
# Remove unused dependencies

# Retry build
eas build --profile production --platform all
```

3. **Contact EAS support** if issue persists

---

## Additional Resources

### Official Documentation

**Expo EAS:**
- [EAS Build Introduction](https://docs.expo.dev/build/introduction/)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)

**App Store:**
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

**Google Play:**
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)

### Community Support

**Forums:**
- [Expo Forums](https://forums.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
- [Reddit r/reactnative](https://reddit.com/r/reactnative)

**Discord:**
- [Expo Discord](https://chat.expo.dev/)
- [Reactiflux](https://www.reactiflux.com/)

### Video Tutorials

- [EAS Build Crash Course (YouTube)](https://www.youtube.com/results?search_query=eas+build+tutorial)
- [Expo Official Channel](https://www.youtube.com/@expo-apps)

### Blog Posts

- [Expo Blog: EAS Build](https://blog.expo.dev/tag/eas-build)
- [React Native Radio Podcast](https://reactnativeradio.com/)

---

## Next Steps

### After Successful Build

1. **Test thoroughly:**
   - [ ] Install on multiple devices
   - [ ] Test all critical flows
   - [ ] Verify legal links
   - [ ] Check permissions
   - [ ] Test offline functionality

2. **Submit to test tracks:**
   ```bash
   # iOS TestFlight
   eas submit --platform ios --latest

   # Android Internal Testing
   eas submit --platform android --latest --track internal
   ```

3. **Gather feedback:**
   - [ ] Internal team testing
   - [ ] Beta tester feedback
   - [ ] Accessibility testing
   - [ ] Performance monitoring

4. **Fix issues:**
   - [ ] Address crash reports
   - [ ] Fix critical bugs
   - [ ] Improve performance
   - [ ] Update based on feedback

5. **Prepare for production:**
   - [ ] Complete store listings (see `store/ios-metadata.md` and `store/android-metadata.md`)
   - [ ] Upload screenshots (see `SCREENSHOT_GUIDE.md`)
   - [ ] Finalize legal documents
   - [ ] Set up analytics (optional)
   - [ ] Configure crash reporting (optional)

6. **Submit to app stores:**
   ```bash
   # Final production builds
   eas build --profile production --platform all

   # Submit to stores
   eas submit --platform ios --latest
   eas submit --platform android --latest --track production
   ```

### Continuous Deployment

**Set up GitHub Actions for automated builds:**

```yaml
# .github/workflows/eas-build.yml
name: EAS Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g eas-cli
      - run: eas build --platform all --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

**Generate EXPO_TOKEN:**
```bash
eas whoami
eas token:create
```

Add token to GitHub repository secrets.

---

## Summary

You now have a complete guide to:

✅ **Set up EAS CLI** and authenticate
✅ **Configure build profiles** in eas.json
✅ **Prepare app configuration** in app.json
✅ **Manage credentials** for iOS and Android
✅ **Execute production builds** with confidence
✅ **Download and validate** build artifacts
✅ **Submit to app stores** via EAS Submit
✅ **Troubleshoot common issues** effectively

**Next Phase:** [Phase 6: App Store Submission](./PHASE_6_STORE_SUBMISSION.md)

---

**Questions or Issues?**

- Check [Troubleshooting](#troubleshooting) section
- Visit [Expo Forums](https://forums.expo.dev/)
- Review [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- Contact Expo support via dashboard

---

*Build with confidence. Ship with pride. Support independence.*

**Good luck with your production builds! 🚀**
