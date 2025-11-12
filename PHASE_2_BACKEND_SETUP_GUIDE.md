# Phase 2: Backend Services Configuration Guide

**Status**: 🔄 In Progress
**Started**: 2025-11-12
**Estimated Time**: 4-5 hours
**MCP Integration**: Context7 (📚) + Sequential (🧠)

---

## Overview

This guide walks you through configuring all backend services for the Nexa app:
1. **RevenueCat** - In-app purchases and subscriptions
2. **PostHog** - Product analytics and feature flags
3. **Sentry** - Crash reporting and performance monitoring
4. **Supabase** - PostgreSQL backend with real-time capabilities

All services have free tiers sufficient for initial launch and early growth.

---

## Pre-Implementation Checklist

- [ ] **📚 Context7**: Research "RevenueCat Expo React Native setup guide"
- [ ] **📚 Context7**: Research "PostHog React Native installation"
- [ ] **📚 Context7**: Research "Sentry Expo SDK setup"
- [ ] **📚 Context7**: Research "Supabase Expo React Native guide"
- [ ] **🧠 Sequential**: Analyze "Optimal freemium pricing strategy for cognitive support app targeting ADHD/autism users"

---

## Phase 2.1: RevenueCat Setup (2 hours)

### Step 1: Create RevenueCat Account (10 mins)

1. Go to https://app.revenuecat.com/signup
2. Sign up with your email
3. Create a new project: **"Nexa"**
4. Select **Mobile** as the platform type

### Step 2: Configure iOS App (30 mins)

#### Create iOS App in RevenueCat

1. In RevenueCat dashboard, go to **Projects** → **Nexa** → **Apps**
2. Click **+ New** → **Apple App Store**
3. Fill in details:
   - **App Name**: Nexa
   - **Bundle ID**: `com.litmoncloud.nexa`
   - **Shared Secret**: (Get from App Store Connect - see below)

#### Get iOS Shared Secret from App Store Connect

1. Log in to https://appstoreconnect.apple.com
2. Go to **My Apps** → **Nexa** (or create if not exists)
3. Click **App Information** → **General**
4. Scroll to **App-Specific Shared Secret**
5. Click **Generate** or copy existing secret
6. Paste into RevenueCat iOS app configuration

#### Copy iOS API Key

1. In RevenueCat dashboard, go to **API Keys**
2. Find **iOS** section
3. Copy the **Public SDK Key** (starts with `appl_`)
4. Save for `.env` file later

**Expected format**: `appl_xxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Configure Android App (30 mins)

#### Create Android App in RevenueCat

1. In RevenueCat dashboard, go to **Apps**
2. Click **+ New** → **Google Play Store**
3. Fill in details:
   - **App Name**: Nexa
   - **Package Name**: `com.litmoncloud.nexa`
   - **Service Account JSON**: (Upload from Google Play Console - see below)

#### Get Service Account JSON from Google Play Console

1. Log in to https://play.google.com/console
2. Go to **Setup** → **API access**
3. Click **Create new service account**
4. Follow link to Google Cloud Console
5. Create service account with **Owner** role
6. Generate JSON key
7. Download and upload to RevenueCat

#### Copy Android API Key

1. In RevenueCat dashboard, go to **API Keys**
2. Find **Android** section
3. Copy the **Public SDK Key** (starts with `goog_`)
4. Save for `.env` file later

**Expected format**: `goog_xxxxxxxxxxxxxxxxxxxxxxxx`

### Step 4: Create Products and Offerings (30 mins)

#### 📚 Context7 Query Before This Step
Query: "RevenueCat product configuration best practices for mobile apps"

#### Create Subscription Product

1. In RevenueCat dashboard, go to **Products**
2. Click **+ New** → **Subscription**
3. Create monthly subscription:
   - **Product ID**: `premium_monthly`
   - **Price**: $9.99/month (or use Sequential recommendation below)
   - **Duration**: 1 month
4. Create annual subscription:
   - **Product ID**: `premium_annual`
   - **Price**: $79.99/year (20% discount)
   - **Duration**: 1 year

#### 🧠 Sequential Analysis - Pricing Strategy
Query: "Analyze optimal pricing strategy for cognitive support app targeting ADHD/autism users with features: AI task breakdown, breathing exercises, finger trace exercises, caregiver dashboard, location tracking. Consider accessibility needs and competitive landscape (Calm: $69.99/yr, Headspace: $69.99/yr, Focus@Will: $52.49/yr)."

**Expected Recommendations**:
- Monthly: $7.99-$9.99 (accessibility-focused pricing)
- Annual: $59.99-$79.99 (25-30% discount)
- Free tier: Core breathing + 1 daily AI breakdown
- Premium: Unlimited AI breakdowns, finger trace, caregiver features

#### Create Entitlements

1. Go to **Entitlements**
2. Click **+ New Entitlement**
3. Create: `premium`
   - Description: "Full access to all Nexa features"
   - Attach products: `premium_monthly`, `premium_annual`

#### Create Offering

1. Go to **Offerings**
2. Create **default** offering
3. Add packages:
   - **Monthly**: $9.99/month (`premium_monthly`)
   - **Annual**: $79.99/year (`premium_annual`)
4. Set **Annual** as default package

### Step 5: Test Configuration (30 mins)

#### Verify in Dashboard

- [ ] iOS app configured with Bundle ID `com.litmoncloud.nexa`
- [ ] Android app configured with Package Name `com.litmoncloud.nexa`
- [ ] 2 products created (monthly + annual)
- [ ] 1 entitlement created (`premium`)
- [ ] 1 offering created (`default`)
- [ ] API keys copied (iOS and Android)

#### Add to .env File

```bash
# RevenueCat
EXPO_PUBLIC_RC_IOS_API_KEY=appl_xxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Phase 2.2: PostHog Setup (30 mins)

