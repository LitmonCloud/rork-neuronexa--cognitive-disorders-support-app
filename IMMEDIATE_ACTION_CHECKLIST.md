# ✅ NeuroNexa: Immediate Action Checklist

**Goal**: Configure all backend integrations in 4-5 hours
**Status**: All integrations already implemented, just need configuration!

---

## 🎯 Configuration Sprint Tasks

### ☐ Task 1: Environment Setup (30 minutes)

#### 1.1 Create Production Environment File
```bash
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app
cp .env .env.local
```

#### 1.2 Add to .gitignore
Verify `.env.local` is in `.gitignore` (should already be there)

#### 1.3 Get API Keys
Open these links in browser to get your API keys:
- [ ] RevenueCat: https://app.revenuecat.com/settings/api-keys
- [ ] PostHog: https://app.posthog.com/project/settings
- [ ] Sentry: https://sentry.io/settings/projects/
- [ ] Supabase: https://app.supabase.com/project/_/settings/api

---

### ☐ Task 2: RevenueCat Configuration (2 hours)

#### 2.1 Account Setup (15 mins)
- [ ] Sign up at https://app.revenuecat.com/signup
- [ ] Create new project: "NeuroNexa"
- [ ] Select platform: "Cross-platform (iOS + Android)"

#### 2.2 App Configuration (15 mins)
- [ ] Add iOS app:
  - App name: "NeuroNexa iOS"
  - Bundle ID: `com.litmoncloud.neuronexa`
  - Copy iOS Public SDK Key → `.env.local`
- [ ] Add Android app:
  - App name: "NeuroNexa Android"
  - Package name: `com.litmoncloud.neuronexa`
  - Copy Android Public SDK Key → `.env.local`

#### 2.3 Create Entitlement (5 mins)
- [ ] Go to "Entitlements" → "+ New"
- [ ] Identifier: `premium` (⚠️ **MUST BE EXACTLY "premium"**)
- [ ] Display name: "Premium Access"
- [ ] Save

#### 2.4 Create Products (30 mins)
**Monthly Subscription**:
- [ ] Product ID: `neuronexa_premium_monthly`
- [ ] Price: $9.99/month
- [ ] Free trial: 7 days (optional)
- [ ] Attach to: `premium` entitlement

**Annual Subscription**:
- [ ] Product ID: `neuronexa_premium_annual`
- [ ] Price: $59.99/year
- [ ] Free trial: 7 days (optional)
- [ ] Attach to: `premium` entitlement

**Lifetime Purchase**:
- [ ] Product ID: `neuronexa_premium_lifetime`
- [ ] Type: Non-consumable
- [ ] Price: $149.99
- [ ] Attach to: `premium` entitlement

#### 2.5 Create Default Offering (15 mins)
- [ ] Go to "Offerings" → "+ New Offering"
- [ ] Identifier: `default` (⚠️ **MUST BE "default"**)
- [ ] Add 3 packages:
  - Package 1: `monthly` → `neuronexa_premium_monthly`
  - Package 2: `annual` → `neuronexa_premium_annual`
  - Package 3: `lifetime` → `neuronexa_premium_lifetime`
- [ ] Click "Make current"

#### 2.6 App Store Connect Setup (30 mins)
- [ ] Go to https://appstoreconnect.apple.com
- [ ] Navigate to "My Apps" → "NeuroNexa" → "In-App Purchases"
- [ ] Create 3 products (monthly, annual, lifetime)
- [ ] Match Product IDs exactly with RevenueCat

#### 2.7 Google Play Console Setup (15 mins)
- [ ] Go to https://play.google.com/console
- [ ] Navigate to "NeuroNexa" → "Monetize" → "In-app products"
- [ ] Create 3 products matching RevenueCat Product IDs

---

### ☐ Task 3: PostHog Configuration (1 hour)

#### 3.1 Account Setup (10 mins)
- [ ] Sign up at https://app.posthog.com/signup
- [ ] Create new project: "NeuroNexa"
- [ ] Copy API key → `.env.local` as `EXPO_PUBLIC_POSTHOG_KEY`

#### 3.2 Initialize in App (20 mins)
Edit `app/_layout.tsx`:
```typescript
import { posthog } from '@/services/analytics/PostHogService';

// In root component
useEffect(() => {
  posthog.initialize();
}, []);
```

#### 3.3 Add Tracking (30 mins)
Add to key screens:
- [ ] `app/(tabs)/index.tsx` - Track task events
- [ ] `app/(tabs)/wellness.tsx` - Track breathing events
- [ ] `app/paywall-revenuecat.tsx` - Track paywall events
- [ ] `app/onboarding.tsx` - Track onboarding events
- [ ] `app/task/[id].tsx` - Track task completion events

Example:
```typescript
import { posthog } from '@/services/analytics/PostHogService';

// Track screen view
useEffect(() => {
  posthog.screen('Tasks');
}, []);

// Track event
posthog.trackTaskCreated(true, 'high');
```

---

### ☐ Task 4: Sentry Configuration (1 hour)

#### 4.1 Account Setup (10 mins)
- [ ] Sign up at https://sentry.io/signup
- [ ] Create new project: "NeuroNexa" (React Native platform)
- [ ] Copy DSN → `.env.local` as `EXPO_PUBLIC_SENTRY_DSN`

