# Phase 2 Backend Validation Checklist

**Date**: 2025-11-12
**Purpose**: Verify all backend services are properly configured before proceeding to Phase 3

---

## Pre-Validation Setup

### Required Accounts Created
- [ ] RevenueCat account created at https://app.revenuecat.com
- [ ] PostHog account created at https://app.posthog.com
- [ ] Sentry account created at https://sentry.io
- [ ] Supabase account created at https://supabase.com

### Credentials Obtained
- [ ] RevenueCat iOS API key (starts with `appl_`)
- [ ] RevenueCat Android API key (starts with `goog_`)
- [ ] PostHog Project API key (starts with `phc_`)
- [ ] Sentry DSN (starts with `https://`)
- [ ] Supabase Project URL (ends with `.supabase.co`)
- [ ] Supabase Anon Key (long JWT token)

---

## 1. RevenueCat Validation

### Dashboard Configuration
- [ ] iOS app configured with Bundle ID: `com.litmoncloud.nexa`
- [ ] Android app configured with Package Name: `com.litmoncloud.nexa`
- [ ] App Store Shared Secret added (iOS only)
- [ ] Google Play Service Account JSON uploaded (Android only)

### Products & Offerings
- [ ] Product created: `premium_monthly` ($9.99/month)
- [ ] Product created: `premium_annual` ($79.99/year)
- [ ] Entitlement created: `premium`
- [ ] Offering created: `default`
- [ ] Products attached to entitlement
- [ ] Packages added to offering

### API Keys
- [ ] iOS Public SDK Key copied to `.env`
- [ ] Android Public SDK Key copied to `.env`
- [ ] Keys match format: `appl_xxxxxxxxx` and `goog_xxxxxxxxx`

### Test in Expo Go (Expected: Mock Mode)
```bash
bun run start
# Navigate to paywall screen
# Should see: "Preview Mode - Testing Environment"
# Products should display but purchases will fail
```

- [ ] App launches without errors
- [ ] Paywall screen displays
- [ ] Mock mode indicator visible
- [ ] Products list shows (even in mock mode)

---

## 2. PostHog Validation

### Dashboard Configuration
- [ ] Project created: "Nexa Mobile App"
- [ ] Project API Key obtained
- [ ] API Host confirmed: `https://app.posthog.com`

### Event Definitions Created (Recommended)
- [ ] `app_opened`
- [ ] `onboarding_started`
- [ ] `onboarding_completed`
- [ ] `role_selected`
- [ ] `ai_breakdown_requested`
- [ ] `breathing_exercise_started`
- [ ] `breathing_exercise_completed`
- [ ] `paywall_viewed`
- [ ] `subscription_started`

### API Key
- [ ] Project API Key copied to `.env`
- [ ] Key matches format: `phc_xxxxxxxxxxxxxxxx`

### Test in Expo Go
```bash
bun run start
# Open app
# Navigate through onboarding
# Check PostHog dashboard: Activity tab
```

- [ ] Events appear in PostHog dashboard within 1-2 minutes
- [ ] User properties captured (device, OS version)
- [ ] Session started event visible
- [ ] Custom events tracked correctly

**Expected Events**:
1. `$pageview` or `app_opened`
2. `onboarding_started` (if implemented)
3. Device properties: `$os`, `$os_version`, `$device_type`

---

## 3. Sentry Validation

### Dashboard Configuration
- [ ] Project created: "nexa-mobile"
- [ ] Platform: React Native
- [ ] DSN obtained
- [ ] Performance monitoring enabled (100% sample rate for testing)

### Alert Configuration (Optional)
- [ ] Alert created for error rate > 1%
- [ ] Alert created for slow response time > 2s
- [ ] Alert created for crash rate > 0.1%

### DSN
- [ ] DSN copied to `.env`
- [ ] DSN matches format: `https://xxxxx@oXXXXXX.ingest.sentry.io/XXXXXXX`

### Test in Expo Go
```bash
bun run start
# Trigger a test error
# Navigate to Sentry dashboard: Issues tab
```

#### Test Error Capture
Add this to any screen temporarily:

```typescript
import * as Sentry from '@sentry/react-native';

// Test button or useEffect
Sentry.captureException(new Error('Phase 2 Test Error - Backend Integration Validation'));
```

- [ ] Test error appears in Sentry dashboard within 30 seconds
- [ ] Error includes stack trace
- [ ] Device context captured (OS, device model)
- [ ] Release version visible
- [ ] Breadcrumbs show user actions

**Expected in Dashboard**:
1. Error: "Phase 2 Test Error - Backend Integration Validation"
2. Platform: React Native
3. Release: 1.0.0
4. Environment: development

---

## 4. Supabase Validation

### Dashboard Configuration
- [ ] Project created: "nexa-production"
- [ ] Region selected (closest to users)
- [ ] Database password saved securely

