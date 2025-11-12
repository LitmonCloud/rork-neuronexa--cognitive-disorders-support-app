# 📱 Expo Go Limitations Reference

**Last Updated**: 2025-11-12
**Expo SDK**: 54
**React Native**: 0.81.5

---

## Overview

Expo Go is a powerful development tool that enables rapid iteration and testing without building native binaries. However, it has **platform limitations** that affect certain production features. This document categorizes these limitations and provides workarounds.

---

## 🚦 Feature Compatibility Matrix

| Feature | Expo Go | Dev Build | Standalone | Notes |
|---------|---------|-----------|------------|-------|
| **In-App Purchases (RevenueCat)** | ⚠️ Mock Only | ✅ Full | ✅ Full | Expo Go: Preview API mode, no real purchases |
| **Push Notifications (Remote)** | ❌ Removed SDK 53+ | ✅ Full | ✅ Full | Expo Go: Local notifications only |
| **Local Notifications** | ✅ Full | ✅ Full | ✅ Full | Works everywhere |
| **Supabase Backend** | ✅ Full | ✅ Full | ✅ Full | No limitations |
| **Sentry Crash Reporting** | ⚠️ Basic | ✅ Full | ✅ Full | Expo Go: No slow frames, TTID, TTFD |
| **PostHog Analytics** | ✅ Full | ✅ Full | ✅ Full | No limitations |
| **Camera** | ✅ Full | ✅ Full | ✅ Full | expo-camera works |
| **Location** | ✅ Full | ✅ Full | ✅ Full | expo-location works |
| **Audio Recording** | ✅ Full | ✅ Full | ✅ Full | expo-audio works (migrate from expo-av) |
| **Video Playback** | ✅ Full | ✅ Full | ✅ Full | expo-video works (migrate from expo-av) |
| **react-native-reanimated** | ✅ Full | ✅ Full | ✅ Full | Works with babel plugin |
| **@shopify/react-native-skia** | ✅ Full | ✅ Full | ✅ Full | Works for finger trace exercises |

**Legend**:
- ✅ Full: Complete functionality
- ⚠️ Partial: Works with limitations
- ❌ Not Available: Feature unavailable

---

## 🔴 Critical Limitations (Require Dev Build)

### 1. RevenueCat In-App Purchases

**Status**: ⚠️ **Mock Mode Only in Expo Go**

**Why it's Limited:**
- Native iOS/Android In-App Purchase APIs not available in Expo Go
- App Store/Google Play connectivity requires signed app bundles
- RevenueCat SDK detects Expo Go and enters "Preview API Mode"

**Current Behavior in Expo Go:**
```typescript
// RevenueCat automatically detects Expo Go
if (isExpoGo) {
  // Preview API Mode:
  - UI/UX testing works ✅
  - Subscription flows testable ✅
  - Actual purchases blocked ❌
  - Customer info always returns "free tier" ❌
}
```

**Workaround:**
1. **Short-term (Expo Go)**:
   - Continue developing subscription UI
   - Test user flows with mock APIs
   - Validate paywall designs

2. **Production Testing (Dev Build)**:
   - Create development build with EAS
   - Configure real Rev

enueCat API keys
   - Test on physical device (required by Apple/Google)
   - Use RevenueCat sandbox for testing

**Files Affected:**
- `services/subscriptions/RevenueCatService.ts`
- `contexts/SubscriptionContext.tsx`
- `app/paywall-revenuecat.tsx`
- `app/customer-center.tsx`

**Configuration Required for Dev Build:**
```bash
# .env
EXPO_PUBLIC_RC_IOS_API_KEY=appl_your_real_ios_key
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_your_real_android_key
```

**Documentation:**
- https://www.revenuecat.com/docs/getting-started/installation/expo
- https://www.revenuecat.com/blog/engineering/expo-in-app-purchase-tutorial/

---

### 2. Push Notifications (Remote)

**Status**: ❌ **Removed in SDK 53+**

**What Changed:**
- **SDK 52 and earlier**: Remote push worked in Expo Go using Expo's credentials
- **SDK 53 (Nov 2024)**: Remote push removed from Android Expo Go
- **SDK 54 (Current)**: Remote push removed from iOS and Android Expo Go

**Why it Was Removed:**
- Apple and Google require proper app credentials for push
- Expo Go cannot manage unique push certificates for every dev project
- Security and privacy concerns with shared credentials

