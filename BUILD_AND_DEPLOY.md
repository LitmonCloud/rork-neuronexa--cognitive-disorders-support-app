# NeuroNexa — Build & Deployment Guide

**Version:** 1.0.0  
**Last Updated:** 2025-10-02  
**Target:** App Store & Google Play Store

---

## 📋 Pre-Deployment Checklist

Before building for production, ensure all items are complete:

### Critical Requirements ✅
- [ ] Legal documents hosted and accessible
- [ ] Screenshots captured for all device sizes
- [ ] Assets validated (run `node scripts/validate-assets.js`)
- [ ] Environment variables configured
- [ ] App tested on physical devices (iOS & Android)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint errors (`npm run lint`)
- [ ] Medical disclaimer visible in app and store description

### Optional Enhancements (Can defer to v1.1)
- [ ] RevenueCat IAP integrated
- [ ] PostHog analytics integrated
- [ ] Sentry crash reporting integrated
- [ ] Supabase backend integrated
- [ ] Push notifications configured

---

## 🔧 Environment Setup

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure Project

```bash
# Initialize EAS (if not already done)
eas build:configure

# Link to your Expo project
eas init --id YOUR_PROJECT_ID
```

### 4. Set Environment Secrets

For production builds, set secrets in EAS (not in .env file):

```bash
# Required for MVP
eas secret:create --scope project --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value "https://neuronexa.app/legal/privacy"
eas secret:create --scope project --name EXPO_PUBLIC_TERMS_URL --value "https://neuronexa.app/legal/terms"
eas secret:create --scope project --name EXPO_PUBLIC_ACCESSIBILITY_URL --value "https://neuronexa.app/legal/accessibility"
eas secret:create --scope project --name EXPO_PUBLIC_SUPPORT_URL --value "https://neuronexa.app/support"
eas secret:create --scope project --name EXPO_PUBLIC_MARKETING_URL --value "https://neuronexa.app"

# Optional (for v1.1)
eas secret:create --scope project --name EXPO_PUBLIC_RC_API_KEY --value "your_revenuecat_key"
eas secret:create --scope project --name EXPO_PUBLIC_POSTHOG_KEY --value "your_posthog_key"
eas secret:create --scope project --name SENTRY_DSN --value "your_sentry_dsn"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your_supabase_url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_supabase_key"
```

---

## 🏗️ Building for Development

### iOS Development Build

```bash
# Build for iOS simulator
eas build --profile development --platform ios

# Install on simulator
# Download the .tar.gz file from EAS dashboard
# Drag and drop onto simulator
```

### Android Development Build

```bash
# Build for Android emulator/device
eas build --profile development --platform android

# Install on device
adb install path/to/app.apk
```

---

## 🧪 Building for Testing (TestFlight / Internal Testing)

### iOS Preview Build (TestFlight)

```bash
# Build for TestFlight
eas build --profile preview --platform ios

# Submit to TestFlight (after build completes)
eas submit --platform ios --latest
```

**TestFlight Setup:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Create new app (if not exists)
3. Fill in basic information
4. Add internal testers
5. Wait for build to process (~15-30 minutes)
6. Distribute to testers

### Android Preview Build (Internal Testing)

```bash
# Build for Google Play Internal Testing
eas build --profile preview --platform android

# Submit to Google Play (after build completes)
eas submit --platform android --latest
```