### Project Credentials
- [ ] Project URL copied to `.env`
- [ ] Anon/Public key copied to `.env`
- [ ] URL matches format: `https://xxxxxxxx.supabase.co`

### Database Schema Created
Run the SQL from `PHASE_2_BACKEND_SETUP_GUIDE.md` in SQL Editor:

- [ ] Table created: `user_profiles`
- [ ] Table created: `mood_entries`
- [ ] Table created: `journal_entries`
- [ ] Table created: `task_breakdowns`
- [ ] Table created: `breathing_sessions`
- [ ] Table created: `finger_trace_sessions`
- [ ] Table created: `caregiver_patients`
- [ ] Table created: `location_history`

### Row Level Security (RLS)
- [ ] RLS enabled on all tables
- [ ] Policy created: "Users can read own profile"
- [ ] Policy created: "Users can update own profile"
- [ ] Policy created: "Users can manage own mood entries"
- [ ] Policy created: "Users can manage own journal entries"
- [ ] Policy created: "Users can manage own task breakdowns"
- [ ] Policy created: "Caregivers can read patient location if shared"

### Real-time Replication
- [ ] Replication enabled for `mood_entries`
- [ ] Replication enabled for `journal_entries`
- [ ] Replication enabled for `task_breakdowns`
- [ ] Replication enabled for `caregiver_patients`
- [ ] Replication enabled for `location_history`

### Test in Expo Go

#### Test Authentication
```typescript
import { supabase } from './services/backend/SupabaseService';

// Test signup
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123'
});

console.log('Signup result:', data, error);
```

- [ ] Sign up creates user in Supabase Auth
- [ ] User appears in Authentication → Users tab
- [ ] No errors in console

#### Test Database Insert
```typescript
// After authentication
const { data, error } = await supabase
  .from('mood_entries')
  .insert([
    { mood_level: 4, notes: 'Test mood entry for Phase 2 validation' }
  ]);

console.log('Insert result:', data, error);
```

- [ ] Insert succeeds (no error)
- [ ] Entry appears in Table Editor → `mood_entries`
- [ ] `user_id` automatically set to current user
- [ ] `created_at` timestamp populated

#### Test RLS (Access Control)
```typescript
// Try to read another user's data (should fail)
const { data, error } = await supabase
  .from('mood_entries')
  .select('*')
  .eq('user_id', 'some-other-user-id');

console.log('RLS test:', data, error);
// Expected: error or empty array (RLS blocking access)
```

- [ ] Query returns empty array or error
- [ ] RLS prevents cross-user data access
- [ ] Only own data is accessible

#### Test Real-time Subscription
```typescript
const channel = supabase
  .channel('mood-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'mood_entries'
  }, (payload) => {
    console.log('Real-time update:', payload);
  })
  .subscribe();

// Then insert a mood entry from another device/tab
// Should see console log with new entry
```

- [ ] Subscription connects successfully
- [ ] Insert from another client triggers callback
- [ ] Payload contains new entry data

---

## 5. Environment Variables Validation

### .env File Complete
```bash
# Check all variables are set (not placeholders)
cat .env | grep -E "(API_KEY|DSN|SUPABASE)" | grep -v "YOUR_"
```

