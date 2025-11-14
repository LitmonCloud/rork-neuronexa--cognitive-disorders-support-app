# NeuroNexa User Flow Analysis

Complete user journey documentation for all user types in the NeuroNexa cognitive disorders support application.

## User Types Overview

NeuroNexa serves **three distinct user personas**, each with specialized flows and features:

### 1. **Caregiver** (`role: 'caregiver'`)
Professional or family member providing support to patients

### 2. **Cognitive Patient** (`role: 'patient'`, `patientType: 'cognitive'`)
Users with ADHD, executive function challenges, task management needs

### 3. **Memory Patient** (`role: 'patient'`, `patientType: 'memory'`)
Users with Alzheimer's, dementia, or memory impairment

---

## Universal Entry Flow (All Users)

### App Launch → Terms → Onboarding

```
App Launch
    ↓
Terms Agreement (/terms-agreement)
    ↓
Onboarding Flow (/onboarding)
    ↓
Role Selection (Step 0)
    ├─→ Caregiver Flow
    ├─→ Cognitive Patient Flow
    └─→ Memory Patient Flow
```

### Terms Agreement Screen
- **Purpose**: Legal compliance and user consent
- **Actions**: Accept terms of service and privacy policy
- **Navigation**: Must accept to proceed → Onboarding

### Onboarding Flow (5 Steps)

#### **Step 0: Role Selection**
- **Question**: "How will you be using Nexa?"
- **Options**:
  - 👤 **Patient/User**: "I need help managing my tasks and daily activities"
  - 👥 **Caregiver**: "I help someone manage their tasks and provide support"
- **Decision Point**: Role selection determines subsequent flow

#### **Step 1: Support Type** (Patients Only)
- **Question**: "What kind of support do you need?"
- **Options**:
  - 🧩 **Cognitive Disorders**: ADHD, executive function, task management support
  - ❤️ **Memory Support**: Alzheimer's, dementia, memory care assistance
- **Caregiver Path**: Skips this step (goes directly to Step 2)

#### **Step 2: Welcome & Name**
- **Prompt**: "Let's get to know you better"
- **Input**: User enters their name
- **All Roles**: Required for personalization

#### **Step 3: Emergency Contacts** (Patients Only)
- **Purpose**: Safety network setup
- **Inputs**:
  - Contact name
  - Phone number
  - Relationship (optional)
- **Features**:
  - Add multiple contacts
  - First contact becomes primary
  - Can skip if needed
- **Caregiver Path**: Skips this step → Goes directly to Paywall

#### **Step 4: Completion**
- **Confirmation**: "You're All Set, [Name]!"
- **Personalized Message**:
  - Caregiver: "You can now manage tasks and provide support to your patients."
  - Cognitive Patient: "Let's start breaking down tasks and achieving your goals together."
  - Memory Patient: "We're here to support your memory and daily routines."
- **Navigation**:
  - Caregivers → Paywall (subscription required)
  - Patients → Main App (free access)

---

## Caregiver User Flow

### Flow Summary
```
Onboarding → Paywall → Caregiver Hub → Patient Management
```

### Post-Onboarding Navigation

**Subscription Requirement**: Caregivers MUST subscribe to access features.

**Paywall Screen** [(/paywall)]:
- RevenueCat integration
- Subscription packages
- Free trial options
- Restoration for existing subscribers

### Main Navigation Structure

After subscription, caregivers access a specialized hub:

**Caregiver Hub** [(/caregiver-hub)]:
- Central dashboard for patient management
- Patient list and status
- Quick actions for common tasks

### Core Caregiver Screens

#### 1. **Caregiver Dashboard** [(/caregiver-dashboard)]
- Redirects to `/caregiver-hub` automatically
- Ensures role-based access control

#### 2. **Caregiver Hub** [(/caregiver-hub)]
- Overview of all patients
- Patient status summaries
- Navigation to patient-specific features

#### 3. **Patient Task Management** [(/caregiver-patient-tasks)]
- View patient tasks
- Create tasks for patients
- Monitor task completion
- Provide support and guidance

