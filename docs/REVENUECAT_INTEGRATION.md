# RevenueCat Integration Guide for Nexa

## Overview

This guide documents the complete RevenueCat SDK integration in your Nexa app, providing subscription management, in-app purchases, and customer support features.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Architecture](#architecture)
4. [Core Features](#core-features)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)
7. [Production Checklist](#production-checklist)

---

## Installation

### Packages Installed

```bash
npm install --save react-native-purchases
```

**Note**: `react-native-purchases-ui` is not available in Expo Go, so we've implemented custom UI components for paywalls and customer center.

### Dependencies

- `react-native-purchases`: ^8.0.0+
- `@tanstack/react-query`: For state management
- `expo-router`: For navigation

---

## Configuration

### API Key

Your RevenueCat API key is configured in `services/subscriptions/RevenueCatService.ts`:

```typescript
const API_KEY = 'test_UuEBbaCMjdjrwVUWDdquJcjAmkw';
```

⚠️ **Important**: This is a TEST API key. Replace with your production key before launch.

### Product Setup

**Current Status**: No products configured yet

To configure products:

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to "Products" section
3. Create products with these identifiers:
   - `premium_monthly` - Monthly subscription
   - `premium_annual` - Annual subscription
   - Entitlement: `premium`

### Entitlements

The app checks for a `premium` entitlement to unlock features:

```typescript
const hasPremiumEntitlement = customerInfo.entitlements.active['premium'] !== undefined;
```

---

## Architecture

### File Structure

```
services/
  subscriptions/
    RevenueCatService.ts          # Core RevenueCat SDK wrapper

contexts/
  SubscriptionContext.tsx          # React Context with RevenueCat integration

app/
  paywall-revenuecat.tsx           # RevenueCat-powered paywall screen
  customer-center.tsx              # Subscription management UI
```

### Service Layer: RevenueCatService

Located in `services/subscriptions/RevenueCatService.ts`

**Key Methods**:

```typescript
// Initialize SDK
await revenueCatService.initialize(userId?);

// Get available products
const offerings = await revenueCatService.getOfferings();

// Get customer info
const customerInfo = await revenueCatService.getCustomerInfo();

// Purchase a package
const result = await revenueCatService.purchasePackage(package);

// Restore purchases
const customerInfo = await revenueCatService.restorePurchases();

// Check premium status
const isPremium = revenueCatService.isPremium(customerInfo);

// Manage subscription
const url = await revenueCatService.getManagementURL();
```

### Context Layer: SubscriptionContext

Located in `contexts/SubscriptionContext.tsx`

**Features**:
- Automatic RevenueCat initialization on app start
- Real-time customer info updates via listeners
- Seamless integration with AsyncStorage for offline support
- React Query for data caching and synchronization

**Key Exports**:

```typescript
const {
  subscription,           // Current subscription state
  customerInfo,           // RevenueCat customer info
  isPremium,              // Boolean premium status
  isInTrial,              // Boolean trial status
  purchasePackage,        // Function to purchase
  restorePurchases,       // Function to restore
  canAccessFeature,       // Feature gate helper
  // ... more helpers
} = useSubscription();
```

---

## Core Features

### 1. Subscription Management

#### Purchasing

```typescript
import { useSubscription } from '@/contexts/SubscriptionContext';

function PaywallComponent() {
  const { purchasePackage } = useSubscription();
  
  const handlePurchase = async (pkg: PurchasesPackage) => {
    const success = await purchasePackage(pkg);
    if (success) {
      // Handle success
    }
  };
}
```

#### Restoring Purchases

```typescript
const { restorePurchases } = useSubscription();

const handleRestore = async () => {
  const success = await restorePurchases();
  if (success) {
    Alert.alert('Success', 'Purchases restored!');
  }
};
```

### 2. Feature Gating

```typescript
const { canAccessFeature, isPremium } = useSubscription();

// Check specific features
if (canAccessFeature('caregiverMode')) {
  // Show caregiver features
}

// Or check premium status directly
if (isPremium) {
  // Show all premium features
}
```

### 3. Customer Center

Navigate to subscription management:

```typescript
import { router } from 'expo-router';

router.push('/customer-center');
```

Features:
- View subscription status
- Manage subscription (opens App Store/Play Store)
- Restore purchases
- View account information

### 4. Paywall Display

Navigate to paywall:

```typescript
router.push('/paywall-revenuecat');
```

Features:
- Display available packages from RevenueCat
- Show pricing and benefits
- Handle trial offers
- Purchase flow
- Restore purchases option

---

## Usage Examples

### Basic Implementation

```typescript
import { useSubscription } from '@/contexts/SubscriptionContext';
import { router } from 'expo-router';

function FeatureScreen() {
  const { isPremium, canAccessFeature } = useSubscription();

  const handlePremiumFeature = () => {
    if (!canAccessFeature('aiMemoryJournal')) {
      // Show paywall
      router.push('/paywall-revenuecat');
      return;
    }
    
    // Access feature
    openMemoryJournal();
  };

  return (
    <View>
      <Button 
        title="Memory Journal"
        onPress={handlePremiumFeature}
      />
      {!isPremium && (
        <Text>Premium feature - Upgrade to unlock</Text>
      )}
    </View>
  );
}
```

### Listening to Subscription Changes

The context automatically listens for changes:

```typescript
useEffect(() => {
  // This will automatically update when subscription status changes
  console.log('Subscription status:', isPremium);
}, [isPremium]);
```

### User Identification

```typescript
// In your authentication flow
await revenueCatService.logIn(userId);

// On logout
await revenueCatService.logOut();
```

### Syncing User Attributes

```typescript
await revenueCatService.syncAttributesForUser({
  email: user.email,
  displayName: user.name,
  role: 'caregiver',
});
```

---

## Testing

### Test Mode

The current API key (`test_UuEBbaCMjdjrwVUWDdquJcjAmkw`) is in TEST mode:

✅ **Test Features**:
- Sandbox purchases (iOS Sandbox, Google Play test accounts)
- Free test purchases
- Instant subscription status changes
- Full RevenueCat Dashboard access

### Testing Purchases

#### iOS Sandbox Testing

1. Create a sandbox tester account in App Store Connect
2. Sign out of App Store on device
3. Run app and attempt purchase
4. Sign in with sandbox account when prompted

#### Android Testing

1. Add test account in Google Play Console
2. Ensure app is uploaded as internal test track
3. Install from Play Store
4. Test purchases

### Testing Scenarios

```typescript
// Test subscription purchase
const offerings = await revenueCatService.getOfferings();
const monthlyPackage = offerings?.current?.monthly;
if (monthlyPackage) {
  await purchasePackage(monthlyPackage);
}

// Test restore
await restorePurchases();

// Test premium status
const customerInfo = await revenueCatService.getCustomerInfo();
console.log('Is Premium:', revenueCatService.isPremium(customerInfo));
```

---

## Production Checklist

### Before Launch

#### 1. Product Configuration

- [ ] Create products in RevenueCat Dashboard
- [ ] Set up iOS products in App Store Connect
- [ ] Set up Android products in Google Play Console
- [ ] Link products in RevenueCat
- [ ] Create "premium" entitlement
- [ ] Test products in sandbox

#### 2. API Keys

- [ ] Generate production API keys
- [ ] Replace test key with production key in `RevenueCatService.ts`
- [ ] Verify iOS and Android SDK keys separately (if needed)

#### 3. App Store Configuration

##### iOS (App Store Connect)

- [ ] Configure in-app purchases
- [ ] Set up subscription groups
- [ ] Add localizations
- [ ] Set pricing for all regions
- [ ] Submit for review

##### Android (Google Play Console)

- [ ] Create subscription products
- [ ] Set up billing
- [ ] Configure pricing
- [ ] Add subscriptions to app

#### 4. RevenueCat Dashboard

- [ ] Set up webhooks for backend integration
- [ ] Configure customer lists
- [ ] Set up charts and analytics
- [ ] Configure integrations (analytics, attribution)
- [ ] Set up experiments (if needed)

#### 5. Legal & Compliance

- [ ] Add privacy policy for subscriptions
- [ ] Add terms of service
- [ ] Implement restore purchases button
- [ ] Add subscription management links
- [ ] Test all refund flows

#### 6. Testing

- [ ] Test successful purchase flow
- [ ] Test cancelled purchase flow
- [ ] Test restore purchases
- [ ] Test subscription renewal
- [ ] Test subscription cancellation
- [ ] Test trial period (if applicable)
- [ ] Test different subscription tiers
- [ ] Test on iOS Sandbox
- [ ] Test on Android test track
- [ ] Test offline scenarios

#### 7. User Experience

- [ ] Update paywall copy
- [ ] Add feature comparison
- [ ] Implement proper error messages
- [ ] Add loading states
- [ ] Test accessibility
- [ ] Verify all navigation flows

#### 8. Monitoring

- [ ] Set up revenue tracking
- [ ] Monitor subscription metrics
- [ ] Track conversion rates
- [ ] Monitor churn rate
- [ ] Set up alerts for issues

---

## Advanced Features

### Trial Management

```typescript
const isEligible = await revenueCatService.checkTrialEligibility('premium');
```

### Custom User Attributes

```typescript
await revenueCatService.syncAttributesForUser({
  email: 'user@example.com',
  displayName: 'John Doe',
  userType: 'patient',
  onboardingCompleted: 'true',
});
```

### Customer Info Listener

Automatically implemented in `SubscriptionContext`:

```typescript
useEffect(() => {
  const unsubscribe = revenueCatService.addCustomerInfoUpdateListener((info) => {
    console.log('Customer info updated:', info);
    // Automatically syncs with context
  });
  
  return unsubscribe;
}, []);
```

---

## Troubleshooting

### Common Issues

#### Issue: "No products available"

**Solution**:
1. Verify products are created in RevenueCat Dashboard
2. Check products are linked to iOS/Android
3. Ensure offering is set as "current" in RevenueCat
4. Wait 15-30 minutes for Apple/Google sync

#### Issue: "Purchase failed"

**Solution**:
1. Check sandbox account is configured correctly
2. Verify product IDs match exactly
3. Check RevenueCat Dashboard for error logs
4. Review console logs for specific errors

#### Issue: "Restore purchases finds nothing"

**Solution**:
1. Ensure previous purchase was successful
2. Using same Apple ID / Google account
3. Check RevenueCat customer ID is correct
4. Review RevenueCat Dashboard customer history

### Debug Logging

Enable debug logs:

```typescript
// Already enabled in RevenueCatService.ts
Purchases.setLogLevel(LOG_LEVEL.DEBUG);
```

Check logs for detailed information:
- iOS: Console app or Xcode console
- Android: Logcat
- RevenueCat: Dashboard → Customers → [Customer ID] → Event Log

---

## Support & Resources

### Documentation

- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [React Native SDK](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- [Expo Integration](https://www.revenuecat.com/docs/getting-started/installation/reactnative#expo)

### Dashboard

- [RevenueCat Dashboard](https://app.revenuecat.com/)

### Contact

For issues specific to this implementation:
1. Check console logs
2. Review RevenueCat Dashboard
3. Consult this documentation
4. Contact RevenueCat support if needed

---

## Next Steps

1. **Configure Products**: Set up your products in RevenueCat Dashboard
2. **Test Thoroughly**: Run through all purchase flows in sandbox
3. **Update API Key**: Switch to production key before launch
4. **Submit for Review**: Submit IAP for review with app
5. **Monitor**: Watch metrics in RevenueCat Dashboard after launch

---

## API Reference

### RevenueCatService Methods

```typescript
class RevenueCatService {
  // Initialize SDK with optional user ID
  initialize(userId?: string): Promise<void>
  
  // Fetch available offerings
  getOfferings(): Promise<PurchasesOfferings | null>
  
  // Get current customer info
  getCustomerInfo(): Promise<CustomerInfo | null>
  
  // Purchase a package
  purchasePackage(pkg: PurchasesPackage): Promise<{
    customerInfo: CustomerInfo;
    success: boolean;
  } | null>
  
  // Restore previous purchases
  restorePurchases(): Promise<CustomerInfo | null>
  
  // Check if user has premium
  isPremium(customerInfo: CustomerInfo): boolean
  
  // Log in user
  logIn(userId: string): Promise<{ customerInfo: CustomerInfo } | null>
  
  // Log out user
  logOut(): Promise<CustomerInfo | null>
  
  // Listen to customer info updates
  addCustomerInfoUpdateListener(
    listener: (info: CustomerInfo) => void
  ): () => void
  
  // Sync user attributes
  syncAttributesForUser(attributes: {
    email?: string;
    displayName?: string;
    [key: string]: string | undefined;
  }): Promise<void>
  
  // Get subscription management URL
  getManagementURL(): Promise<string | null>
  
  // Check trial eligibility
  checkTrialEligibility(productId: string): Promise<boolean>
}
```

### SubscriptionContext API

```typescript
interface SubscriptionContextValue {
  subscription: UserSubscription;
  usage: UsageStats;
  features: SubscriptionFeatures;
  isPremium: boolean;
  isInTrial: boolean;
  customerInfo: CustomerInfo | null;
  onboardingCompleted: boolean;
  requiresSubscription: boolean;
  
  canCreateTask: () => boolean;
  canAccessFeature: (feature: string) => boolean;
  incrementTaskUsage: () => void;
  incrementWellnessUsage: () => void;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  upgradeToPremium: (period: 'month' | 'year') => void;
  completeOnboarding: () => void;
  getRemainingTasks: () => number;
  
  isLoading: boolean;
}
```

---

**Last Updated**: 2025-01-11
**Version**: 1.0.0
**RevenueCat SDK**: 8.0.0+