- [ ] `EXPO_PUBLIC_RC_IOS_API_KEY` has real value
- [ ] `EXPO_PUBLIC_RC_ANDROID_API_KEY` has real value
- [ ] `EXPO_PUBLIC_POSTHOG_KEY` has real value
- [ ] `EXPO_PUBLIC_SENTRY_DSN` has real value
- [ ] `EXPO_PUBLIC_SUPABASE_URL` has real value
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` has real value

### .env.example Updated (Optional)
- [ ] Create `.env.example` with placeholder values
- [ ] Commit `.env.example` to Git
- [ ] Add `.env` to `.gitignore` (should already be there)

---

## 6. Service Integration Testing

### Combined Test Flow
Test all services working together:

1. **Launch App** (PostHog tracks `app_opened`)
2. **Sign Up** (Supabase creates user)
3. **Complete Onboarding** (PostHog tracks `onboarding_completed`)
4. **Create Mood Entry** (Supabase insert, Sentry tracks performance)
5. **Trigger Error** (Sentry captures)
6. **View Paywall** (RevenueCat mock mode, PostHog tracks `paywall_viewed`)

### Verification Checklist
- [ ] PostHog shows 6+ events for test user
- [ ] Supabase has user in Auth and mood entry in database
- [ ] Sentry captured test error with full context
- [ ] RevenueCat shows mock mode (no actual purchase)
- [ ] No console errors or crashes
- [ ] All services responding within acceptable times

---

## 7. Performance & Error Checking

### Console Output Review
- [ ] No "Failed to connect to..." errors
- [ ] No "Invalid API key" warnings
- [ ] No "Network request failed" errors
- [ ] All service initializations logged successfully

### Expected Console Logs (Good Signs)
```
[PostHog] Initialized successfully
[Sentry] SDK initialized
[RevenueCat] SDK initialized (Preview API Mode)
[Supabase] Client created successfully
```

### Network Tab Check (React Native Debugger)
- [ ] RevenueCat API calls return 200
- [ ] PostHog events return 200
- [ ] Sentry events return 200
- [ ] Supabase queries return 200
- [ ] No 401 (unauthorized) errors
- [ ] No 403 (forbidden) errors
- [ ] No 500 (server) errors

---

## 8. Documentation Review

### MCP Query Validation
Review the MCP queries from `PHASE_2_BACKEND_SETUP_GUIDE.md`:

- [ ] **📚 Context7** queries provided accurate documentation
- [ ] **🧠 Sequential** analysis provided helpful recommendations
- [ ] All MCP recommendations followed
- [ ] Any MCP-suggested alternatives documented

### Document Completeness
- [ ] `PHASE_2_BACKEND_SETUP_GUIDE.md` created
- [ ] All setup steps documented
- [ ] SQL schema scripts included
- [ ] Validation steps clear
- [ ] Troubleshooting tips included

---

## 9. Security Validation

### Credential Security
- [ ] `.env` file is in `.gitignore`
- [ ] No credentials committed to Git
- [ ] Credentials stored securely (password manager)
- [ ] Supabase database password saved securely

### Supabase RLS Verification
- [ ] RLS enabled on all tables
- [ ] Users cannot access other users' data
- [ ] Caregivers can only access patients who accepted invite
- [ ] Location data only visible to authorized caregivers

### API Key Scope
- [ ] RevenueCat: Using Public SDK keys (not Secret keys)
- [ ] Supabase: Using Anon key (not Service Role key)
- [ ] Sentry: Using DSN (not Auth Token)
- [ ] PostHog: Using Project API key (not Personal API key)

---

## 10. Final Checklist

### Phase 2 Complete When:
- [ ] All 4 backend services configured
- [ ] All credentials in `.env` file
- [ ] All validation tests passed
- [ ] No errors in console
- [ ] Documentation complete
- [ ] Security verified
- [ ] Ready to proceed to Phase 3 (Legal Documents Hosting)

### Update PRODUCTION_IMPLEMENTATION_PLAN.md
```bash
# Mark Phase 2 as complete
# Update completion date
# Add any notes or issues encountered
git add PRODUCTION_IMPLEMENTATION_PLAN.md PHASE_2_BACKEND_SETUP_GUIDE.md PHASE_2_VALIDATION_CHECKLIST.md .env
git commit -m "docs: complete Phase 2 - Backend Services Configuration

- RevenueCat: iOS and Android apps configured
- PostHog: Analytics and events tracking
- Sentry: Crash reporting and performance monitoring
- Supabase: Database schema and RLS policies
- All credentials added to .env
- Validation tests passed
"
git push origin main
```

---

## Troubleshooting

### RevenueCat Issues
**Problem**: "Invalid API Key"
- **Solution**: Verify you're using Public SDK Key, not Secret Key
- **Check**: Key starts with `appl_` (iOS) or `goog_` (Android)

**Problem**: "Products not loading"
- **Solution**: Offerings take 5-10 minutes to propagate
- **Check**: Refresh RevenueCat dashboard, verify offering is "Current"

### PostHog Issues
**Problem**: Events not appearing
- **Solution**: Check Project API key matches project
- **Check**: Events can take 1-2 minutes to appear

**Problem**: "Invalid API Key"
- **Solution**: Verify key starts with `phc_`
- **Check**: Copy from correct project settings page

### Sentry Issues
**Problem**: Errors not captured
- **Solution**: Verify DSN format is correct
- **Check**: Test with `Sentry.captureException(new Error('test'))`

**Problem**: "DSN not found"
- **Solution**: Verify you copied Client DSN, not Auth Token
- **Check**: DSN starts with `https://` and ends with number

### Supabase Issues
**Problem**: "Failed to connect"
- **Solution**: Verify project URL and anon key
- **Check**: Project is not paused (free tier auto-pauses after 7 days inactivity)

**Problem**: "RLS policy error"
- **Solution**: Enable RLS and verify policies exist
- **Check**: Table Editor → Authentication → Policies tab

**Problem**: "Insert failed"
- **Solution**: Check RLS policies allow inserts
- **Check**: Verify user is authenticated before insert

---

## Next Steps

After completing all validation:

1. ✅ Commit Phase 2 completion to Git
2. 📄 Proceed to Phase 3: Legal Documents Hosting
3. 📸 Then Phase 4: App Store Screenshots
4. 🏗️ Then Phase 5: Production Builds with EAS

See `PRODUCTION_IMPLEMENTATION_PLAN.md` for full roadmap.

---

**Last Updated**: 2025-11-12
**Status**: ⏳ Ready for validation