**What Still Works in Expo Go:**
- ✅ Local notifications (scheduled, in-app)
- ✅ Notification UI development
- ✅ Notification handling logic
- ✅ Notification permissions

**What Requires Dev Build:**
- ❌ Remote push from server (FCM/APNs)
- ❌ Push notification testing with backend
- ❌ Expo Push Service integration
- ❌ Badge management from remote push

**Current App Behavior:**
```typescript
// NotificationContext.tsx
const isExpoGo = Constants.appOwnership === 'expo';

if (isExpoGo) {
  console.log('[Notifications] Expo Go detected - local notifications only');
  // Only local notifications work
  // Remote push silently fails
}
```

**Workaround:**
1. **Short-term (Expo Go)**:
   - Develop UI with local notifications
   - Test notification display and interaction
   - Mock push notification payloads

2. **Production Testing (Dev Build)**:
   - Configure FCM (Android) and APNs (iOS)
   - Create development build
   - Test on physical device
   - Integrate with Expo Push Service or custom backend

**Files Affected:**
- `contexts/NotificationContext.tsx`
- `services/notifications/PushNotificationService.ts`
- `services/notifications/RealtimeNotificationService.ts`
- `components/RealtimeNotificationListener.tsx`

**Documentation:**
- https://docs.expo.dev/push-notifications/overview/
- https://docs.expo.dev/push-notifications/faq/
- https://blog.expo.dev/expo-sdk-53-4e7bbb89f0c9 (announcement)

---

### 3. Sentry Performance Metrics

**Status**: ⚠️ **Basic Crash Reporting Only**

**What Works in Expo Go:**
- ✅ Error capture and crash reporting
- ✅ Breadcrumbs and context
- ✅ User identification
- ✅ Release tracking
- ✅ Environment tagging

**What Requires Dev Build:**
- ❌ Slow and frozen frames detection
- ❌ Time to Initial Display (TTID)
- ❌ Time to Full Display (TTFD)
- ❌ Native crash symbolication
- ❌ Automatic source map upload

**Why Limited:**
- Performance metrics require native profiling hooks
- Expo Go cannot inject custom native profilers
- Source maps need custom build process

**Current Implementation:**
```typescript
// SentryService.ts
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: isExpoGo ? 'expo-go' : 'production',
  // These features only work in dev/production builds:
  enableNativeFramesTracking: !isExpoGo,
  enableAutoSessionTracking: true,
});
```

**Workaround:**
- Use Expo Go for crash reporting development
- Test performance features in development build
- Full monitoring requires production build

**Files Affected:**
- `services/analytics/SentryService.ts`
- `components/ErrorBoundary.tsx`
- `app/_layout.tsx`

**Documentation:**
- https://docs.sentry.io/platforms/react-native/manual-setup/expo/
- https://docs.expo.dev/guides/using-sentry/

---

## ✅ Fully Compatible Features

### 1. Supabase Backend

**Status**: ✅ **Fully Compatible**

**Why It Works:**
- Supabase client is pure JavaScript
- No native modules required
- Works via standard HTTPS/WebSockets
- Row Level Security (RLS) protects data

**Features That Work:**
- ✅ Authentication (Email, OAuth, Magic Link)
- ✅ Database queries (PostgreSQL via REST)
- ✅ Real-time subscriptions (WebSockets)
- ✅ Storage (file uploads/downloads)
- ✅ Edge Functions (serverless API calls)
- ✅ Row Level Security (RLS)

**Implementation:**
```typescript
// SupabaseService.ts - Works identically in Expo Go and builds
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage, // Works in Expo Go
      autoRefreshToken: true,
    },
  }
);
```

**Files:**
- `services/backend/SupabaseService.ts`

**Documentation:**
- https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
- https://docs.expo.dev/guides/using-supabase/

---

### 2. PostHog Analytics

**Status**: ✅ **Fully Compatible**

**Why It Works:**
- JavaScript-only SDK
- No native dependencies
- Standard HTTP API calls

**Features That Work:**
- ✅ Event tracking
- ✅ Screen view tracking
- ✅ User properties
- ✅ Feature flags
- ✅ A/B testing
- ✅ Session recording (React Native compatible)