#### 4. **Task Manager** [(/caregiver-task-manager)]
- Comprehensive task overview across patients
- Batch task operations
- Task templates and recurring tasks

#### 5. **Location Monitor** [(/caregiver-location-monitor)]
- Real-time patient location tracking
- Geofence alerts
- Location history
- Safety zone management

### Caregiver Features

**Patient Management**:
- Add multiple patients via invite codes
- Monitor patient progress
- Receive alerts and notifications
- Track medication adherence
- Review patient activity logs

**Communication**:
- Send alerts to patients
- Real-time notifications
- Emergency contact integration

**Insights**:
- Patient progress analytics
- Task completion statistics
- Behavioral patterns
- Intervention recommendations

---

## Cognitive Patient User Flow

### Flow Summary
```
Onboarding → Emergency Contacts → Main App (5 Tabs)
```

### Main Navigation Structure

**Tab Layout** [Located in app/(tabs)/_layout.tsx]:

```
┌─────────────────────────────────────┐
│  Tasks  │  Nexa  │ Progress │ Wellness │ Settings  │
└─────────────────────────────────────┘
```

### 1. **Tasks Tab** [(/(tabs)/index)]
- Primary interface for cognitive patients
- AI-powered task breakdown
- Task completion tracking
- Reminder management

**Features**:
- Create new tasks
- Break down complex tasks into steps
- Set priorities
- Enable reminders
- View task history

### 2. **Nexa (AI Coach) Tab** [(/(tabs)/coach)]
- AI task coaching interface
- Step-by-step guidance
- Motivational support
- Adaptive difficulty

**Features**:
- Interactive task coaching
- Voice guidance
- Progress encouragement
- Cognitive load management

### 3. **Progress Tab** [(/(tabs)/progress)]
- Achievement tracking
- Streak visualization
- Progress analytics
- Motivational insights

**Features**:
- Daily completion streaks
- Weekly/monthly summaries
- Achievement badges
- Progress charts

### 4. **Wellness Tab** [(/(tabs)/wellness)]
- Mental health tools
- Breathing exercises
- Meditation library
- Finger trace exercises

**Wellness Activities**:
- Breathing exercises with visual guidance
- Guided meditation sessions
- Stress management tools
- Mindfulness practices

### 5. **Settings Tab** [(/(tabs)/settings)]
- Profile management
- Notification preferences
- Accessibility controls
- Emergency contacts

**Settings Options**:
- Profile editing
- Theme customization
- Notification controls
- Data export
- Privacy settings

### Additional Cognitive Patient Screens

#### **Breathing Exercise** [(/breathing-exercise)]
- Visual breathing guide
- Timed inhale/exhale cycles
- Calming animations
- Session tracking

#### **Finger Trace Exercise** [(/finger-trace)]
- Interactive tracing patterns
- Stress reduction technique
- Visual feedback
- Calming colors and shapes

#### **Memory Exercise** [(/memory-exercise)]
- Cognitive training games
- Memory improvement activities
- Progress tracking

#### **Recommendations** [(/recommendations)]
- Personalized activity suggestions
- AI-generated recommendations
- Adaptive difficulty

---

## Memory Patient User Flow

### Flow Summary
```
Onboarding → Emergency Contacts → Simplified App (3 Tabs)
```

### Main Navigation Structure

**Simplified Tab Layout** for users with memory impairment:

```
┌────────────────────────────────┐
│  Home  │  Wellness  │  Settings  │
└────────────────────────────────┘
```

### 1. **Home Tab (Dementia Support)** [(/(tabs)/dementia-support)]
- Memory-focused dashboard
- Daily orientation
- Emergency contacts
- Medication reminders

**Key Features**:

#### **Daily Orientation Card**
- Current day and date
- Current time
- Simple, clear display
- Large, readable text

#### **AI Memory Prompts** (Premium)
- Personalized memory triggers
- Time-of-day contextual prompts
- Gentle reminders
- Photo-based memory aids