**Google Play Setup:**
1. Go to [Google Play Console](https://play.google.com/console/)
2. Create new app (if not exists)
3. Complete store listing
4. Set up Internal Testing track
5. Upload build
6. Add internal testers
7. Publish to Internal Testing

---

## 🚀 Building for Production

### iOS Production Build

```bash
# Build for App Store
eas build --profile production --platform ios

# This will:
# - Use production environment variables
# - Auto-increment build number
# - Create optimized bundle
# - Generate .ipa file for App Store
```

### Android Production Build

```bash
# Build for Google Play
eas build --profile production --platform android

# This will:
# - Use production environment variables
# - Auto-increment version code
# - Create optimized bundle
# - Generate .aab file for Play Store
```

---

## 📱 App Store Submission

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Enroll at: https://developer.apple.com/programs/

2. **App Store Connect Setup**
   - Create app listing
   - Configure IAP products (if using RevenueCat)
   - Set up App Store metadata

### Step-by-Step Submission

#### 1. Prepare Store Listing

Go to [App Store Connect](https://appstoreconnect.apple.com/) and fill in:

**App Information:**
- Name: NeuroNexa
- Subtitle: Cognitive support that adapts to you
- Primary Language: English (U.S.)
- Bundle ID: app.rork.neuronexa-cognitive-disorders-support-ykokwhv
- SKU: neuronexa-1

**Pricing and Availability:**
- Price: Free
- Availability: All countries

**App Privacy:**
- Privacy Policy URL: https://neuronexa.app/legal/privacy
- Data Collection: See `store/ios-metadata.md`

#### 2. Upload Screenshots

Upload screenshots from `store/screenshots/ios-6_7/` and `store/screenshots/ios-6_1/`:

**Required Sizes:**
- iPhone 6.7" (1290 × 2796) - 3-10 screenshots
- iPhone 6.1" (1179 × 2556) - 3-10 screenshots
- iPad Pro 12.9" (2048 × 2732) - Optional but recommended

**Screenshot Order:**
1. Home / Today (Nexa greeting + tasks)
2. AI Task Breakdown
3. Breathing Exercise
4. Accessibility Settings
5. Progress Analytics
6. Caregiver Management
7. Onboarding

#### 3. Fill in Metadata

Copy content from `store/ios-metadata.md`:

- **Description:** Full app description
- **Keywords:** ADHD,autism,neurodiversity,cognitive support,task coach,breathing,focus,executive function,reminders,routines,anxiety
- **Support URL:** https://neuronexa.app/support
- **Marketing URL:** https://neuronexa.app
- **Promotional Text:** (Optional) Highlight new features

#### 4. Configure Age Rating

Answer questionnaire:
- Unrestricted Web Access: No
- Gambling: No
- Contests: No
- Medical/Treatment Information: Yes (informational only)
- Result: 4+

#### 5. Upload Build

```bash
# Build and submit
eas build --profile production --platform ios
eas submit --platform ios --latest

# Or manually upload via Xcode or Transporter app
```

#### 6. Submit for Review

1. Select build version
2. Add "What's New in This Version" text
3. Add reviewer notes (if needed):
   ```
   NeuroNexa is a cognitive support app designed for individuals with ADHD, autism, and other cognitive disabilities. It does not provide medical advice or diagnosis.
   
   Test Account (if needed):
   - Email: test@neuronexa.app
   - Password: TestPass123!
   
   Key Features to Test:
   - Task creation and AI breakdown
   - Breathing exercises
   - Accessibility settings (high contrast, large text)
   - Progress tracking
   ```
4. Click "Submit for Review"

#### 7. Monitor Review Status

- **In Review:** 24-48 hours typically
- **Pending Developer Release:** Approved! You can release manually
- **Ready for Sale:** Live on App Store

**Common Rejection Reasons:**
- Missing privacy policy
- Medical claims (ensure disclaimer is prominent)
- Broken links
- Crashes on launch
- Missing features described in screenshots

---

## 🤖 Google Play Submission

### Prerequisites

1. **Google Play Developer Account** ($25 one-time fee)
   - Register at: https://play.google.com/console/signup

2. **Google Play Console Setup**
   - Create app listing
   - Complete store listing
   - Set up IAP products (if using RevenueCat)

### Step-by-Step Submission

#### 1. Create App

1. Go to [Google Play Console](https://play.google.com/console/)
2. Click "Create app"
3. Fill in:
   - App name: NeuroNexa
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
   - Declarations: Accept all

#### 2. Set Up Store Listing

**Main Store Listing:**

Copy content from `store/android-metadata.md`:

- **App name:** NeuroNexa
- **Short description:** (80 chars) Adaptive task coach for ADHD, autism, and cognitive support
- **Full description:** (4000 chars) Full app description
- **App icon:** 512 × 512 PNG
- **Feature graphic:** 1024 × 500 PNG
- **Phone screenshots:** 2-8 screenshots (1080 × 1920 or higher)
- **7-inch tablet screenshots:** Optional
- **10-inch tablet screenshots:** Optional

**Categorization:**
- App category: Health & Fitness
- Tags: Productivity, Accessibility, Mental Health

**Contact details:**
- Email: support@neuronexa.app
- Phone: (Optional)
- Website: https://neuronexa.app

**Privacy Policy:**
- URL: https://neuronexa.app/legal/privacy

#### 3. Complete Content Rating

Answer questionnaire:
- Violence: No
- Sexual content: No
- Language: No
- Controlled substances: No
- Gambling: No
- Result: Everyone

#### 4. Complete Data Safety

Declare data collection and usage:

**Data collected:**
- Device or other IDs (for analytics, if enabled)
- App interactions (for analytics, if enabled)

**Data sharing:**
- No data shared with third parties

**Data security:**
- Data encrypted in transit
- Users can request data deletion
- Committed to Google Play Families Policy

#### 5. Set Up App Access

- All features available without login: Yes
- Special access instructions: None

#### 6. Set Up Ads

- Contains ads: No

#### 7. Upload Build

```bash
# Build and submit
eas build --profile production --platform android
eas submit --platform android --latest

# Or manually upload .aab file in Play Console
```

#### 8. Create Release

1. Go to "Production" track
2. Click "Create new release"
3. Upload .aab file
4. Add release notes:
   ```
   Initial release of NeuroNexa!
   
   Features:
   • AI-powered task breakdown
   • Personalized coaching with Nexa
   • Breathing exercises for anxiety
   • Comprehensive accessibility features
   • Progress tracking and analytics
   • Caregiver support tools
   
   Designed for individuals with ADHD, autism, and cognitive disabilities.
   ```
5. Review and roll out to production

#### 9. Monitor Review Status

- **In Review:** 1-7 days typically
- **Published:** Live on Google Play Store

**Common Rejection Reasons:**
- Missing privacy policy
- Misleading medical claims
- Broken functionality
- Inappropriate content rating
- Data safety form incomplete

---

## 🔄 Post-Launch Checklist

### Week 1
- [ ] Monitor crash reports (if Sentry integrated)
- [ ] Respond to user reviews
- [ ] Track download numbers
- [ ] Monitor app performance
- [ ] Fix critical bugs

### Week 2-4
- [ ] Analyze user feedback
- [ ] Plan v1.1 features
- [ ] Optimize based on analytics (if PostHog integrated)
- [ ] Improve store listing based on conversion data

### Month 2+
- [ ] Release v1.1 with improvements
- [ ] Add deferred features (IAP, analytics, cloud sync)
- [ ] Expand marketing efforts
- [ ] Consider localization

---

## 📊 Version Management

### Versioning Strategy

**Format:** MAJOR.MINOR.PATCH (e.g., 1.0.0)

- **MAJOR:** Breaking changes, major new features
- **MINOR:** New features, non-breaking changes
- **PATCH:** Bug fixes, minor improvements

**Example Roadmap:**
- v1.0.0: Initial MVP launch
- v1.1.0: Add RevenueCat IAP, PostHog analytics
- v1.2.0: Add Supabase cloud sync
- v1.3.0: Add push notifications
- v2.0.0: Major redesign or feature overhaul

### Updating Version Numbers

**iOS (app.json):**
```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

**Android (app.json):**
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

**Auto-increment in EAS:**
- Production builds auto-increment build numbers
- Configured in `eas.json` with `"autoIncrement": true`

---

## 🐛 Troubleshooting

### Build Failures

**"No valid provisioning profile found"**
- Solution: Run `eas credentials` and configure iOS credentials

**"Gradle build failed"**
- Solution: Check Android build logs, often related to dependencies

**"Out of memory"**
- Solution: Use larger resource class in `eas.json`

### Submission Rejections

**"Missing privacy policy"**
- Solution: Ensure legal docs are hosted and URLs are correct

**"App crashes on launch"**
- Solution: Test on physical device, check error logs

**"Misleading medical claims"**
- Solution: Add prominent disclaimer, avoid diagnosis language

### Common Issues

**"Environment variables not working"**
- Solution: Use `eas secret:list` to verify secrets are set

**"Build takes too long"**
- Solution: Normal for first build, subsequent builds are faster

**"Can't install on device"**
- Solution: Check device is registered in Apple Developer portal

---

## 📞 Support Resources

### Expo & EAS
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo Forums](https://forums.expo.dev/)

### App Store
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

### Google Play
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [Android App Bundle Documentation](https://developer.android.com/guide/app-bundle)

---

## 🎉 Success Metrics

Track these KPIs after launch:

### Week 1
- Downloads: 100+
- Crash-free rate: >95%
- Rating: 4.0+
- Day 1 retention: >50%

### Month 1
- Downloads: 1,000+
- Crash-free rate: >99%
- Rating: 4.5+
- Day 7 retention: >40%
- Reviews: 10+ positive

### Quarter 1
- Downloads: 10,000+
- Crash-free rate: >99.5%
- Rating: 4.7+
- Day 30 retention: >30%
- Featured in App Store (goal)

---

## 🚀 You're Ready to Launch!

**Final Steps:**
1. ✅ Complete pre-deployment checklist
2. ✅ Build production versions
3. ✅ Submit to both stores
4. ✅ Monitor review status
5. ✅ Celebrate launch! 🎉

**Remember:**
- MVP first, iterate based on feedback
- User feedback is gold
- Don't be discouraged by rejections
- Keep improving based on data

---

*Simplify. Scaffold. Support independence.*

**Good luck with your launch! 🚀**
