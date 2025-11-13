# Caregiver Subscription Implementation

## Overview
This document outlines the implementation of mandatory subscription requirements for caregivers in the Nexa app.

## Key Changes

### 1. Subscription Context (`contexts/SubscriptionContext.tsx`)

#### Added Features:
- **`loadUserRole()`**: New function to load user role from AsyncStorage
- **`roleQuery`**: React Query hook to fetch and cache user role
- **`requiresSubscription`**: New computed value that returns `true` for caregivers without premium subscription
- **Trial Restrictions**: Caregivers are now excluded from free trials

#### Modified Logic:
```typescript
const isInTrial = useMemo(() => {
  const userRole = roleQuery.data;
  if (userRole === 'caregiver') return false; // Caregivers don't get trials
  if (!subscription.trialEndDate || subscription.trialUsed) return false;
  return new Date(subscription.trialEndDate) > new Date();
}, [subscription.trialEndDate, subscription.trialUsed, roleQuery.data]);

const requiresSubscription = useMemo(() => {
  const userRole = roleQuery.data;
  if (userRole === 'caregiver') {
    return !isPremium; // Caregivers must have premium
  }
  return false;
}, [roleQuery.data, isPremium]);
```

### 2. Onboarding Flow (`app/onboarding.tsx`)

#### Changes:
- **Caregiver Skip Emergency Contacts**: Caregivers skip the emergency contacts step (step 3)
- **Direct to Paywall**: After role selection, caregivers are immediately redirected to the paywall
- **No Free Access**: Caregivers cannot access the app without subscribing

#### Flow:
1. Name entry (Step 1)
2. Role selection (Step 2)
   - If **Patient**: Continue to emergency contacts → Complete onboarding → Access app with 7-day trial
   - If **Caregiver**: Skip to paywall → Must subscribe → Access app after payment

### 3. Paywall Screen (`app/paywall.tsx`)

#### Caregiver-Specific UI:
- **No Close Button**: Caregivers cannot dismiss the paywall
- **Custom Messaging**:
  - Title: "Subscribe to Continue"
  - Subtitle: "Caregiver features require a premium subscription"
  - Button: "Subscribe Now"
  - Disclaimer: "Subscription required for caregiver features"
- **Post-Subscription**: After subscribing, caregivers are redirected to the main app

#### Patient UI (Unchanged):
- Close button available
- 7-day free trial messaging
- Can dismiss and use free features

### 4. Root Layout Navigation (`app/_layout.tsx`)

#### Added Logic:
- **Subscription Check**: Added `requiresSubscription` to navigation logic
- **Caregiver Redirect**: Caregivers without subscription are automatically redirected to paywall
- **Persistent Enforcement**: Subscription requirement is checked on every navigation

#### Navigation Flow:
```typescript
if (termsAccepted && onboardingCompleted && isCaregiver && requiresSubscription && !inPaywall) {
  console.log('[RootLayout] Caregiver requires subscription, redirecting to paywall');
  router.replace('/paywall');
}
```

## User Flows

### Patient Flow:
1. Accept terms
2. Complete onboarding (name, role, emergency contacts)
3. Access app with 7-day free trial
4. Optional: Upgrade to premium for unlimited features

### Caregiver Flow:
1. Accept terms
2. Complete onboarding (name, role only)
3. **Mandatory**: Subscribe to premium (no trial)
4. Access caregiver features after payment

## Emergency Contacts

### Patient:
- **Can add** emergency contacts during onboarding
- **Can manage** their own emergency contacts in settings
- Emergency contacts are stored in their profile

### Caregiver:
- **Cannot add** emergency contacts during onboarding (step is skipped)
- **Can view** patient emergency contacts from the caregiver dashboard
- **Can manage** patient emergency contacts on behalf of patients
- Access via: Patient card → Phone icon → Emergency contacts screen

## Subscription Tiers

### Free (Patients Only):
- Up to 5 tasks
- 3 new tasks per day
- AI task breakdown
- Basic wellness exercises
- 7-day trial available

### Premium (Required for Caregivers):
- Unlimited tasks
- Caregiver mode
- Advanced analytics
- Custom reminders
- Priority support
- Offline mode
- Export data
- Premium wellness content

## Technical Implementation

### Context Dependencies:
- `SubscriptionContext` now depends on `UserProfileContext` for role information
- Role is loaded asynchronously and cached via React Query
- Navigation logic waits for both subscription and profile data to load

### State Management:
- User role is stored in AsyncStorage under `@nexa_user_profile`
- Subscription status is stored under `@nexa_subscription`
- Both are loaded on app initialization and cached

### Error Handling:
- If role cannot be loaded, defaults to `undefined`
- If subscription cannot be loaded, defaults to `free` tier
- Loading states are properly handled to prevent navigation loops

## Testing Checklist

- [ ] Patient can complete onboarding with emergency contacts
- [ ] Patient receives 7-day free trial
- [ ] Caregiver skips emergency contacts step
- [ ] Caregiver is redirected to paywall after onboarding
- [ ] Caregiver cannot close paywall
- [ ] Caregiver can access app after subscribing
- [ ] Caregiver without subscription is redirected to paywall on app launch
- [ ] Caregiver can view patient emergency contacts
- [ ] Subscription status persists across app restarts

## Future Enhancements

1. **Payment Integration**: Connect to actual payment processor (Stripe, RevenueCat)
2. **Subscription Management**: Add ability to cancel/modify subscription
3. **Grace Period**: Add grace period for expired subscriptions
4. **Family Plans**: Allow caregivers to manage multiple patients under one subscription
5. **Promo Codes**: Add support for promotional codes and discounts