### Step 1: Create PostHog Account (10 mins)

1. Go to https://app.posthog.com/signup
2. Sign up with your email
3. Create organization: **"Nexa"**
4. Create project: **"Nexa Mobile App"**

### Step 2: Get API Key (5 mins)

#### 📚 Context7 Query Before This Step
Query: "PostHog React Native SDK installation and configuration"

1. In PostHog dashboard, go to **Settings** → **Project** → **API Keys**
2. Copy **Project API Key** (starts with `phc_`)
3. Note the **API Host**: `https://app.posthog.com` (default)

### Step 3: Configure Events (15 mins)

#### Recommended Events to Track

Create these event definitions in PostHog:

**User Journey Events**:
- `app_opened` - App launched
- `onboarding_started` - User begins onboarding
- `onboarding_completed` - User completes onboarding
- `role_selected` - User chooses patient/caregiver role

**Feature Usage Events**:
- `ai_breakdown_requested` - User requests AI task breakdown
- `breathing_exercise_started` - User starts breathing exercise
- `breathing_exercise_completed` - User completes breathing exercise
- `finger_trace_started` - User starts finger trace exercise
- `finger_trace_completed` - User completes finger trace exercise
- `journal_entry_created` - User creates journal entry
- `caregiver_invite_sent` - Caregiver sends patient invite
- `location_tracking_enabled` - User enables location tracking

**Subscription Events**:
- `paywall_viewed` - User sees subscription paywall
- `subscription_started` - User initiates subscription flow
- `subscription_completed` - User completes subscription
- `subscription_cancelled` - User cancels subscription

### Step 4: Add to .env File

```bash
# PostHog
EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Phase 2.3: Sentry Setup (30 mins)

### Step 1: Create Sentry Account (10 mins)

1. Go to https://sentry.io/signup/
2. Sign up with your email
3. Create organization: **"Nexa"**
4. Create project:
   - **Platform**: React Native
   - **Project Name**: nexa-mobile

### Step 2: Get DSN (5 mins)

#### 📚 Context7 Query Before This Step
Query: "Sentry React Native Expo SDK 54 integration guide"

1. In Sentry dashboard, go to **Settings** → **Projects** → **nexa-mobile**
2. Click **Client Keys (DSN)**
3. Copy the **DSN** (starts with `https://`)

**Expected format**: `https://xxxxxxxxxxxxxxxxxxxxxxxxxx@o####.ingest.sentry.io/######`

### Step 3: Configure Performance Monitoring (15 mins)

#### Enable Performance Features

