# 🚀 Production Implementation Plan (Phases 2-7)

**MCP-Enhanced Production Readiness Guide**

**Last Updated**: 2025-11-12
**Current Status**: 90% Ready (Phase 1 Complete)
**Target**: 100% Ready for App Store Submission
**Timeline**: 2-3 weeks

---

## Progress Overview

| Phase | Status | Estimated Time | Actual Time | Completion Date |
|-------|--------|----------------|-------------|-----------------|
| **Phase 1**: Runtime Errors & Documentation | ✅ Complete | 4 hours | 4 hours | 2025-11-12 |
| **Phase 2**: Backend Services Configuration | ✅ Complete | 4-5 hours | 1 hour | 2025-11-12 |
| **Phase 3**: Legal Documents Hosting | ✅ Complete | 2-3 hours | 1 hour | 2025-11-12 |
| **Phase 4**: App Store Screenshots | ⏳ Not Started | 4-6 hours | - | - |
| **Phase 5**: Production Builds (EAS) | ⏳ Not Started | 1-2 days | - | - |
| **Phase 6**: TestFlight/Internal Testing | ⏳ Not Started | 3-5 days | - | - |
| **Phase 7**: Store Submission | ⏳ Not Started | 1-2 days | - | - |

**Overall Progress**: 90% → Target: 100%

---

## How to Use This Document

### Update Process
1. **Before Starting**: Read the phase completely
2. **During Execution**: Check off tasks as you complete them
3. **After Completion**: Update status, add completion date, document issues
4. **Commit to Git**:
   ```bash
   git add PRODUCTION_IMPLEMENTATION_PLAN.md
   git commit -m "docs: complete Phase X - [phase name]"
   git push origin main
   ```

### Status Indicators
- ✅ **Complete**: Task finished and validated
- ⏳ **In Progress**: Currently working on this
- ❌ **Blocked**: Waiting on external dependency
- 🔄 **Needs Revision**: Completed but requires changes

### MCP Server Integration
- **Context7 Queries**: For documentation lookup (marked with `📚 Context7`)
- **Sequential Analysis**: For systematic planning (marked with `🧠 Sequential`)

---

## Phase 2: Backend Services Configuration 📝

**Priority**: HIGH | **Estimated**: 4-5 hours | **Dependencies**: None

### 📚 Comprehensive Documentation Available

**Two detailed guides have been created to help you complete Phase 2**:

1. **PHASE_2_BACKEND_SETUP_GUIDE.md** - Complete step-by-step instructions
   - RevenueCat setup with pricing strategy
   - PostHog analytics configuration
   - Sentry crash reporting
   - Supabase database schema and RLS policies
   - Includes SQL scripts, example code, and MCP queries

2. **PHASE_2_VALIDATION_CHECKLIST.md** - Comprehensive validation guide
   - Service-by-service validation steps
   - Test procedures for each backend service
   - Security verification checklist
   - Troubleshooting common issues

**Quick Start**: See `PHASE_2_BACKEND_SETUP_GUIDE.md` for complete instructions.

### Overview
Configure all backend service credentials. All services already integrated in code - just need configuration!

**Files to Update**: `.env`

### Phase 2.1: RevenueCat Setup

**Status**: ⏳ Not Started | **Estimated**: 2 hours

#### Pre-Implementation Research

- [ ] **📚 Context7**: Query "RevenueCat Expo React Native setup guide"
- [ ] **📚 Context7**: Query "RevenueCat iOS app configuration"
- [ ] **📚 Context7**: Query "RevenueCat Android app configuration"

#### Account Setup (30 mins)

- [ ] Create account at https://app.revenuecat.com
- [ ] Create iOS app:
  - Bundle ID: `app.rork.nexa-cognitive-disorders-support-ykokwhv`
  - App Name: "Nexa"
- [ ] Create Android app:
  - Package Name: `app.rork.nexa-cognitive-disorders-support-ykokwhv`
  - App Name: "Nexa"

#### Pricing Strategy (30 mins)

- [ ] **🧠 Sequential**: Query "Analyze optimal freemium pricing for cognitive support app targeting ADHD/autism users"
- [ ] Review Sequential recommendations
- [ ] Create entitlement: `premium`

#### Product Configuration (30 mins)

- [ ] Create Monthly product:
  - ID: `nexa_premium_monthly`
  - Price: $9.99/month
  - Description: "Full access to AI coach, unlimited tasks, caregiver features"

- [ ] Create Annual product:
  - ID: `nexa_premium_annual`
  - Price: $59.99/year (save 50%)
  - Description: "Best value - All premium features for a year"

- [ ] Create Lifetime product:
  - ID: `nexa_premium_lifetime`
  - Price: $149.99 (one-time)
  - Description: "Lifetime access to all features"

- [ ] Create default offering with all 3 packages

#### Environment Configuration (30 mins)

- [ ] Copy iOS Public SDK Key from RevenueCat dashboard
- [ ] Copy Android Public SDK Key from RevenueCat dashboard
- [ ] Update `.env`:
  ```bash
  EXPO_PUBLIC_RC_IOS_API_KEY=appl_xxxxxxxxxxxxx
  EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_xxxxxxxxxxxxx
  ```

#### Validation

- [ ] **🧠 Sequential**: Query "Review RevenueCat configuration checklist - verify all steps complete"
- [ ] **📚 Context7**: Query "RevenueCat offering configuration validation"
- [ ] Test in Expo Go (mock mode expected)

**Completion Date**: ___________
**Issues Encountered**: ___________

---

### Phase 2.2: PostHog Analytics

**Status**: ⏳ Not Started | **Estimated**: 1 hour

#### Pre-Implementation Research

- [ ] **📚 Context7**: Query "PostHog React Native setup guide"
- [ ] **📚 Context7**: Query "PostHog event tracking best practices"

#### Account Setup (15 mins)

- [ ] Create account at https://app.posthog.com
- [ ] Create project: "Nexa"
- [ ] Copy API key from project settings

#### Event Planning (30 mins)

- [ ] **🧠 Sequential**: Query "Design analytics event taxonomy for cognitive support app with onboarding, feature usage, engagement, conversion, and error events"
- [ ] Review Sequential event naming conventions
- [ ] Document key events to track:
  - Onboarding: `user_onboarding_started`, `user_onboarding_completed`
  - Tasks: `task_created`, `task_completed`, `ai_breakdown_used`
  - Wellness: `breathing_exercise_completed`, `finger_trace_completed`
  - Conversion: `paywall_viewed`, `subscription_started`

