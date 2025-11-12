# RevenueCat IAP Setup Guide

**Status**: ✅ SDK Integrated | ⚠️ Needs Production Configuration

## Overview

RevenueCat is **already fully integrated** into NeuroNexa. The SDK, subscription context, and paywall UI are all implemented. You just need to add your production API keys and configure products in the RevenueCat dashboard.

---

## Step 1: RevenueCat Account Setup

### 1.1 Create Account
1. Go to https://app.revenuecat.com/signup
2. Sign up with your email
3. Verify your email address

### 1.2 Create Project
1. Click **"Create new project"**
2. **Project name**: NeuroNexa
3. **Platform**: iOS + Android (cross-platform)
4. Click **"Create"**

---

## Step 2: App Configuration

### 2.1 iOS App Setup
1. In RevenueCat dashboard, go to **Apps**
2. Click **"+ New"** → **iOS**
3. Enter details:
   - **App name**: NeuroNexa iOS
   - **Bundle ID**: `com.litmoncloud.neuronexa` (check app.json)
   - **App Store ID**: (Leave blank until App Store Connect is set up)
4. Click **"Save"**
5. Copy the **iOS Public SDK Key** → Add to `.env` as `EXPO_PUBLIC_RC_IOS_API_KEY`

### 2.2 Android App Setup
1. Click **"+ New"** → **Android**
2. Enter details:
   - **App name**: NeuroNexa Android
   - **Package name**: `com.litmoncloud.neuronexa` (check app.json)
3. Click **"Save"**
4. Copy the **Android Public SDK Key** → Add to `.env` as `EXPO_PUBLIC_RC_ANDROID_API_KEY`

---

## Step 3: Product Configuration

### 3.1 Create Entitlement
1. Go to **Entitlements** in RevenueCat
2. Click **"+ New"**
3. **Identifier**: `premium` (⚠️ **IMPORTANT**: Must be exactly "premium")
4. **Display name**: Premium Access
5. Click **"Save"**

### 3.2 Create Products

#### Monthly Subscription
1. Go to **Products** → **"+ New"**
2. Select **iOS App**: NeuroNexa iOS
3. Configure:
   - **Product ID**: `neuronexa_premium_monthly` (must match App Store Connect)
   - **Display name**: Premium Monthly
   - **Price**: $9.99/month
   - **Subscription duration**: 1 month
   - **Free trial**: 7 days (optional)
4. Attach to entitlement: `premium`
5. Click **"Save"**
6. Repeat for **Android App** with same product ID

#### Annual Subscription
1. Go to **Products** → **"+ New"**
2. Configure:
   - **Product ID**: `neuronexa_premium_annual`
   - **Display name**: Premium Annual
   - **Price**: $59.99/year
   - **Subscription duration**: 1 year
   - **Free trial**: 7 days (optional)
3. Attach to entitlement: `premium`
4. Click **"Save"**
5. Repeat for Android

#### Lifetime Purchase
1. Go to **Products** → **"+ New"**
2. Configure:
   - **Product ID**: `neuronexa_premium_lifetime`
   - **Display name**: Premium Lifetime
   - **Type**: Non-consumable
   - **Price**: $149.99
3. Attach to entitlement: `premium`
4. Click **"Save"**
5. Repeat for Android

---

## Step 4: Offering Configuration

### 4.1 Create Default Offering
1. Go to **Offerings** in RevenueCat
2. Click **"+ New Offering"**
3. Configure:
   - **Identifier**: `default` (⚠️ **IMPORTANT**: Must be "default")
   - **Display name**: Default Offering
4. Click **"Save"**

### 4.2 Add Packages
1. Click on **"default" offering**
2. Add packages:
   - **Package 1**:
     - **Identifier**: `monthly`
     - **Package type**: Monthly
     - **Product**: `neuronexa_premium_monthly`
   - **Package 2**:
     - **Identifier**: `annual`
     - **Package type**: Annual
     - **Product**: `neuronexa_premium_annual`
   - **Package 3**:
     - **Identifier**: `lifetime`
     - **Package type**: Lifetime
     - **Product**: `neuronexa_premium_lifetime`