1. Go to **Settings** → **Projects** → **nexa-mobile** → **Performance**
2. Enable:
   - ✅ **Performance Monitoring** (100% sample rate for testing, 10% for production)
   - ✅ **Session Replay** (10% sample rate)
   - ✅ **Profiling** (for identifying slow code)

#### Set Up Alerts

1. Go to **Alerts** → **Create Alert**
2. Create alert for:
   - **Error Rate**: > 1% in 5 minutes
   - **Response Time**: > 2 seconds average
   - **Crash Rate**: > 0.1% in 15 minutes

### Step 4: Add to .env File

```bash
# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxx@o####.ingest.sentry.io/######
```

---

## Phase 2.4: Supabase Setup (1.5 hours)

### Step 1: Create Supabase Account (10 mins)

1. Go to https://supabase.com/dashboard
2. Sign up with GitHub (recommended) or email
3. Create organization: **"Nexa"**
4. Create project:
   - **Name**: nexa-production
   - **Database Password**: (generate strong password, save securely)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Pricing Plan**: Free (upgradable later)

### Step 2: Get Project Credentials (5 mins)

#### 📚 Context7 Query Before This Step
Query: "Supabase Expo React Native authentication and real-time setup"

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token)

### Step 3: Database Schema Setup (45 mins)

#### 🧠 Sequential Analysis - Schema Design
Query: "Design optimal PostgreSQL schema for mental health app with: user profiles, mood tracking, journal entries, task breakdowns, breathing exercises, caregiver-patient relationships, location tracking. Include Row Level Security (RLS) policies for HIPAA compliance."

#### Create Tables

1. Go to **SQL Editor** in Supabase dashboard
2. Run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('patient', 'caregiver')),
  display_name TEXT,
  phone_number TEXT,
  emergency_contacts JSONB,
  accessibility_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Mood Tracking Table
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal Entries Table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  encrypted_content TEXT, -- For future E2EE
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Breakdowns Table
CREATE TABLE task_breakdowns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_task TEXT NOT NULL,
  breakdown JSONB NOT NULL, -- AI-generated steps
  completed_steps INTEGER[] DEFAULT '{}',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Breathing Exercise Sessions Table
CREATE TABLE breathing_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type TEXT, -- e.g., "4-7-8", "box"
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finger Trace Exercise Sessions Table
CREATE TABLE finger_trace_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shape_type TEXT, -- e.g., "circle", "infinity"
  duration_seconds INTEGER,
  accuracy_score DECIMAL(3,2), -- 0.00 to 1.00
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Caregiver-Patient Relationships Table
CREATE TABLE caregiver_patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caregiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_type TEXT, -- e.g., "parent", "therapist", "family_member"
  permissions JSONB, -- What caregiver can access
  invite_code TEXT UNIQUE,
  invite_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(caregiver_id, patient_id)
);

-- Location Tracking Table (for caregiver monitoring)
CREATE TABLE location_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accuracy DECIMAL(10, 2), -- meters
  shared_with UUID[], -- Array of caregiver user IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_mood_entries_user_created ON mood_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_entries_user_created ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_task_breakdowns_user_status ON task_breakdowns(user_id, status);
CREATE INDEX idx_caregiver_patients_caregiver ON caregiver_patients(caregiver_id);
CREATE INDEX idx_caregiver_patients_patient ON caregiver_patients(patient_id);
CREATE INDEX idx_location_history_user_created ON location_history(user_id, created_at DESC);
```

### Step 4: Row Level Security (RLS) Policies (30 mins)

#### Enable RLS on All Tables

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_breakdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finger_trace_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;
```

#### Create RLS Policies