#### Environment Configuration (5 mins)

- [ ] Update `.env`:
  ```bash
  EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
  EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
  ```

#### Verification (10 mins)

- [ ] **📚 Context7**: Query "PostHog React Native testing guide"
- [ ] Open app in simulator
- [ ] Check PostHog dashboard for `app_opened` event
- [ ] Trigger test events (create task, complete breathing)
- [ ] Verify events appear in real-time dashboard

**Note**: Your app already has PostHogService with 14 pre-built trackers!

**Completion Date**: ___________
**Issues Encountered**: ___________

---

### Phase 2.3: Sentry Crash Reporting

**Status**: ⏳ Not Started | **Estimated**: 1 hour

#### Pre-Implementation Research

- [ ] **📚 Context7**: Query "Sentry Expo React Native setup"
- [ ] **📚 Context7**: Query "Sentry source maps configuration EAS"

#### Account Setup (15 mins)

- [ ] Create account at https://sentry.io
- [ ] Create organization: [Your Name/Company]
- [ ] Create project: "Nexa" (React Native platform)
- [ ] Copy DSN from project settings
- [ ] Generate auth token (Settings > Auth Tokens)

#### Environment Configuration (10 mins)

- [ ] Update `.env`:
  ```bash
  EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
  SENTRY_ORG=your-org-name
  SENTRY_PROJECT=nexa
  SENTRY_AUTH_TOKEN=your-auth-token
  ```

#### Source Maps Setup (20 mins)

- [ ] **🧠 Sequential**: Query "Analyze EAS build configuration for Sentry source maps - provide eas.json configuration"
- [ ] Verify `eas.json` exists (created in Phase 5 if not)
- [ ] Add Sentry plugin to app.json:
  ```json
  {
    "expo": {
      "plugins": [
        "@sentry/react-native/expo"
      ]
    }
  }
  ```

#### Test Crash Reporting (15 mins)

- [ ] **📚 Context7**: Query "Sentry test crash reporting guide"
- [ ] Add temporary test error in app:
  ```typescript
  // In app/_layout.tsx (TEMPORARY)
  throw new Error('Test Sentry integration');
  ```
- [ ] Run app, trigger error
- [ ] Verify error appears in Sentry dashboard within 1 minute
- [ ] Check stack trace is readable
- [ ] Remove test error

**Completion Date**: ___________
**Issues Encountered**: ___________

---

### Phase 2.4: Supabase Backend

**Status**: ⏳ Not Started | **Estimated**: 30 minutes

#### Pre-Implementation Research

- [ ] **📚 Context7**: Query "Supabase React Native setup guide"
- [ ] **📚 Context7**: Query "Supabase Row Level Security best practices"

#### Account Setup (10 mins)

- [ ] Create account at https://app.supabase.com
- [ ] Create organization: [Your Name]
- [ ] Create project: "Nexa"
- [ ] Select region: [Closest to target users]
- [ ] Wait for provisioning (2 minutes)
- [ ] Copy URL and anon key from Settings > API

#### Environment Configuration (5 mins)

- [ ] Update `.env`:
  ```bash
  EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxx
  ```

#### Database Schema Design (Optional - Future)

- [ ] **🧠 Sequential**: Query "Design PostgreSQL schema for cognitive support app with users, tasks, caregiver relationships, memory journal, emergency contacts"
- [ ] Save Sequential schema for future implementation
- [ ] Note: Can defer schema creation to v1.1 if using local-first approach

#### Basic Testing (15 mins)

- [ ] Open app in simulator
- [ ] Verify Supabase client initializes without errors
- [ ] Check console for Supabase connection logs
- [ ] Test basic query (optional)

**Note**: Your app already has SupabaseService.ts configured!

**Completion Date**: ___________
**Issues Encountered**: ___________

---

### Phase 2 Completion Checklist

- [ ] All 4 services configured
- [ ] `.env` file updated with all credentials
- [ ] All services tested in Expo Go
- [ ] No console errors related to services
- [ ] **🧠 Sequential**: Final validation query "Review backend services configuration completeness - identify any gaps"

**Phase 2 Status**: ⏳ → ✅
**Total Time**: _______ hours
**Completion Date**: ___________

---

## Phase 3: Legal Documents Hosting 📝

**Priority**: CRITICAL | **Estimated**: 2-3 hours | **Dependencies**: None

**Status**: ✅ **COMPLETE** - Deployed to GitHub Pages with HTTPS

### 📚 Comprehensive Documentation Available

**Complete implementation guide created**:

**PHASE_3_LEGAL_HOSTING_GUIDE.md** - Full GitHub Pages deployment guide
- MCP-enhanced planning (Context7 + Sequential)
- Complete Jekyll site structure and templates
- Step-by-step GitHub Pages setup
- Legal document conversion instructions
- Custom domain setup (optional)
- Validation checklist and troubleshooting
- App Store compliance verification

**Quick Start**: See `PHASE_3_LEGAL_HOSTING_GUIDE.md` for complete instructions.

### Overview
Deploy legal documents to GitHub Pages for publicly accessible URLs required by App Store.

**Files to Create**: New repository: `nexa-legal-docs`

### Deployment Details

**Repository**: https://github.com/litmonbobby/nexa-legal-docs
**Live Site**: https://litmonbobby.github.io/nexa-legal-docs/
**HTTPS**: ✅ Enabled automatically by GitHub Pages

**Legal Documents Deployed**:
- ✅ Privacy Policy: `/privacy`
- ✅ Terms of Service: `/terms`
- ✅ Accessibility Statement: `/accessibility`
- ✅ Data Retention Policy: `/data-retention`
- ✅ Support Page: `/support`

**Environment Variables Updated**:
All legal document URLs in `.env` updated to point to GitHub Pages deployment.

### Phase 3.1: GitHub Pages Setup

**Status**: ✅ Complete | **Estimated**: 2 hours | **Actual**: 1 hour

#### Pre-Implementation Research

- [ ] **📚 Context7**: Query "GitHub Pages setup guide"
- [ ] **📚 Context7**: Query "Jekyll static site deployment"

#### Repository Creation (15 mins)

- [ ] **🧠 Sequential**: Query "Plan GitHub Pages deployment for legal documents - provide repository structure and deployment workflow"
- [ ] Create new repository on GitHub: `nexa-legal-docs`
- [ ] Set visibility: Public (required for GitHub Pages free tier)