**Implementation:**
```typescript
// PostHogService.ts - Identical behavior in Expo Go and builds
posthog.init(apiKey, {
  host: 'https://app.posthog.com',
  // All features work in Expo Go
});
```

**Files:**
- `services/analytics/PostHogService.ts`

---

### 3. Local Notifications

**Status**: ✅ **Fully Compatible**

**What Works:**
- ✅ Schedule local notifications
- ✅ Notification display
- ✅ Notification actions
- ✅ Notification categories
- ✅ Badge management
- ✅ Sound and vibration
- ✅ Notification listeners

**Implementation:**
```typescript
// Works identically in Expo Go and builds
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Task Reminder',
    body: 'Time to complete your task!',
  },
  trigger: {
    seconds: 60,
  },
});
```

**Files:**
- `contexts/NotificationContext.tsx` (local notifications portion)
- `services/notifications/RealtimeNotificationService.ts`

---

### 4. Audio & Video (After Migration)

**Status**: ✅ **Fully Compatible** (after migrating from expo-av)

**Migration Required:**
- ❌ `expo-av` - Deprecated, removed in SDK 54
- ✅ `expo-audio` - Replacement for audio
- ✅ `expo-video` - Replacement for video

**Both Work in Expo Go:**
```typescript
// expo-audio - Works in Expo Go
import { Audio, useAudioPlayer } from 'expo-audio';

// expo-video - Works in Expo Go
import { VideoView } from 'expo-video';
```

**Files to Migrate:**
- `services/accessibility/SpeechToTextService.ts`
- Any other files using `expo-av`

**Documentation:**
- https://docs.expo.dev/versions/latest/sdk/audio/
- https://docs.expo.dev/versions/latest/sdk/video/

---

## 🔄 When to Switch to Development Build

### Stay on Expo Go If:
- ✅ Pure UI/UX prototyping
- ✅ Learning and experimenting
- ✅ Testing non-native features
- ✅ Rapid iteration needed
- ✅ No IAP or remote push testing needed

### Switch to Dev Build When:
- ⚠️ Testing in-app purchases
- ⚠️ Testing push notifications
- ⚠️ Using custom native modules
- ⚠️ Full Sentry performance monitoring
- ⚠️ App Store submission preparation
- ⚠️ Production-like testing required

---

## 📋 Development Build Setup

**Quick Start:**
```bash
# 1. Install EAS CLI
npm install -g eas-cli
eas login

# 2. Initialize EAS
eas init

# 3. Install dev client
npx expo install expo-dev-client

# 4. Create development build
eas build --profile development --platform ios
eas build --platform android --profile development

# 5. Install on device/simulator
# iOS: Download .app and install
# Android: Download .apk and install
```

**See**: `DEV_BUILD_SETUP.md` for complete guide

---

## 🎯 Recommendations for Nexa App

### Current Status (Expo Go):
- ✅ **90% features work**
- ✅ All UI/UX development
- ✅ Supabase backend
- ✅ Local notifications
- ✅ Analytics (PostHog)
- ✅ Basic crash reporting (Sentry)
- ⚠️ RevenueCat (mock mode only)
- ❌ Remote push notifications

### Recommended Workflow:
1. **Phase 1 (Current)**: Continue Expo Go for:
   - UI development
   - Backend integration (Supabase)
   - Analytics setup
   - Local notification flows

2. **Phase 2 (Before App Store)**: Switch to dev build for:
   - Real IAP testing
   - Push notification testing
   - Full Sentry monitoring
   - Production candidate builds

3. **Phase 3 (Production)**: Production build for:
   - App Store submission
   - Google Play submission
   - Over-the-air updates

---

## 🔗 Additional Resources

**Official Documentation:**
- Expo Go vs Development Builds: https://docs.expo.dev/develop/development-builds/introduction/
- EAS Build: https://docs.expo.dev/build/introduction/
- Expo SDK Changelog: https://docs.expo.dev/versions/latest/

**Service Documentation:**
- RevenueCat + Expo: https://www.revenuecat.com/docs/getting-started/installation/expo
- Supabase + Expo: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
- Sentry + Expo: https://docs.sentry.io/platforms/react-native/manual-setup/expo/

---

**Summary**: Expo Go enables 90% of Nexa app development. Switch to development build when you need real IAP testing, remote push notifications, or are preparing for App Store submission.

**Last Updated**: 2025-11-12