#### **Emergency Contact Button**
- Large, prominent "Call [Primary Contact]" button
- One-tap emergency calling
- Photo-based contact recognition

#### **Upcoming Medications**
- Visual medication reminders
- Time-based alerts
- Dosage information
- Photo references

#### **Daily Routine Anchors**
- Scheduled activities
- Familiar routines
- Time-based structure
- Visual cues

#### **Emergency Contacts Section**
- Photo-based contact cards
- Large, clear photos
- Relationship labels
- One-tap calling
- Easy recognition

#### **Memory Journal**
- Photo-based entries
- Simple journaling
- Memory preservation
- Family sharing

### 2. **Wellness Tab** [(/(tabs)/wellness)]
- Simplified wellness activities
- Adapted for memory impairment
- Visual-focused exercises

### 3. **Settings Tab** [(/(tabs)/settings)]
- Simplified settings interface
- Large buttons and text
- Essential options only

### Memory Patient Specific Screens

#### **Memory Journal** [(/memory-journal)]
- Photo-based entries
- Simple text notes
- Date stamping
- Family sharing capability

#### **Emergency Contacts** [(/emergency-contacts)]
- Manage contact list
- Add/edit contacts with photos
- Set primary contact
- Test calling

#### **Patient Location** [(/patient-location)]
- Share location with caregivers
- Geofence setup
- Safety zone configuration
- Location history

### Memory Support Features

**Setup Screen** (When memory support disabled):
- Clear explanation of features
- Setup button
- Feature list:
  - Daily orientation reminders
  - Photo-based emergency contacts
  - Medication reminders with visuals
  - Memory journal with photos
  - Daily routine anchors
  - Repetitive question support
  - Location safety features

**Enabled Features**:
- Automatic orientation updates (every minute)
- Large, clear text and buttons
- Photo-based interfaces
- Simplified navigation
- Repetitive information tolerance
- Emergency contact quick access

---

## Premium Features & Subscription

### Free Features (Patients)
- Basic task management (cognitive)
- Emergency contacts (all patients)
- Daily orientation (memory)
- Basic wellness exercises
- Emergency calling

### Premium Features (RevenueCat)

#### **Cognitive Patients**:
- Advanced AI task coaching
- Unlimited task breakdown
- Advanced progress analytics
- Premium wellness content
- Data export

#### **Memory Patients**:
- AI memory prompts
- Advanced medication reminders
- Photo memory journal (unlimited)
- Family sharing features
- Advanced location tracking

#### **Caregivers**:
- All features require subscription
- Patient management (unlimited patients)
- Location monitoring
- Real-time alerts
- Analytics dashboard
- Task management tools

---

## Navigation Decision Logic

### Role-Based Routing [Located in app/(tabs)/_layout.tsx]

```typescript
// Routing decision tree
if (profile.role === 'caregiver') {
  return <Redirect href="/caregiver-dashboard" />;
}

const isCognitivePatient = profile.role === 'patient' && profile.patientType === 'cognitive';
const isMemoryPatient = profile.role === 'patient' && profile.patientType === 'memory';

if (isCognitivePatient) {
  // Show 5-tab layout: Tasks, Nexa, Progress, Wellness, Settings
  return <CognitiveTabs />;
}

if (isMemoryPatient) {
  // Show 3-tab layout: Home (dementia-support), Wellness, Settings
  return <MemoryTabs />;
}
```

### Subscription Gating

```typescript
// Caregiver access check
if (profile.role === 'caregiver' && !isSubscribed) {
  return <Redirect href="/paywall" />;
}

// Premium feature check
if (isPremium || canAccessFeature('aiCoaching')) {
  // Show premium features
}
```

---

## User Journey Diagrams

### Caregiver Journey
```
App Launch
    ↓
Terms Agreement
    ↓
Onboarding
    ├─ Step 0: Select "Caregiver"
    ├─ (Skip Step 1: Patient Type)
    ├─ Step 2: Enter Name
    ├─ (Skip Step 3: Emergency Contacts)
    └─ Step 4: Completion
    ↓
Paywall (REQUIRED)
    ↓
Subscribe
    ↓
Caregiver Hub
    ├─ Add Patients (via invite codes)
    ├─ Monitor Patient Tasks
    ├─ Track Patient Locations
    ├─ Receive Alerts
    └─ View Analytics
```