#### Local Setup (15 mins)

```bash
# Clone or create locally
mkdir nexa-legal-docs
cd nexa-legal-docs
git init

# Create structure
mkdir -p _layouts
touch _config.yml
touch index.md
touch privacy.md
touch terms.md
touch accessibility.md
touch support.md
```

- [ ] Execute setup commands
- [ ] Verify directory structure created

#### Jekyll Configuration (30 mins)

- [ ] **📚 Context7**: Query "Jekyll configuration for GitHub Pages"
- [ ] Create `_config.yml`:
  ```yaml
  title: Nexa Legal Documents
  description: Privacy Policy, Terms of Service, and Support
  theme: minima
  ```

- [ ] Create `_layouts/legal.html`:
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ page.title }} - Nexa</title>
    <style>
      body {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
      }
      h1 { color: #333; }
      a { color: #007AFF; }
    </style>
  </head>
  <body>
    {{ content }}
  </body>
  </html>
  ```

#### Convert Legal Documents (45 mins)

- [ ] Copy content from `legal/PRIVACY_POLICY.md`
- [ ] Add frontmatter to `privacy.md`:
  ```markdown
  ---
  layout: legal
  title: Privacy Policy
  permalink: /privacy/
  ---

  [Paste privacy policy content here]
  ```

- [ ] Repeat for other documents:
  - [ ] `terms.md` → `/terms/`
  - [ ] `accessibility.md` → `/accessibility/`
  - [ ] `support.md` → `/support/`

- [ ] Create `index.md` landing page:
  ```markdown
  ---
  layout: legal
  title: Nexa Legal & Support
  permalink: /
  ---

  # Nexa Legal & Support

  - [Privacy Policy](/privacy/)
  - [Terms of Service](/terms/)
  - [Accessibility Statement](/accessibility/)
  - [Support](/support/)
  ```

#### Deploy to GitHub Pages (30 mins)

- [ ] **🧠 Sequential**: Query "GitHub Pages deployment validation checklist"

```bash
# Commit and push
git add .
git commit -m "Initial legal documents deployment"
git branch -M main
git remote add origin https://github.com/[username]/nexa-legal-docs.git
git push -u origin main
```

- [ ] Execute deployment commands
- [ ] Go to repository Settings > Pages
- [ ] Source: Deploy from main branch
- [ ] Wait 2-3 minutes for deployment
- [ ] Verify site is live at: `https://[username].github.io/nexa-legal-docs/`

#### Environment Configuration (15 mins)

- [ ] **📚 Context7**: Query "GitHub Pages URL format verification"
- [ ] Update `.env` in main Nexa app:
  ```bash
  EXPO_PUBLIC_PRIVACY_POLICY_URL=https://[username].github.io/nexa-legal-docs/privacy
  EXPO_PUBLIC_TERMS_URL=https://[username].github.io/nexa-legal-docs/terms
  EXPO_PUBLIC_ACCESSIBILITY_URL=https://[username].github.io/nexa-legal-docs/accessibility
  EXPO_PUBLIC_SUPPORT_URL=https://[username].github.io/nexa-legal-docs/support
  EXPO_PUBLIC_MARKETING_URL=https://[username].github.io/nexa-legal-docs
  ```

#### Validation

- [ ] **🧠 Sequential**: Query "Validate legal document deployment - provide curl test commands"
- [ ] Test each URL in browser
- [ ] Verify mobile responsiveness
- [ ] Check SSL certificate (should be automatic)
- [ ] Test links in app Settings screen

**Phase 3 Status**: ⏳ → ✅
**Total Time**: _______ hours
**Completion Date**: ___________
**GitHub Pages URL**: ___________

---

## Phase 4: App Store Screenshots ⏳

**Priority**: CRITICAL | **Estimated**: 4-6 hours | **Dependencies**: Phase 2 (for realistic data)

### Overview
Capture and frame 7 professional screenshots for App Store and Google Play.

**Required Output**: 14 total screenshots (7 screens × 2 iOS sizes)

### Phase 4.1: Screenshot Planning

**Status**: ⏳ Not Started | **Estimated**: 30 minutes

#### Strategic Planning

- [ ] **🧠 Sequential**: Query "Design App Store screenshot strategy for cognitive support app - provide 7-screen storyboard with captions and narrative"
- [ ] Review Sequential recommendations
- [ ] Create screenshot capture checklist

#### Device Requirements

- [ ] **📚 Context7**: Query "App Store screenshot size requirements 2025"
- [ ] **📚 Context7**: Query "iPhone 15 Pro Max screen resolution"
- [ ] Verify required sizes:
  - iPhone 6.7" (1290×2796) - iPhone 15 Pro Max ✓
  - iPhone 6.1" (1179×2556) - iPhone 15 Pro ✓
  - Android Phone (1080×1920 minimum) ✓

### Phase 4.2: Screenshot Capture

**Status**: ⏳ Not Started | **Estimated**: 2 hours

#### Setup Simulators

```bash
# List available simulators
xcrun simctl list devices | grep "iPhone 15"

# Boot iPhone 15 Pro Max
xcrun simctl boot [DEVICE_ID_6.7]
```

- [ ] Boot iPhone 15 Pro Max simulator
- [ ] Boot iPhone 15 Pro simulator
- [ ] Launch app: `npx expo start`, press `i`

#### Capture 7 Screens

**Screen 1: Home / Today View** (15 mins)
- [ ] Populate with 3-4 realistic tasks
- [ ] Show Nexa AI greeting
- [ ] Ensure clean UI, today's date visible
- [ ] Capture on 6.7": `Cmd+S` → Save to `store/screenshots/ios-6_7/01-home.png`
- [ ] Switch to 6.1" simulator, repeat capture

**Screen 2: AI Task Breakdown** (15 mins)
- [ ] Create complex task: "Organize apartment for guests"
- [ ] Tap "Break Down Task" button
- [ ] Wait for AI response
- [ ] Capture breakdown screen
- [ ] Save to `02-ai-breakdown.png` (both sizes)

**Screen 3: Breathing Exercise** (15 mins)
- [ ] Navigate to Wellness tab
- [ ] Select breathing pattern
- [ ] Start exercise
- [ ] Capture during active animation (timer at ~00:45)
- [ ] Save to `03-breathing.png` (both sizes)

**Screen 4: Finger Tracing Exercise** (15 mins)
- [ ] Navigate to Wellness tab → Finger Trace
- [ ] Select "Circle" exercise
- [ ] Start tracing, capture at ~80% accuracy
- [ ] Save to `04-finger-trace.png` (both sizes)

**Screen 5: Accessibility Settings** (15 mins)
- [ ] Navigate to Settings tab → Accessibility
- [ ] Enable High Contrast
- [ ] Adjust Large Text slider
- [ ] Enable Reduced Motion
- [ ] Capture settings screen
- [ ] Save to `05-accessibility.png` (both sizes)

**Screen 6: Progress Analytics** (20 mins)
- [ ] Navigate to Progress tab
- [ ] Ensure some data populated (create tasks, complete some)
- [ ] Show completion chart, streak counter
- [ ] Capture analytics dashboard
- [ ] Save to `06-progress.png` (both sizes)

**Screen 7: Caregiver Management** (15 mins)
- [ ] Navigate to Settings → Caregiver Management
- [ ] Generate invite code or show caregiver list
- [ ] Capture management screen
- [ ] Save to `07-caregiver.png` (both sizes)

### Phase 4.3: Screenshot Framing

**Status**: ⏳ Not Started | **Estimated**: 1 hour

#### Mockup Tool Selection

- [ ] **📚 Context7**: Query "App Store screenshot mockup tools comparison"
- [ ] Choose tool (recommended: Mockuphone.com - free, web-based)

#### Frame Screenshots

For each screenshot:
- [ ] Upload to Mockuphone.com
- [ ] Select iPhone 15 Pro Max device frame
- [ ] Export at 1290×2796 (6.7" size)
- [ ] Repeat for iPhone 15 Pro at 1179×2556 (6.1" size)
- [ ] Save framed versions

**Batch Process**:
- [ ] Frame all 7 screenshots for 6.7"
- [ ] Frame all 7 screenshots for 6.1"
- [ ] Total: 14 framed screenshots

### Phase 4.4: Add Captions

**Status**: ⏳ Not Started | **Estimated**: 30 minutes

#### Caption Generation

- [ ] **🧠 Sequential**: Query "Generate ASO-optimized captions for cognitive support app screenshots - max 40 characters, include keywords ADHD/autism, emotional connection"

#### Apply Captions (Optional - can also add in App Store Connect)

Sequential will provide captions like:
1. "Nexa adapts to you with personalized support"
2. "Break down overwhelming tasks into steps"
3. "Calm anxiety with guided breathing"
4. "Mindfulness through interactive tracing"
5. "Built for neurodiversity & accessibility"
6. "Track progress and build momentum"
7. "Connect caregivers for support"

- [ ] Note captions for use in App Store Connect

### Phase 4.5: Organization

**Status**: ⏳ Not Started | **Estimated**: 15 minutes

#### Create Directory Structure

```bash
mkdir -p store/screenshots/ios-6_7
mkdir -p store/screenshots/ios-6_1
mkdir -p store/screenshots/android

# Move files to proper locations
```

- [ ] Execute directory creation
- [ ] Move all screenshots to organized folders
- [ ] Verify file naming consistency:
  - `01-home.png`
  - `02-ai-breakdown.png`
  - `03-breathing.png`
  - `04-finger-trace.png`
  - `05-accessibility.png`
  - `06-progress.png`
  - `07-caregiver.png`

### Phase 4 Completion Checklist

- [ ] 7 screenshots captured
- [ ] All screenshots framed with device mockups
- [ ] 6.7" size: 7 screenshots (1290×2796)
- [ ] 6.1" size: 7 screenshots (1179×2556)
- [ ] Files organized in directories
- [ ] Captions documented
- [ ] **🧠 Sequential**: Final review "Validate screenshot quality and ASO effectiveness"

**Phase 4 Status**: ⏳ → ✅
**Total Time**: _______ hours
**Completion Date**: ___________

---

## Phase 5: Production Builds (EAS) ⏳

**Priority**: CRITICAL | **Estimated**: 1-2 days | **Dependencies**: Phase 2 (credentials)

### Overview
Create development and production builds using Expo Application Services (EAS).

**Prerequisites**:
- Apple Developer Program ($99/year)
- Google Play Developer account ($25 one-time)

### Phase 5.1: Prerequisites & Account Setup

**Status**: ⏳ Not Started | **Estimated**: 1-2 hours

#### Apple Developer Program

- [ ] Enroll at https://developer.apple.com/programs/enroll/
- [ ] Complete payment ($99/year)
- [ ] Wait for approval (usually same day)
- [ ] Note Apple ID email: ___________
- [ ] Note Team ID: ___________

#### Google Play Developer

- [ ] Sign up at https://play.google.com/console/signup
- [ ] Complete payment ($25 one-time)
- [ ] Create developer account
- [ ] Note Developer Account Email: ___________

### Phase 5.2: EAS CLI Setup

**Status**: ⏳ Not Started | **Estimated**: 30 minutes

#### Install EAS CLI

- [ ] **📚 Context7**: Query "EAS CLI installation guide"

```bash
# Install globally
npm install -g eas-cli

# Verify installation
eas --version
```

- [ ] Execute installation
- [ ] Verify version: eas-cli/______

#### Login and Initialize

```bash
# Login to Expo account
eas login

# Verify login
eas whoami

# Initialize EAS in project
cd /path/to/nexa-app
eas build:configure
```

- [ ] Login with Expo account
- [ ] Run `eas build:configure`
- [ ] **📚 Context7**: Query "EAS build:configure output validation"

### Phase 5.3: Configure eas.json

**Status**: ⏳ Not Started | **Estimated**: 30 minutes

#### EAS Configuration

- [ ] **📚 Context7**: Query "EAS build profiles configuration examples"
- [ ] **🧠 Sequential**: Query "Design EAS build configuration for development and production profiles - include iOS simulator support"

- [ ] Create or update `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      },
      "env": {
        "EXPO_PUBLIC_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_ENV": "preview"
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_ENV": "production",
        "EXPO_PUBLIC_DEBUG_MODE": "false"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

- [ ] Commit eas.json to git

### Phase 5.4: Configure EAS Secrets

**Status**: ⏳ Not Started | **Estimated**: 30 minutes

#### Secrets Strategy

- [ ] **🧠 Sequential**: Query "Design EAS secrets strategy - which variables need secrets vs public, naming conventions, validation commands"

#### Set All Secrets

```bash
# Backend Services
eas secret:create --scope project --name EXPO_PUBLIC_RC_IOS_API_KEY --value "appl_xxxxx" --force
eas secret:create --scope project --name EXPO_PUBLIC_RC_ANDROID_API_KEY --value "goog_xxxxx" --force
eas secret:create --scope project --name EXPO_PUBLIC_POSTHOG_KEY --value "phc_xxxxx" --force
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://xxxxx@sentry.io/xxxxx" --force
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxxxx.supabase.co" --force
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "xxxxx" --force

# Legal URLs
eas secret:create --scope project --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value "https://[username].github.io/nexa-legal-docs/privacy" --force
eas secret:create --scope project --name EXPO_PUBLIC_TERMS_URL --value "https://[username].github.io/nexa-legal-docs/terms" --force
eas secret:create --scope project --name EXPO_PUBLIC_SUPPORT_URL --value "https://[username].github.io/nexa-legal-docs/support" --force
eas secret:create --scope project --name EXPO_PUBLIC_ACCESSIBILITY_URL --value "https://[username].github.io/nexa-legal-docs/accessibility" --force
eas secret:create --scope project --name EXPO_PUBLIC_MARKETING_URL --value "https://[username].github.io/nexa-legal-docs" --force
```

- [ ] Execute all secret creation commands
- [ ] Verify secrets: `eas secret:list`
- [ ] Confirm all 11 secrets are set

### Phase 5.5: Development Builds

**Status**: ⏳ Not Started | **Estimated**: 4-6 hours (build time)

#### Pre-Build Validation

- [ ] **🧠 Sequential**: Query "Create EAS development build workflow - provide pre-build validation checklist"
- [ ] Run tests: `npm test` (if any)
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Verify all secrets are set: `eas secret:list`

#### iOS Development Build

```bash
# Start iOS development build
eas build --profile development --platform ios
```

- [ ] Execute iOS build command
- [ ] Monitor build progress on https://expo.dev
- [ ] Build time: _______ minutes
- [ ] Download .tar.gz when complete
- [ ] Extract and install on simulator:
  ```bash
  tar -xvzf [downloaded-file].tar.gz
  xcrun simctl install booted Nexa.app
  ```

#### Android Development Build

```bash
# Start Android development build
eas build --profile development --platform android
```

- [ ] Execute Android build command
- [ ] Monitor build progress
- [ ] Build time: _______ minutes
- [ ] Download .apk when complete
- [ ] Install on emulator:
  ```bash
  adb install [downloaded-file].apk
  ```

#### Test Development Builds

- [ ] **📚 Context7**: Query "EAS development build testing checklist"

**iOS Testing**:
- [ ] Launch app on iOS simulator
- [ ] Start Metro bundler: `npx expo start --dev-client`
- [ ] Connect app to bundler (scan QR or enter URL)
- [ ] Test hot reload works
- [ ] Test all core features:
  - [ ] Task creation with AI breakdown
  - [ ] Breathing exercises
  - [ ] Finger tracing
  - [ ] RevenueCat purchases (sandbox)
  - [ ] PostHog events (check dashboard)
  - [ ] Sentry error tracking (trigger test error)

**Android Testing**:
- [ ] Repeat all iOS tests on Android emulator
- [ ] Verify feature parity

### Phase 5.6: Production Builds

**Status**: ⏳ Not Started | **Estimated**: 4-6 hours (build time)

#### Pre-Production Validation

- [ ] **🧠 Sequential**: Query "Production build quality gates - provide automated validation script"
- [ ] All development build tests passed
- [ ] All backend services working
- [ ] All legal URLs accessible
- [ ] Screenshots ready
- [ ] No console errors or warnings

#### iOS Production Build

```bash
# Start iOS production build
eas build --profile production --platform ios --non-interactive
```

- [ ] Execute iOS production build
- [ ] Monitor on https://expo.dev
- [ ] Build time: _______ minutes
- [ ] Download .ipa when complete
- [ ] Verify build:
  - [ ] File size < 100MB
  - [ ] Version: 1.0.0
  - [ ] Build number auto-incremented

#### Android Production Build

```bash
# Start Android production build
eas build --profile production --platform android --non-interactive
```

- [ ] Execute Android production build
- [ ] Monitor build progress
- [ ] Build time: _______ minutes
- [ ] Download .aab when complete
- [ ] Verify build:
  - [ ] File size < 50MB
  - [ ] Version: 1.0.0
  - [ ] Build number auto-incremented

#### Final Build Validation

- [ ] **📚 Context7**: Query "EAS production build success indicators"
- [ ] No build errors in logs
- [ ] Both platforms built successfully
- [ ] Builds downloaded locally
- [ ] **🧠 Sequential**: Final validation "Review production build quality - identify any issues"

### Phase 5 Completion Checklist

- [ ] EAS CLI installed and configured
- [ ] eas.json created with dev and production profiles
- [ ] All 11 secrets set in EAS
- [ ] Development builds created and tested
- [ ] Production builds created
- [ ] All builds downloaded
- [ ] No critical issues found

**Phase 5 Status**: ⏳ → ✅
**Total Time**: _______ hours (calendar time)
**Completion Date**: ___________
**iOS Build ID**: ___________
**Android Build ID**: ___________

---

## Phase 6: TestFlight/Internal Testing ⏳ (OPTIONAL)

**Priority**: MEDIUM | **Estimated**: 3-5 days | **Dependencies**: Phase 5 (builds)

### Overview
Optional beta testing phase before public release. Recommended but can be skipped for faster launch.

**Decision Point**: Skip testing and go straight to production? ☐ Yes ☐ No

If skipping, mark phase as ✅ Skipped and proceed to Phase 7.

### Phase 6.1: iOS TestFlight

**Status**: ⏳ Not Started | **Estimated**: 1 hour setup + 3 days testing

#### Submit to TestFlight

- [ ] **📚 Context7**: Query "TestFlight submission guide"

```bash
# Submit latest production build
eas submit --platform ios --latest
```

- [ ] Execute submission command
- [ ] Wait for App Store Connect processing (15-30 mins)

#### Configure TestFlight

- [ ] Go to https://appstoreconnect.apple.com
- [ ] Navigate to "TestFlight" tab
- [ ] Wait for build to process
- [ ] Add test information:
  - What to test: "All core features - task creation, AI coach, breathing, accessibility"
  - Feedback email: ___________
- [ ] Add internal testers (up to 100):
  - [ ] Tester 1: ___________
  - [ ] Tester 2: ___________
  - [ ] Tester 3: ___________
- [ ] Click "Start Testing"

#### Distribute to Testers

- [ ] Send TestFlight invitation link
- [ ] Share testing instructions:
  ```
  Focus areas:
  1. Create complex tasks, use AI breakdown
  2. Try all breathing patterns
  3. Complete finger tracing exercises
  4. Test with accessibility features enabled
  5. Attempt subscription purchase (sandbox)
  6. Report any crashes or confusing UI
  ```

### Phase 6.2: Android Internal Testing

**Status**: ⏳ Not Started | **Estimated**: 1 hour setup + 3 days testing

#### Submit to Google Play

- [ ] **📚 Context7**: Query "Google Play Console internal testing setup"

```bash
# Submit to Google Play
eas submit --platform android --latest
```

- [ ] Execute submission
- [ ] Or manually upload .aab to Play Console

#### Configure Internal Testing

- [ ] Go to https://play.google.com/console
- [ ] Select app
- [ ] Navigate to Testing > Internal testing
- [ ] Create new release
- [ ] Upload .aab (if not using eas submit)
- [ ] Add release notes:
  ```
  Beta Release - Internal Testing

  - AI-powered task breakdown
  - 7 breathing exercises
  - 9 finger tracing exercises
  - Comprehensive accessibility features
  - Progress tracking
  - Caregiver support

  Please test all features and report bugs.
  ```
- [ ] Add testers (email addresses):
  - [ ] Tester 1: ___________
  - [ ] Tester 2: ___________
  - [ ] Tester 3: ___________
- [ ] Review and rollout

### Phase 6.3: Testing & Feedback Collection

**Status**: ⏳ Not Started | **Estimated**: 3-5 days

#### Test Plan

- [ ] **🧠 Sequential**: Query "Generate comprehensive test plan for cognitive support app - include critical user journeys, edge cases, accessibility testing"

#### Distribute Feedback Form

- [ ] Create Google Form or Typeform with questions:
  - Did the app crash? Where?
  - Which features did you test?
  - Any confusing UI/UX?
  - Performance issues?
  - Feature requests?
  - Overall rating (1-5 stars)
- [ ] Share feedback form link with testers

#### Monitor Testing (3-5 days)

- [ ] Day 1: Check for immediate crashes
- [ ] Day 2: Review initial feedback
- [ ] Day 3: Address critical bugs
- [ ] Day 4: Collect final feedback
- [ ] Day 5: Analyze results

#### Feedback Analysis

- [ ] **🧠 Sequential**: Query "Analyze bug reports and create fix priority matrix - categorize as critical/high/medium/low"
- [ ] Compile all feedback
- [ ] Categorize issues:
  - **Critical** (blocks launch): ___________
  - **High** (user-facing): ___________
  - **Medium** (minor): ___________
  - **Low** (cosmetic): ___________

### Phase 6.4: Bug Fixes

**Status**: ⏳ Not Started | **Estimated**: Variable (0-8 hours)

#### Fix Critical Bugs

For each critical bug:
- [ ] Reproduce issue locally
- [ ] Fix code
- [ ] Test fix
- [ ] Create new development build
- [ ] Redistribute to testers
- [ ] Verify fix confirmed

#### Rebuild if Needed

If bugs fixed:
```bash
# Rebuild production builds
eas build --profile production --platform ios
eas build --profile production --platform android
```

- [ ] Rebuild with fixes (if needed)
- [ ] Resubmit to TestFlight/Play Console
- [ ] Final validation round

### Phase 6 Completion Checklist

- [ ] Beta testing completed (or phase skipped)
- [ ] All critical bugs fixed
- [ ] Final builds created with fixes
- [ ] Tester feedback positive (>4.0 average rating)
- [ ] Ready for public release

**Phase 6 Status**: ⏳ → ✅ (or ⏸️ Skipped)
**Total Time**: _______ days
**Completion Date**: ___________
**Tester Feedback Summary**: ___________

---

## Phase 7: Store Submission ⏳

**Priority**: CRITICAL | **Estimated**: 1-2 days | **Dependencies**: Phases 3, 4, 5

### Overview
Final step: Submit to App Store and Google Play for public release.

### Phase 7.1: Pre-Submission Validation

**Status**: ⏳ Not Started | **Estimated**: 1 hour

#### Final Checklist

- [ ] **🧠 Sequential**: Query "Generate App Store submission checklist - technical, content, legal, metadata, asset requirements"

**Validation Items**:
- [ ] Legal docs hosted and accessible (Phase 3)
- [ ] Screenshots ready (Phase 4)
- [ ] Production builds created (Phase 5)
- [ ] App icon 1024×1024 (no alpha channel)
- [ ] Privacy policy link works
- [ ] Terms of service link works
- [ ] No placeholder text in app
- [ ] Medical disclaimer visible
- [ ] No crashes in testing
- [ ] All backend services configured

### Phase 7.2: App Store Connect Submission

**Status**: ⏳ Not Started | **Estimated**: 3-4 hours

#### Fill App Information

- [ ] **📚 Context7**: Query "App Store Connect metadata requirements"
- [ ] **📚 Context7**: Query "App Store Review Guidelines healthcare apps"

- [ ] Go to https://appstoreconnect.apple.com
- [ ] Create new app
- [ ] Fill basic information:
  - **Name**: Nexa: Cognitive Support Coach
  - **Subtitle**: ADHD, autism, and cognitive support
  - **Primary Language**: English (U.S.)
  - **Bundle ID**: app.rork.nexa-cognitive-disorders-support-ykokwhv
  - **SKU**: nexa-cognitive-support-2025

#### Description & Metadata

- [ ] Copy description from `store/ios-metadata.md`:
  ```
  Nexa is your personal cognitive support coach, designed specifically for individuals with ADHD, autism, and other cognitive disabilities.

  🧠 AI-POWERED TASK BREAKDOWN
  Transform overwhelming tasks into manageable steps with AI assistance.

  🫁 CALMING BREATHING EXERCISES
  Reduce anxiety with 7 guided breathing patterns.

  ✋ MINDFUL FINGER TRACING
  Interactive exercises for focus and relaxation.

  ♿️ ACCESSIBILITY FIRST
  High contrast, large text, reduced motion, screen reader support.

  📊 PROGRESS TRACKING
  Visualize your achievements and build momentum.

  👨‍👩‍👧 CAREGIVER SUPPORT
  Connect with caregivers for accountability and assistance.

  MEDICAL DISCLAIMER:
  Nexa is a support tool, not a medical device. It does not diagnose, treat, or prevent any medical condition. Always consult a healthcare professional.

  Privacy-focused. No data sale. You're in control.
  ```

- [ ] Keywords (max 100 chars):
  ```
  ADHD,autism,neurodiversity,cognitive support,task coach,breathing,focus,executive function,reminders,routines,anxiety,accessibility
  ```

- [ ] Support URL: [GitHub Pages URL]/support
- [ ] Marketing URL: [GitHub Pages URL]
- [ ] Privacy Policy URL: [GitHub Pages URL]/privacy

#### Upload Screenshots

- [ ] iPhone 6.7" Display:
  - [ ] 01-home.png
  - [ ] 02-ai-breakdown.png
  - [ ] 03-breathing.png
  - [ ] 04-finger-trace.png
  - [ ] 05-accessibility.png
  - [ ] 06-progress.png
  - [ ] 07-caregiver.png

- [ ] iPhone 6.1" Display:
  - [ ] Same 7 screenshots

- [ ] Optional: iPad 12.9" Display (can add later)

#### App Review Information

- [ ] **📚 Context7**: Query "App Store app review information requirements"

- [ ] First Name: ___________
- [ ] Last Name: ___________
- [ ] Phone: ___________
- [ ] Email: ___________
- [ ] Demo Account (optional):
  - Username: demo@nexa.app
  - Password: DemoPass123!
- [ ] Review Notes:
  ```
  Nexa is a cognitive support app for individuals with ADHD, autism, and other cognitive disabilities.

  IMPORTANT: This is NOT a medical device. We do not diagnose or treat medical conditions. Medical disclaimer is prominent in app and store description.

  KEY FEATURES TO TEST:
  1. Task creation and AI breakdown (tap "+" → enter task → "Break Down Task")
  2. Breathing exercises (Wellness tab → Select pattern)
  3. Finger tracing (Wellness tab → Finger Trace → Select exercise)
  4. Accessibility settings (Settings tab → Accessibility)
  5. Caregiver features (Settings → Caregiver Management)

  All features work without account creation.

  Thank you for your review!
  ```

#### Age Rating

- [ ] **📚 Context7**: Query "App Store age rating medical content"
- [ ] Complete age rating questionnaire:
  - Medical/Treatment Information: Yes (Informational only)
  - Unrestricted Web Access: No
  - Gambling: No
  - Result: 4+ or 12+

#### Pricing & Availability

- [ ] Price: Free
- [ ] Availability: All territories
- [ ] In-App Purchases:
  - [ ] Nexa Premium Monthly ($9.99/month)
  - [ ] Nexa Premium Annual ($59.99/year)
  - [ ] Nexa Premium Lifetime ($149.99)

#### Select Build & Submit

- [ ] Select production build from Phase 5
- [ ] Review all information
- [ ] **🧠 Sequential**: Final review "Pre-submission review - confirm all metadata correct"
- [ ] Click "Submit for Review"
- [ ] Submission date: ___________

#### Monitor Review Status

- [ ] Check daily for status updates
- [ ] **📚 Context7**: Query "App Store review timeline expectations"
- [ ] Expected review time: 24-48 hours
- [ ] If rejected, respond within 24 hours

### Phase 7.3: Google Play Console Submission

**Status**: ⏳ Not Started | **Estimated**: 3-4 hours

#### Create App Listing

- [ ] **📚 Context7**: Query "Google Play Console submission checklist"
- [ ] **📚 Context7**: Query "Google Play Store listing requirements"

- [ ] Go to https://play.google.com/console
- [ ] Create app
- [ ] Fill app details:
  - **App name**: Nexa: Cognitive Support Coach
  - **Default language**: English (United States)
  - **App or game**: App
  - **Free or paid**: Free

#### Store Listing

- [ ] Copy from `store/android-metadata.md`:

**Short description** (80 chars):
```
AI-powered support for ADHD, autism, and cognitive disabilities
```

**Full description** (4000 chars):
```
Nexa is your personal cognitive support coach, designed specifically for individuals with ADHD, autism, and other cognitive disabilities.

🧠 AI-POWERED TASK BREAKDOWN
Transform overwhelming tasks into manageable steps with AI assistance.

🫁 CALMING BREATHING EXERCISES
Reduce anxiety with 7 guided breathing patterns.

✋ MINDFUL FINGER TRACING
Interactive exercises for focus and relaxation.

♿️ ACCESSIBILITY FIRST
High contrast, large text, reduced motion, screen reader support.

📊 PROGRESS TRACKING
Visualize your achievements and build momentum.

👨‍👩‍👧 CAREGIVER SUPPORT
Connect with caregivers for accountability and assistance.

MEDICAL DISCLAIMER:
Nexa is a support tool, not a medical device. It does not diagnose, treat, or prevent any medical condition. Always consult a healthcare professional.

Privacy-focused. No data sale. You're in control.

FEATURES:
• AI task breakdown
• 7 breathing patterns
• 9 finger tracing exercises
• High contrast mode
• Large text support
• Reduced motion option
• Screen reader compatible
• Progress charts
• Streak tracking
• Caregiver pairing

ACCESSIBILITY:
• WCAG 2.1 AA compliant
• Screen reader optimized
• Keyboard navigation
• Color blind friendly
• Motion controls optional

No ads. No data sale. Your privacy matters.
```

#### Upload Graphics

- [ ] **📚 Context7**: Query "Google Play feature graphic design guidelines"

- [ ] App icon: 512×512 PNG (high-res icon)
- [ ] Feature graphic: 1024×500 JPG/PNG (create in Canva/Figma)
- [ ] Phone screenshots: 7 screenshots from `store/screenshots/android/`
  - [ ] 01-home.png
  - [ ] 02-ai-breakdown.png
  - [ ] 03-breathing.png
  - [ ] 04-finger-trace.png
  - [ ] 05-accessibility.png
  - [ ] 06-progress.png
  - [ ] 07-caregiver.png

#### Categorization

- [ ] App category: Health & Fitness
- [ ] Tags: Medical, Productivity, Accessibility
- [ ] Content rating: Complete questionnaire
  - Medical content: Informational only
  - Result: Everyone or PEGI 3

#### Data Safety Form

- [ ] **🧠 Sequential**: Query "Analyze app data collection for Google Play data safety form"

- [ ] Data collected:
  - [ ] Device ID (for analytics, if PostHog enabled)
  - [ ] App interactions (for analytics)
  - [ ] Location (optional, only if user enables)
  - [ ] Photos (optional, only for memory journal)

- [ ] Data sharing:
  - [ ] No data shared for advertising
  - [ ] Analytics: PostHog (if enabled)
  - [ ] Crash reports: Sentry (if enabled)

- [ ] Data security:
  - [ ] Data encrypted in transit (HTTPS)
  - [ ] Data encrypted at rest
  - [ ] Users can request deletion
  - [ ] Committed to Google Play Families Policy

#### Create Production Release

- [ ] Navigate to Production track
- [ ] Create new release
- [ ] Upload .aab from Phase 5
- [ ] Add release notes:
  ```
  Initial release of Nexa! 🎉

  Nexa is a cognitive support app designed for individuals with ADHD, autism, and other cognitive disabilities.

  FEATURES:
  ✓ AI-powered task breakdown
  ✓ Breathing exercises for anxiety
  ✓ Interactive finger tracing
  ✓ Comprehensive accessibility features
  ✓ Progress tracking and analytics
  ✓ Caregiver support tools

  Built with accessibility first. No ads, no data sale.

  MEDICAL DISCLAIMER:
  Nexa is a support tool, not a medical device. Always consult a healthcare professional.
  ```

- [ ] Set countries/regions: All
- [ ] Review release

#### Submit for Review

- [ ] **🧠 Sequential**: Final validation "Review Google Play submission completeness"
- [ ] Click "Review release"
- [ ] Click "Start rollout to Production"
- [ ] Submission date: ___________

#### Monitor Review Status

- [ ] **📚 Context7**: Query "Google Play review timeline"
- [ ] Expected review time: 1-7 days
- [ ] Check daily for status updates

### Phase 7 Completion Checklist

- [ ] App Store submission complete
- [ ] Google Play submission complete
- [ ] Both apps "Waiting for Review" or "In Review"
- [ ] No immediate rejections
- [ ] Review notes clear and helpful

**Phase 7 Status**: ⏳ → ✅
**Total Time**: _______ hours
**iOS Submission Date**: ___________
**Android Submission Date**: ___________

---

## Phase 8: Launch & Post-Submission 🚀

**Status**: ⏳ Pending | **Dependencies**: Phase 7 approval

### App Store Approval

- [ ] iOS Review Status: ___________
  - ☐ Waiting for Review
  - ☐ In Review
  - ☐ Pending Developer Release
  - ☐ Ready for Sale
  - ☐ Rejected (see notes)

- [ ] If Rejected:
  - [ ] **📚 Context7**: Query "App Store rejection reason [specific reason]"
  - [ ] **🧠 Sequential**: "Create rejection response plan for [reason]"
  - [ ] Fix issue
  - [ ] Resubmit

### Google Play Approval

- [ ] Android Review Status: ___________
  - ☐ Under Review
  - ☐ Approved
  - ☐ Published
  - ☐ Rejected (see notes)

- [ ] If Rejected:
  - [ ] Review rejection reason
  - [ ] Fix issue
  - [ ] Resubmit

### Launch Day 🎉

- [ ] iOS App Live: ___________
- [ ] Android App Live: ___________
- [ ] App Store URL: ___________
- [ ] Google Play URL: ___________

### Post-Launch Monitoring (Week 1)

- [ ] Monitor Sentry for crashes (target: <1% crash rate)
- [ ] Monitor PostHog for user behavior
- [ ] Check app store reviews daily
- [ ] Respond to user feedback within 24 hours
- [ ] Track downloads: Day 1 ______ Day 7 ______

### Success Metrics (Week 1)

- [ ] 100+ downloads combined
- [ ] 4.0+ star rating
- [ ] <1% crash rate
- [ ] 50%+ Day 1 retention

---

## Timeline Summary

| Phase | Start Date | End Date | Status | Notes |
|-------|-----------|----------|--------|-------|
| Phase 1 | 2025-11-12 | 2025-11-12 | ✅ Complete | Runtime errors fixed |
| Phase 2 | ___________ | ___________ | ⏳ | Backend services |
| Phase 3 | ___________ | ___________ | ⏳ | Legal hosting |
| Phase 4 | ___________ | ___________ | ⏳ | Screenshots |
| Phase 5 | ___________ | ___________ | ⏳ | EAS builds |
| Phase 6 | ___________ | ___________ | ⏳ | Testing (optional) |
| Phase 7 | ___________ | ___________ | ⏳ | Store submission |
| Phase 8 | ___________ | ___________ | ⏳ | Launch! |

**Target Launch Date**: ___________

---

## Costs Tracker

### One-Time Costs
- [ ] Apple Developer Program: $99/year (paid: Y/N)
- [ ] Google Play Developer: $25 one-time (paid: Y/N)
- [ ] Domain (optional): $12/year or GitHub Pages FREE (choice: _______)

**Total Upfront**: $_______

### Monthly Costs (Current)
- RevenueCat: $0 (free tier)
- PostHog: $0 (free tier)
- Sentry: $0 (free tier)
- Supabase: $0 (free tier)

**Total Monthly**: $0

---

## Notes & Issues

### Phase 2 Notes:
___________

### Phase 3 Notes:
___________

### Phase 4 Notes:
___________

### Phase 5 Notes:
___________

### Phase 6 Notes:
___________

### Phase 7 Notes:
___________

### Lessons Learned:
___________

---

## Quick Reference Commands

### Git Workflow
```bash
# Update this file after each phase
git add PRODUCTION_IMPLEMENTATION_PLAN.md
git commit -m "docs: complete Phase X - [description]"
git push origin main
```

### EAS Commands
```bash
# Check secrets
eas secret:list

# Development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Production build
eas build --profile production --platform ios
eas build --profile production --platform android

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest
```

### Testing Commands
```bash
# Start dev client
npx expo start --dev-client

# Install on simulator
xcrun simctl install booted Nexa.app

# Install on Android
adb install app.apk
```

---

**Last Updated**: 2025-11-12
**Next Update**: After completing Phase ___

**Document Status**: Living document - update as you complete each phase!

🚀 **You're 90% there! Let's get to 100% and launch!**
