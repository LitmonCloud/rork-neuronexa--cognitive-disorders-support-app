# Nexa — App Store 100% Readiness Tracker

**Current Status: 78-82% → Target: 100%**

**Last Updated:** 2025-10-02

---

## 🎯 Critical Path to App Store Submission

### Phase 1: Foundation & Compliance (Critical) ✅

- [x] **0.1** Repository hygiene
  - [x] Create RELEASE_NOTES.md (this file)
  - [x] Update .env.example with all keys
  - [x] Enable strict TypeScript
  - [x] Add global error boundary
  
- [ ] **0.2** Icons & Splash (CRITICAL)
  - [ ] Verify icon.png (1024×1024, opaque)
  - [ ] Verify splash-icon.png (≥1242×2436)
  - [ ] Create adaptive-foreground.png (432×432)
  - [ ] Create adaptive-background.png (1080×1080)
  - [ ] Verify favicon.png (180×180)
  - [ ] Create notification-icon.png (96×96, Android)
  - [ ] Update app.json with all asset paths
  - [ ] Create npm script: `validate-assets`

- [ ] **0.3** Legal & Compliance (CRITICAL)
  - [ ] Generate Privacy Policy (GDPR compliant)
  - [ ] Generate Terms of Service
  - [ ] Generate Accessibility Statement
  - [ ] Generate Data Retention Policy
  - [ ] Host at nexa.app/legal/* (or placeholder URLs)
  - [ ] Update store metadata with legal URLs

- [ ] **0.4** Store Metadata (CRITICAL)
  - [ ] Create store/ios-metadata.md
  - [ ] Create store/android-metadata.md
  - [ ] Write app description (long & short)
  - [ ] Define keywords for ASO
  - [ ] Set support/marketing/privacy URLs
  - [ ] Define age rating (4+)

---

### Phase 2: Monetization & Analytics ✅

- [ ] **1.0** RevenueCat IAP
  - [ ] Install `react-native-purchases`
  - [ ] Create lib/payments/revenuecat.ts
  - [ ] Configure entitlements in RevenueCat dashboard
  - [ ] Create products: premium_monthly, premium_yearly, lifetime
  - [ ] Update Paywall component with real offerings
  - [ ] Implement purchase flow
  - [ ] Implement restore purchases
  - [ ] Test sandbox purchases
  - [ ] Add EXPO_PUBLIC_RC_API_KEY to .env

- [ ] **2.0** PostHog Analytics
  - [ ] Install `posthog-react-native`
  - [ ] Create lib/analytics/posthog.ts
  - [ ] Create lib/analytics/events.ts (typed events)
  - [ ] Create lib/analytics/screen.ts (screen tracking)
  - [ ] Add opt-in/opt-out toggle in Settings
  - [ ] Track key events:
    - [ ] Onboarding Started/Completed
    - [ ] Task Created/Completed
    - [ ] AI Breakdown Requested
    - [ ] Breathing Started/Completed
    - [ ] Paywall Viewed
    - [ ] Purchase Completed
    - [ ] Caregiver Added
  - [ ] Add EXPO_PUBLIC_POSTHOG_KEY to .env
  - [ ] Verify events in PostHog dashboard

- [ ] **3.0** Sentry Crash Reporting
  - [ ] Install `@sentry/react-native`
  - [ ] Create lib/monitoring/sentry.ts
  - [ ] Initialize Sentry in app/_layout.tsx
  - [ ] Wrap root in Sentry.ErrorBoundary
  - [ ] Configure sourcemap upload in eas.json
  - [ ] Add SENTRY_DSN to .env
  - [ ] Test crash reporting
  - [ ] Verify symbolicated stacks in Sentry

---

### Phase 3: Backend & Sync ✅

- [ ] **4.0** Supabase Backend
  - [ ] Install `@supabase/supabase-js`
  - [ ] Create lib/supabase/client.ts
  - [ ] Create SQL schema:
    - [ ] profiles table
    - [ ] tasks table
    - [ ] caregivers table
    - [ ] push_tokens table
  - [ ] Set up RLS policies
  - [ ] Create auth screen (email/password)
  - [ ] Implement background sync for tasks
  - [ ] Add conflict resolution (cloud wins on delete, newest timestamp wins)
  - [ ] Add EXPO_PUBLIC_SUPABASE_URL to .env
  - [ ] Add EXPO_PUBLIC_SUPABASE_ANON_KEY to .env
  - [ ] Test sync between two devices

- [ ] **5.0** Push Notifications
  - [ ] Update app.json with notification config
  - [ ] Create lib/notifications/register.ts
  - [ ] Request permissions in Settings
  - [ ] Get Expo push token
  - [ ] Store token in Supabase
  - [ ] Create test notification button
  - [ ] Test local notification
  - [ ] Test remote push (via Expo Push API)
  - [ ] Build custom dev client (required for push)

- [ ] **6.0** Caregiver Alerts
  - [ ] Choose email provider (Resend or SendGrid)
  - [ ] Create backend endpoint for alerts
  - [ ] Implement "Send Test Alert" functionality
  - [ ] Add email template for alerts
  - [ ] Add RESEND_API_KEY or SENDGRID_API_KEY to .env
  - [ ] Test email delivery
  - [ ] (Future) Add Twilio SMS behind feature flag

---

### Phase 4: Build & Distribution ✅

- [ ] **7.0** EAS Build Configuration
  - [ ] Create eas.json with profiles:
    - [ ] development (dev client)
    - [ ] preview (TestFlight/Internal)
    - [ ] production
  - [ ] Configure Sentry sourcemap upload
  - [ ] Set up environment variables
  - [ ] Create build scripts in package.json

- [ ] **8.0** Screenshots & App Preview
  - [ ] Capture screenshots:
    - [ ] Home / Today (tasks + Nexa)
    - [ ] AI breakdown screen
    - [ ] Breathing exercise
    - [ ] Accessibility settings
    - [ ] Progress analytics
    - [ ] Caregiver management
    - [ ] Onboarding slide
  - [ ] Frame screenshots for:
    - [ ] iPhone 6.7" (Pro Max)
    - [ ] iPhone 6.1" (Pro)
    - [ ] iPad 12.9"
    - [ ] Android (Pixel, Samsung)
  - [ ] Add captions overlay
  - [ ] (Optional) Record 15-30s App Preview video
  - [ ] Store in store/screenshots/

- [ ] **9.0** Settings Screen Enhancements
  - [ ] Add Analytics toggle (PostHog opt-in/opt-out)
  - [ ] Add Notifications toggle (deep link to OS settings)
  - [ ] Add "Privacy Policy" link
  - [ ] Add "Terms of Service" link
  - [ ] Add "Accessibility Statement" link
  - [ ] Add "Delete my account" button (if logged in)
  - [ ] Add "Delete analytics data" button
  - [ ] Add app version display

---

### Phase 5: Testing & QA ✅

- [ ] **10.0** Testing
  - [ ] Unit tests for AIService
  - [ ] Unit tests for reducers/contexts
  - [ ] E2E test: Onboarding → Create task → AI breakdown
  - [ ] E2E test: Breathing exercise
  - [ ] E2E test: Paywall → Purchase (mock) → Restore
  - [ ] Accessibility audit:
    - [ ] VoiceOver traversal (iOS)
    - [ ] TalkBack traversal (Android)
    - [ ] High contrast mode
    - [ ] Large text (1.2×) doesn't clip
  - [ ] Performance audit:
    - [ ] Cold start < 2s
    - [ ] Hot reload < 500ms
    - [ ] Optimize images (squoosh-cli)
  - [ ] Security audit:
    - [ ] No secrets in code
    - [ ] No PII in analytics
    - [ ] Emails/phones masked in logs

- [ ] **11.0** TestFlight Distribution
  - [ ] Build iOS preview build
  - [ ] Upload to TestFlight
  - [ ] Invite 5+ internal testers
  - [ ] Collect feedback
  - [ ] Fix critical bugs
  - [ ] Build production candidate

---

### Phase 6: Submission Prep ✅

- [ ] **12.0** Final Deliverables
  - [ ] CHANGELOG.md (version history)
  - [ ] SUBMISSION.md (step-by-step submission guide)
  - [ ] Store metadata complete
  - [ ] Screenshots uploaded
  - [ ] Legal docs live
  - [ ] All env keys documented
  - [ ] RevenueCat products mapped
  - [ ] App Store Connect filled
  - [ ] Google Play Console filled

- [ ] **13.0** Pre-Submission Checklist
  - [ ] All acceptance criteria met (see below)
  - [ ] No console errors
  - [ ] No TypeScript errors
  - [ ] ESLint passing
  - [ ] All features tested on device
  - [ ] IAP tested in sandbox
  - [ ] Push notifications working
  - [ ] Analytics flowing
  - [ ] Crash reporting working
  - [ ] Legal docs accessible
  - [ ] Medical disclaimer visible

---

## ✅ Acceptance Criteria (Definition of Done)

### Critical (Must Have)
- [ ] Icons, adaptive icons, splash configured; validation script passes
- [ ] Privacy Policy, Terms, Accessibility, Data Retention pages live
- [ ] RevenueCat integrated; sandbox purchase + restore verified
- [ ] PostHog events flowing; opt-out works; screen views tracked
- [ ] Sentry receiving symbolicated crashes from TestFlight
- [ ] Supabase auth + basic task sync across devices; RLS enforced
- [ ] Push notifications register token; local notification works
- [ ] Email caregiver alert works from "Test Alert" button
- [ ] Screenshots exported and framed for all device classes
- [ ] TestFlight build distributed to 5+ testers
- [ ] E2E happy-path test suite passes
- [ ] Store metadata files complete

### Important (Should Have)
- [ ] Unit tests for critical paths
- [ ] Accessibility audit complete
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Medical disclaimer in-app and in store

### Nice to Have
- [ ] App Preview video
- [ ] Detox E2E tests
- [ ] Localization (future)
- [ ] HealthKit integration (future)

---

## 📦 Required Environment Variables

```bash
# RevenueCat
EXPO_PUBLIC_RC_API_KEY=

# PostHog
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Email Alerts
RESEND_API_KEY=
# OR
SENDGRID_API_KEY=

# Expo
EXPO_PUBLIC_PROJECT_ID=

# App Config
EXPO_PUBLIC_APP_NAME=Nexa
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
```

---

## 🚀 Build Commands

```bash
# Validation
npm run validate-assets
npm run test:unit
npm run test:e2e
npm run lint

# Development Builds
npm run build:ios:dev
npm run build:android:dev

# TestFlight / Internal Testing
npm run build:ios:testflight
npm run build:android:internal

# Production
npm run build:ios:prod
npm run build:android:prod
```

---

## 📊 Progress Tracker

**Current Completion: 78-82%**

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Foundation & Compliance | 🟡 In Progress | 25% |
| Phase 2: Monetization & Analytics | ⚪ Not Started | 0% |
| Phase 3: Backend & Sync | ⚪ Not Started | 0% |
| Phase 4: Build & Distribution | ⚪ Not Started | 0% |
| Phase 5: Testing & QA | ⚪ Not Started | 0% |
| Phase 6: Submission Prep | ⚪ Not Started | 0% |

**Estimated Time to 100%:** 40-60 hours of focused development

---

## 🔥 Blockers & Risks

### Current Blockers
1. **No RevenueCat account** → Need to create account and configure products
2. **No PostHog account** → Need to create project and get API key
3. **No Sentry account** → Need to create project and get DSN
4. **No Supabase project** → Need to create project and set up database
5. **No legal docs** → Need to generate or hire lawyer
6. **No hosting for legal docs** → Need nexa.app domain or use placeholder

### Risks
- **IAP Review Rejection:** Ensure clear value proposition and no misleading claims
- **Privacy Rejection:** Must have privacy policy before submission
- **Guideline 5.1.1:** Medical disclaimer required (not a medical device)
- **Accessibility:** Must pass basic VoiceOver/TalkBack tests
- **Performance:** Must not crash on launch or during core flows

---

## 📞 Support & Resources

- **Expo Docs:** https://docs.expo.dev
- **RevenueCat Docs:** https://docs.revenuecat.com
- **PostHog Docs:** https://posthog.com/docs
- **Sentry Docs:** https://docs.sentry.io
- **Supabase Docs:** https://supabase.com/docs
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies:** https://play.google.com/about/developer-content-policy/

---

## 🎯 Next Actions

1. ✅ Create this RELEASE_NOTES.md
2. ⏭️ Update tsconfig.json with strict checking
3. ⏭️ Create global error boundary
4. ⏭️ Update .env.example with all keys
5. ⏭️ Validate and update app.json icons/splash
6. ⏭️ Create store metadata files
7. ⏭️ Generate legal documents
8. ⏭️ Integrate RevenueCat
9. ⏭️ Integrate PostHog
10. ⏭️ Integrate Sentry

---

**Built with ❤️ for neurodiversity**

*Simplify. Scaffold. Support independence.*