### Cognitive Patient Journey
```
App Launch
    ↓
Terms Agreement
    ↓
Onboarding
    ├─ Step 0: Select "Patient"
    ├─ Step 1: Select "Cognitive Disorders"
    ├─ Step 2: Enter Name
    ├─ Step 3: Add Emergency Contacts (optional)
    └─ Step 4: Completion
    ↓
Main App (5 Tabs)
    ├─ Tasks: Create and manage tasks
    ├─ Nexa: AI coaching
    ├─ Progress: Track achievements
    ├─ Wellness: Mental health tools
    └─ Settings: Preferences
    ↓
Optional: Premium Subscription
    └─ Unlock advanced AI features
```

### Memory Patient Journey
```
App Launch
    ↓
Terms Agreement
    ↓
Onboarding
    ├─ Step 0: Select "Patient"
    ├─ Step 1: Select "Memory Support"
    ├─ Step 2: Enter Name
    ├─ Step 3: Add Emergency Contacts (recommended)
    └─ Step 4: Completion
    ↓
Main App (3 Tabs - Simplified)
    ├─ Home: Orientation + Emergency contacts
    ├─ Wellness: Simplified exercises
    └─ Settings: Essential options
    ↓
Enable Memory Support in Settings (if not enabled)
    ├─ Daily orientation
    ├─ Emergency contacts with photos
    ├─ Medication reminders
    ├─ Memory journal
    └─ Location safety
    ↓
Optional: Premium Subscription
    └─ Unlock AI memory prompts
```

---

## Key Interaction Patterns

### Emergency Functionality
- **Memory Patients**: Large emergency call button on home screen
- **All Patients**: Emergency contacts accessible from settings
- **Caregivers**: Receive emergency alerts from patients

### Location Tracking
- **Patients**: Share location with caregivers (opt-in)
- **Caregivers**: Monitor patient locations with geofences
- **Safety**: Location alerts when leaving safe zones

### Task Management
- **Cognitive Patients**: Full task creation and AI breakdown
- **Caregivers**: Create tasks for patients, monitor completion
- **Memory Patients**: Routine anchors instead of complex tasks

### Notifications
- **Medication Reminders**: Visual and audio for memory patients
- **Task Reminders**: Configurable for cognitive patients
- **Caregiver Alerts**: Real-time patient status changes

---

## Accessibility Features

### For Memory Patients
- Large text (minimum 20pt)
- High contrast colors
- Photo-based interfaces
- Simplified navigation (3 tabs vs 5)
- Repetitive information support
- One-tap actions for critical functions

### For Cognitive Patients
- AI task breakdown
- Step-by-step guidance
- Visual progress indicators
- Customizable reminders
- Flexible task organization

### Universal
- Voice guidance support
- Haptic feedback
- Dark mode
- Font size controls
- Color blind modes

---

## Data Flow & Synchronization

### Local-First Architecture
- All data stored locally in Core Data
- CloudKit sync for cross-device access
- Offline-first functionality
- Background sync when online

### Caregiver-Patient Sync
- Real-time location sharing
- Task status updates
- Alert notifications
- Supabase backend for caregiver features

---

## Summary

NeuroNexa provides **three distinct user experiences** optimized for different cognitive needs:

1. **Caregivers**: Professional dashboard with patient monitoring, analytics, and intervention tools (subscription required)

2. **Cognitive Patients**: Full-featured task management with AI coaching for ADHD and executive function support (free with premium upgrades)

3. **Memory Patients**: Simplified, photo-based interface focused on orientation, safety, and daily routines (free with premium AI support)

Each flow is carefully designed to match the cognitive abilities and support needs of its user type, ensuring the right balance of functionality, simplicity, and safety.