3. Click **"Save"**

### 4.3 Set as Current Offering
1. Click **"Make current"** on the default offering
2. Confirm

---

## Step 5: App Store Connect Setup (iOS)

### 5.1 Create In-App Purchases
1. Go to https://appstoreconnect.apple.com
2. Navigate to **My Apps** → **NeuroNexa** → **In-App Purchases**
3. Click **"+"** to create products

#### Monthly Subscription
- **Type**: Auto-Renewable Subscription
- **Reference Name**: Premium Monthly
- **Product ID**: `neuronexa_premium_monthly` (must match RevenueCat)
- **Subscription Group**: Premium Subscriptions
- **Subscription Duration**: 1 Month
- **Price**: $9.99 (Tier 10)
- **Free Trial**: 7 days (optional)

#### Annual Subscription
- **Type**: Auto-Renewable Subscription
- **Reference Name**: Premium Annual
- **Product ID**: `neuronexa_premium_annual`
- **Subscription Group**: Premium Subscriptions
- **Subscription Duration**: 1 Year
- **Price**: $59.99
- **Free Trial**: 7 days (optional)

#### Lifetime Purchase
- **Type**: Non-Consumable
- **Reference Name**: Premium Lifetime
- **Product ID**: `neuronexa_premium_lifetime`
- **Price**: $149.99

### 5.2 Subscription Metadata
1. Add localized descriptions
2. Add promotional images (required for featured placements)
3. Configure subscription benefits
4. Set up subscription management URL: `https://neuronexa.app/manage-subscription`

---

## Step 6: Google Play Console Setup (Android)

### 6.1 Create In-App Products
1. Go to https://play.google.com/console
2. Navigate to **NeuroNexa** → **Monetize** → **In-app products**
3. Click **"Create product"**

#### Monthly Subscription
- **Product ID**: `neuronexa_premium_monthly`
- **Name**: Premium Monthly
- **Description**: Full access to premium features
- **Status**: Active
- **Price**: $9.99
- **Billing period**: 1 month
- **Free trial period**: 7 days (optional)

#### Annual Subscription
- **Product ID**: `neuronexa_premium_annual`
- **Name**: Premium Annual
- **Description**: Full access to premium features (save 50%!)
- **Status**: Active
- **Price**: $59.99
- **Billing period**: 1 year
- **Free trial period**: 7 days (optional)

#### Lifetime Purchase
- **Product ID**: `neuronexa_premium_lifetime`
- **Name**: Premium Lifetime
- **Description**: One-time purchase for lifetime access
- **Status**: Active
- **Price**: $149.99

---

## Step 7: Environment Configuration

Update `.env` file with your API keys:

```bash
# RevenueCat API Keys (from Step 2)
EXPO_PUBLIC_RC_IOS_API_KEY=appl_xxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_xxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANT**: Add `.env` to `.gitignore` to prevent committing secrets!

---

## Step 8: Testing

### 8.1 Sandbox Testing (iOS)
1. Create a sandbox tester in App Store Connect:
   - Go to **Users and Access** → **Sandbox Testers**
   - Click **"+"** → Add test Apple ID
2. Sign out of App Store on your device
3. Run the app with EAS custom development build
4. Navigate to paywall
5. Attempt purchase → Sign in with sandbox tester when prompted
6. Verify subscription activates in app

### 8.2 Test Accounts (Android)
1. Add test Gmail accounts in Google Play Console:
   - Go to **Setup** → **License testing**
   - Add test accounts
2. Run app on device signed in with test account
3. Navigate to paywall
4. Attempt purchase → Should complete without charging
5. Verify subscription activates

### 8.3 Verification Checklist
- [ ] SDK initializes without errors
- [ ] Offerings load successfully
- [ ] Products display with correct prices
- [ ] Monthly subscription purchase works
- [ ] Annual subscription purchase works
- [ ] Lifetime purchase works
- [ ] Subscription status syncs correctly
- [ ] Premium features unlock after purchase
- [ ] Restore purchases works
- [ ] Trial period displays correctly (if enabled)

---

## Step 9: RevenueCat Dashboard Configuration

### 9.1 Webhooks (Optional)
Set up webhooks for backend integration:
1. Go to **Integrations** → **Webhooks**
2. Add webhook URL: `https://api.neuronexa.app/webhooks/revenuecat`
3. Select events:
   - Initial purchase
   - Renewal
   - Cancellation
   - Billing issue
   - Refund