#### 4.2 Initialize in App (10 mins)
Edit `app/_layout.tsx`:
```typescript
import { sentry } from '@/services/analytics/SentryService';

// Before root component
sentry.initialize();
```

#### 4.3 Update ErrorBoundary (20 mins)
Edit `components/ErrorBoundary.tsx`:
```typescript
import { sentry } from '@/services/analytics/SentryService';

// In error handler
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  sentry.captureException(error, {
    componentStack: errorInfo.componentStack,
  });
}
```

#### 4.4 Configure Source Maps (10 mins)
Edit `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "SENTRY_ORG": "your-org",
        "SENTRY_PROJECT": "neuronexa"
      }
    }
  }
}
```

#### 4.5 Test Crash Reporting (10 mins)
Add test button to trigger crash:
```typescript
<Button onPress={() => {
  sentry.captureException(new Error('Test crash'));
}}>Test Sentry</Button>
```

---

### ☐ Task 5: Supabase Quick Setup (30 mins)

#### 5.1 Account Setup (10 mins)
- [ ] Sign up at https://app.supabase.com/sign-up
- [ ] Create new project: "NeuroNexa"
- [ ] Wait for provisioning (~2 mins)
- [ ] Go to "Settings" → "API"
- [ ] Copy URL → `.env.local` as `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Copy anon key → `.env.local` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`

#### 5.2 Initialize in App (10 mins)
Edit `app/_layout.tsx`:
```typescript
import { supabase } from '@/services/backend/SupabaseService';

// In root component
useEffect(() => {
  supabase.initialize();
}, []);
```

#### 5.3 Test Connection (10 mins)
```typescript
// Quick test
const testConnection = async () => {
  await supabase.initialize();
  const session = await supabase.getSession();
  console.log('Supabase connected:', !!session);
};
```

---

## 🧪 Testing Checklist

### ☐ Test RevenueCat
```bash
# iOS Simulator
bun run start
# Press "i" for iOS
# Navigate to paywall
# Attempt sandbox purchase
```
- [ ] Paywall loads with 3 packages
- [ ] Prices display correctly
- [ ] Purchase completes (sandbox)
- [ ] Premium status updates
- [ ] Restore purchases works

### ☐ Test PostHog
- [ ] Events appear in PostHog dashboard
- [ ] Screen views are tracked
- [ ] User properties are set
- [ ] Events have correct metadata

### ☐ Test Sentry
- [ ] Trigger test error
- [ ] Error appears in Sentry dashboard
- [ ] Stack trace is readable
- [ ] Breadcrumbs are captured

### ☐ Test Supabase
- [ ] Connection succeeds
- [ ] Anonymous sign-in works
- [ ] Session persists

---

## 📝 Environment Variables Summary

Your `.env.local` should have these values:

```bash
# RevenueCat (Step 2)
EXPO_PUBLIC_RC_IOS_API_KEY=appl_xxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_xxxxxxxxxxxxxxxxxxxxx

# PostHog (Step 3)
EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry (Step 4)
EXPO_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/xxxxxxxxxxxxx

# Supabase (Step 5)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxx
```

---

## 🎯 Success Criteria

### Configuration Complete ✅
- [ ] All API keys added to `.env.local`
- [ ] All services initialized in `app/_layout.tsx`
- [ ] RevenueCat products configured
- [ ] PostHog tracking added to 5+ screens
- [ ] Sentry error boundary updated
- [ ] Supabase connection verified

### Testing Complete ✅
- [ ] RevenueCat sandbox purchase works
- [ ] PostHog events flowing to dashboard
- [ ] Sentry test error captured
- [ ] Supabase connection successful

---

## 📞 Support Resources

### Documentation
- RevenueCat: https://docs.revenuecat.com/docs/reactnative
- PostHog: https://posthog.com/docs/libraries/react-native
- Sentry: https://docs.sentry.io/platforms/react-native/
- Supabase: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

### Created Guides
- `docs/REVENUECAT_SETUP.md` - Complete RevenueCat setup
- `docs/WEEK_1_INTEGRATION_STATUS.md` - Integration status report
- `INTEGRATION_DISCOVERY_REPORT.md` - Full discovery report

---

## 🚀 After Completion

Once all tasks are checked off, you'll have:
1. ✅ Real in-app purchases working (RevenueCat)
2. ✅ User analytics tracking (PostHog)
3. ✅ Crash reporting (Sentry)
4. ✅ Cloud backend (Supabase)

**Next**: Move to Supabase database schema design (Day 2)

---

## ⏱️ Time Breakdown

| Task | Estimated Time | Priority |
|------|----------------|----------|
| Environment Setup | 30 mins | 🔴 Critical |
| RevenueCat | 2 hours | 🔴 Critical |
| PostHog | 1 hour | 🟡 High |
| Sentry | 1 hour | 🟡 High |
| Supabase Quick Setup | 30 mins | 🟢 Medium |
| **TOTAL** | **5 hours** | - |

---

**Start Time**: _________
**End Time**: _________
**Status**: ☐ In Progress | ☐ Complete

**Created**: 2025-11-12
**Last Updated**: 2025-11-12