```sql
-- User Profiles: Users can read/write their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mood Entries: Users can read/write their own entries
CREATE POLICY "Users can manage own mood entries" ON mood_entries
  FOR ALL USING (auth.uid() = user_id);

-- Journal Entries: Users can read/write their own entries
CREATE POLICY "Users can manage own journal entries" ON journal_entries
  FOR ALL USING (auth.uid() = user_id);

-- Task Breakdowns: Users can read/write their own tasks
CREATE POLICY "Users can manage own task breakdowns" ON task_breakdowns
  FOR ALL USING (auth.uid() = user_id);

-- Breathing Sessions: Users can read/write their own sessions
CREATE POLICY "Users can manage own breathing sessions" ON breathing_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Finger Trace Sessions: Users can read/write their own sessions
CREATE POLICY "Users can manage own finger trace sessions" ON finger_trace_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Caregiver-Patient: Caregivers and patients can see their relationships
CREATE POLICY "Users can see their caregiver relationships" ON caregiver_patients
  FOR SELECT USING (auth.uid() = caregiver_id OR auth.uid() = patient_id);

CREATE POLICY "Caregivers can create relationships" ON caregiver_patients
  FOR INSERT WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Patients can accept invites" ON caregiver_patients
  FOR UPDATE USING (auth.uid() = patient_id);

-- Location History: Users can manage own location, caregivers can read if permitted
CREATE POLICY "Users can manage own location" ON location_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can read patient location if shared" ON location_history
  FOR SELECT USING (
    auth.uid() = ANY(shared_with) OR
    EXISTS (
      SELECT 1 FROM caregiver_patients
      WHERE patient_id = location_history.user_id
      AND caregiver_id = auth.uid()
      AND invite_accepted = TRUE
    )
  );
```

### Step 5: Enable Real-time (10 mins)

1. Go to **Database** → **Replication**
2. Enable replication for:
   - ✅ `mood_entries`
   - ✅ `journal_entries`
   - ✅ `task_breakdowns`
   - ✅ `caregiver_patients`
   - ✅ `location_history`

### Step 6: Add to .env File

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Final Validation

### Step 1: Update .env File

Your complete `.env` file should now look like this:

```bash
# RevenueCat
EXPO_PUBLIC_RC_IOS_API_KEY=appl_xxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_xxxxxxxxxxxxxxxxxxxxxxxx

# PostHog
EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxx@o####.ingest.sentry.io/######

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Legal URLs (will be updated in Phase 3)
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://nexa.app/legal/privacy
EXPO_PUBLIC_TERMS_URL=https://nexa.app/legal/terms
```

### Step 2: Test in Expo Go

```bash
# Start the app
bun run start

# Test each service:
# - RevenueCat: Should show mock mode in Expo Go
# - PostHog: Events should appear in dashboard
# - Sentry: Test errors should appear in dashboard
# - Supabase: Test authentication and database queries
```

### Step 3: Verify Service Dashboards

- [ ] **RevenueCat**: Products and offerings visible
- [ ] **PostHog**: Events flowing into dashboard
- [ ] **Sentry**: Test error captured
- [ ] **Supabase**: Tables created, RLS enabled

### Step 4: 🧠 Sequential Validation
Query: "Review backend services configuration checklist - verify RevenueCat, PostHog, Sentry, and Supabase are properly configured for production deployment"

---

## Cost Summary

All services start with free tiers:

| Service | Free Tier | Upgrade Threshold | Cost After |
|---------|-----------|-------------------|------------|
| **RevenueCat** | Up to $10k MRR | >$10k MRR | 1% of revenue |
| **PostHog** | 1M events/month | >1M events | $0.00031/event |
| **Sentry** | 5k errors/month | >5k errors | $26/month |
| **Supabase** | 500MB database, 2GB bandwidth | >500MB or >2GB | $25/month |

**Total Monthly Cost**: $0 initially, ~$51/month if exceeding all free tiers

---

## Completion Checklist

- [ ] RevenueCat iOS app configured
- [ ] RevenueCat Android app configured
- [ ] RevenueCat products and offerings created
- [ ] PostHog project created and API key obtained
- [ ] Sentry project created and DSN obtained
- [ ] Supabase database schema created
- [ ] Supabase RLS policies configured
- [ ] Supabase real-time enabled
- [ ] All credentials added to `.env` file
- [ ] Services tested in Expo Go
- [ ] All dashboards verified

**Phase 2 Completion Date**: ___________

**Issues Encountered**:

___________

**Notes**:

___________

---

## Next Phase

Once Phase 2 is complete, proceed to **Phase 3: Legal Documents Hosting** (2-3 hours).

See PRODUCTION_IMPLEMENTATION_PLAN.md for full roadmap.