4. Save

### 9.2 Customer Attributes
Configure custom attributes for analytics:
1. Go to **Customer Lists** → **Attributes**
2. Add:
   - `user_role` (patient/caregiver)
   - `patient_type` (cognitive/memory)
   - `device_type` (iOS/Android)

### 9.3 Charts & Analytics
Enable built-in analytics:
1. Go to **Charts**
2. Monitor:
   - Active subscriptions
   - MRR (Monthly Recurring Revenue)
   - Churn rate
   - Trial conversion rate

---

## Implementation Status

### ✅ Already Implemented
- [x] RevenueCat SDK installed (`react-native-purchases`)
- [x] RevenueCatService.ts (complete service layer)
- [x] SubscriptionContext.tsx (state management)
- [x] Paywall UI (`app/paywall-revenuecat.tsx`)
- [x] Premium feature gates
- [x] Restore purchases flow
- [x] Customer info syncing
- [x] Real-time subscription updates
- [x] Trial eligibility checking
- [x] Platform-specific API key handling

### ⚠️ Needs Configuration
- [ ] Add production RevenueCat API keys to `.env`
- [ ] Create products in RevenueCat dashboard
- [ ] Create IAP products in App Store Connect
- [ ] Create IAP products in Google Play Console
- [ ] Configure default offering
- [ ] Test sandbox purchases
- [ ] Set up webhooks (optional)

---

## Revenue Model

### Pricing Tiers
| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 tasks/day, basic features |
| **Monthly** | $9.99/mo | Unlimited tasks, AI coach, analytics |
| **Annual** | $59.99/yr | Save 50%! (~$5/mo) |
| **Lifetime** | $149.99 | One-time, never pay again |

### Revenue Projections (Year 1)
- **Target users**: 10,000 active users
- **Conversion rate**: 15% (1,500 premium)
- **Split**: 60% monthly, 30% annual, 10% lifetime
- **Monthly revenue**:
  - Monthly subs: 900 × $9.99 = $8,991
  - Annual subs: 450 × $59.99/12 = $2,250
  - Lifetime: 150 × $149.99 (one-time) = $22,499 first month
- **Estimated MRR**: ~$11k-13k after ramp-up

---

## Troubleshooting

### Issue: "No offerings available"
**Solution**:
1. Verify API keys are correct
2. Check products are attached to `premium` entitlement
3. Verify offering is marked as "current"
4. Check RevenueCat dashboard for errors

### Issue: "Purchase failed"
**Solution**:
1. Verify sandbox tester is signed in (iOS)
2. Check Google Play license testing (Android)
3. Verify product IDs match exactly
4. Check RevenueCat logs in dashboard

### Issue: "Subscription not syncing"
**Solution**:
1. Check `revenueCatService.initialize()` is called
2. Verify customer info update listener is active
3. Check RevenueCat dashboard for user status
4. Call `restorePurchases()` manually

---

## Next Steps

1. **Complete Step 1-2**: Set up RevenueCat account + apps
2. **Complete Step 3-4**: Configure products + offerings
3. **Complete Step 5-6**: Set up App Store Connect + Google Play
4. **Complete Step 7**: Add API keys to `.env`
5. **Complete Step 8**: Test sandbox purchases
6. **Move to Day 3**: PostHog Analytics Integration

---

## Support Resources

- **RevenueCat Docs**: https://docs.revenuecat.com
- **React Native SDK**: https://docs.revenuecat.com/docs/reactnative
- **App Store Connect**: https://developer.apple.com/app-store-connect/
- **Google Play Console**: https://play.google.com/console
- **RevenueCat Support**: support@revenuecat.com

---

**Last Updated**: 2025-11-12
**Status**: Ready for production configuration
