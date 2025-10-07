# Nexa App Structure Summary

## Overview
Nexa is a comprehensive cognitive support application designed for three distinct user types:
1. **Cognitive Disorder Patients** (ADHD, executive function challenges)
2. **Memory Support Patients** (Alzheimer's, dementia)
3. **Caregivers** (supporting patients)

## User Flow Architecture

### 1. Initial Flow
```
App Launch
  ↓
Terms Agreement (/terms-agreement)
  ↓
Onboarding (/onboarding)
  ↓
Role Selection → Patient or Caregiver
  ↓
[If Patient] → Support Type Selection
  ├─ Cognitive Disorders
  └─ Memory Support (Alzheimer's/Dementia)
  ↓
[If Caregiver] → Paywall (Subscription Required)
  ↓
Main App Experience
```

### 2. User Types & Navigation

#### A. Cognitive Disorder Patients
**Tab Structure:**
- **Tasks** (`/`) - Task management with AI breakdown
- **Nexa** (`/coach`) - AI coaching assistant
- **Progress** (`/progress`) - Analytics and achievements
- **Wellness** (`/wellness`) - Breathing exercises, finger tracing
- **Settings** (`/settings`) - App configuration

**Key Features:**
- AI-powered task breakdown
- Step-by-step guidance
- Progress tracking
- Wellness exercises
- Accessibility options

#### B. Memory Support Patients
**Tab Structure:**
- **Home** (`/dementia-support`) - Daily orientation, emergency contacts
- **Wellness** (`/wellness`) - Mindfulness exercises
- **Settings** (`/settings`) - App configuration

**Key Features:**
- Daily orientation (date, time, location)
- Photo-based emergency contacts
- Medication reminders
- Memory journal
- Routine anchors
- Location tracking (optional)

#### C. Caregivers
**Navigation:**
- Redirected to `/caregiver-dashboard` (no tabs)
- Access to patient management
- Task assignment
- Location monitoring
- Alert system

**Key Features:**
- Multi-patient management
- Task creation for patients
- Real-time notifications
- Location monitoring
- Emergency alerts

## Route Structure

### Public Routes (No Auth Required)
- `/terms-agreement` - Legal agreement
- `/onboarding` - Initial setup
- `/paywall` - Subscription management

### Patient Routes
- `/(tabs)/` - Main tab navigation
- `/task/[id]` - Task detail view
- `/finger-trace` - Finger tracing exercises
- `/breathing-exercise` - Breathing exercises
- `/emergency-contacts` - Emergency contact management
- `/memory-journal` - Memory journal entries
- `/patient-location` - Location tracking settings
- `/patient-generate-code` - Generate caregiver invite code

### Caregiver Routes
- `/caregiver-dashboard` - Main dashboard
- `/caregiver-hub` - Patient management hub
- `/caregiver-task-manager` - Task assignment
- `/caregiver-patient-tasks` - View patient tasks
- `/caregiver-location-monitor` - Monitor patient locations
- `/invite-redeem` - Redeem patient invite code

### Shared Routes
- `/notifications` - Notification center
- `/notification-settings` - Notification preferences
- `/settings` - App settings

## Key Contexts & State Management

### 1. UserProfileContext
- Stores user role (patient/caregiver)
- Patient type (cognitive/memory)
- Onboarding status
- User preferences
- Learning patterns

### 2. TaskContext
- Task CRUD operations
- AI task breakdown
- Step management
- Progress tracking

### 3. DementiaContext
- Memory support settings
- Emergency contacts
- Medication reminders
- Memory journal
- Routine anchors

### 4. SubscriptionContext
- Premium features
- Trial management
- Usage limits
- Paywall logic

### 5. ThemeContext
- Light/dark mode
- Color schemes
- Accessibility settings

### 6. NotificationContext
- Push notifications
- In-app notifications
- Alert management

### 7. LocationContext
- GPS tracking
- Geofencing
- Location history

## Feature Breakdown

### Cognitive Disorder Features
1. **Task Management**
   - AI-powered task breakdown
   - Step-by-step guidance
   - Visual timers
   - Progress tracking

2. **AI Coach (Nexa)**
   - Conversational AI assistant
   - Personalized encouragement
   - Learning user preferences
   - Adaptive communication style

3. **Wellness**
   - Breathing exercises (4 patterns)
   - Finger tracing exercises
   - Mindfulness activities

4. **Progress Tracking**
   - Completion rates
   - Streaks
   - Achievements
   - Analytics

### Memory Support Features
1. **Daily Orientation**
   - Current date/time display
   - Location information
   - Routine reminders

2. **Emergency Contacts**
   - Photo-based contacts
   - One-tap calling
   - Primary contact designation

3. **Memory Journal**
   - Photo entries
   - AI-enhanced descriptions
   - Date-based organization

4. **Medication Management**
   - Visual reminders
   - Time-based alerts
   - Dosage tracking

5. **Location Safety**
   - GPS tracking
   - Geofencing
   - Caregiver alerts

### Caregiver Features
1. **Patient Management**
   - Multiple patient support
   - Invite code system
   - Patient profiles

2. **Task Assignment**
   - Create tasks for patients
   - Monitor completion
   - Provide guidance

3. **Monitoring**
   - Location tracking
   - Activity alerts
   - Emergency notifications

4. **Communication**
   - Real-time alerts
   - Push notifications
   - In-app messaging

## Technical Architecture

### Frontend
- **Framework:** React Native (Expo)
- **Routing:** Expo Router (file-based)
- **State:** React Query + Context API
- **Styling:** StyleSheet API
- **Icons:** Lucide React Native

### Backend
- **API:** tRPC + Hono
- **Database:** Supabase (PostgreSQL)
- **Storage:** AsyncStorage (local)
- **Real-time:** Supabase Realtime

### Services
- **Analytics:** PostHog, Sentry
- **Notifications:** Expo Notifications
- **Location:** Expo Location
- **AI:** Custom AI service (Rork Toolkit)

## Navigation Guards

### Route Protection Logic
```typescript
1. Check terms acceptance → /terms-agreement
2. Check onboarding → /onboarding
3. Check role:
   - Caregiver → Check subscription → /paywall or /caregiver-dashboard
   - Patient (cognitive) → /(tabs) with full features
   - Patient (memory) → /(tabs) with memory-focused features
```

### Tab Visibility Rules
- **Cognitive Patients:** All tabs visible
- **Memory Patients:** Home, Wellness, Settings only
- **Caregivers:** No tabs (custom navigation)

## Data Flow

### Task Creation Flow
```
User creates task
  ↓
Check subscription limits
  ↓
Save to local storage (AsyncStorage)
  ↓
Navigate to task detail
  ↓
AI breakdown (background)
  ↓
Update task with steps
  ↓
Sync to backend (if available)
```

### Caregiver-Patient Connection
```
Patient generates invite code
  ↓
Code stored in backend
  ↓
Caregiver redeems code
  ↓
Relationship established
  ↓
Caregiver gains access to patient data
  ↓
Real-time sync enabled
```

## Accessibility Features

1. **Visual**
   - Large text option
   - High contrast mode
   - Color-blind friendly palettes

2. **Cognitive**
   - Simple language
   - Clear visual hierarchy
   - Step-by-step guidance
   - Visual timers

3. **Motor**
   - Large touch targets
   - Gesture alternatives
   - Voice input (future)

## Subscription Model

### Free Tier
- Limited tasks per day (3)
- Basic features
- Ads (future)

### Premium Tier
- Unlimited tasks
- AI coach access
- Advanced analytics
- Priority support
- No ads

### Caregiver Subscription
- Required for caregiver features
- Multi-patient support
- Location tracking
- Real-time alerts

## Future Enhancements

1. **Voice Integration**
   - Voice commands
   - Speech-to-text
   - Text-to-speech

2. **Social Features**
   - Support groups
   - Shared progress
   - Community challenges

3. **Advanced AI**
   - Predictive task suggestions
   - Habit pattern recognition
   - Personalized interventions

4. **Wearable Integration**
   - Apple Watch support
   - Health data sync
   - Activity tracking

5. **Telehealth**
   - Video consultations
   - Provider integration
   - Medical records

## Configuration Files

### app.json
- App metadata
- Permissions
- Platform-specific settings
- Plugin configuration

### Key Permissions
- Camera (memory journal)
- Location (safety features)
- Notifications (reminders)
- Storage (local data)

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_TOOLKIT_URL=<AI service URL>
EXPO_PUBLIC_SUPABASE_URL=<Supabase URL>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<Supabase key>
EXPO_PUBLIC_POSTHOG_KEY=<PostHog key>
EXPO_PUBLIC_SENTRY_DSN=<Sentry DSN>
```

## Testing Strategy

### Unit Tests
- Context providers
- Utility functions
- Service classes

### Integration Tests
- User flows
- API interactions
- State management

### E2E Tests
- Onboarding flow
- Task management
- Caregiver-patient connection

## Deployment

### Development
```bash
bun expo start
```

### Production Build
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Web Preview
```bash
bun expo start --web
```

## Support & Documentation

- **User Guide:** In-app help system
- **Developer Docs:** Technical documentation
- **API Docs:** tRPC schema
- **Legal:** Privacy policy, terms of service

---

**Last Updated:** 2025-01-07
**Version:** 1.0.0
**Maintainer:** Nexa Development Team
