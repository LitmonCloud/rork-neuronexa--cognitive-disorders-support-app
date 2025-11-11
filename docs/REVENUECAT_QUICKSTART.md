# RevenueCat Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Product Configuration (RevenueCat Dashboard)

1. Go to https://app.revenuecat.com/
2. Navigate to your project → **Products**
3. Click **+ New** to create products:

   **Product 1: Monthly Subscription**
   - Product ID: `premium_monthly`
   - Type: Auto-renewable subscription
   - Price: $9.99/month
   
   **Product 2: Annual Subscription**
   - Product ID: `premium_annual`
   - Type: Auto-renewable subscription
   - Price: $79.99/year

4. Create an **Entitlement** called `premium`
5. Attach both products to the `premium` entitlement
6. Create an **Offering** called "default" and set it as **Current**
7. Add both packages to the offering:
   - Monthly package
   - Annual package

### 2. App Store Configuration

#### iOS (App Store Connect)

1. Create matching products in App Store Connect
2. Product IDs must match: `premium_monthly` and `premium_annual`
3. Submit for review with your app

#### Android (Google Play Console)

1. Create matching products in Google Play Console
2. Product IDs must match: `premium_monthly` and `premium_annual`
3. Publish products

### 3. Test in Your App

```typescript
// Navigate to paywall
import { router } from 'expo-router';

router.push('/paywall-revenuecat');
```

That's it! Your subscription system is ready to test.

---

## 💡 Common Use Cases

### Show Paywall for Premium Feature

```typescript
import { useSubscription } from '@/contexts/SubscriptionContext';
import { router } from 'expo-router';

function MyComponent() {
  const { canAccessFeature } = useSubscription();
  
  const handlePremiumAction = () => {
    if (!canAccessFeature('aiMemoryJournal')) {
      router.push('/paywall-revenuecat');
      return;
    }
    // Do premium action
  };
}
```

### Check Premium Status

```typescript
const { isPremium } = useSubscription();

if (isPremium) {
  // Show premium UI
}
```

### Show Customer Center

```typescript
import { router } from 'expo-router';

// In settings screen
router.push('/customer-center');
```

---

## 🧪 Testing

### iOS Sandbox Testing

1. **Create Sandbox Account**:
   - App Store Connect → Users & Access → Sandbox Testers
   - Create new tester

2. **Test on Device**:
   - Sign out of App Store
   - Run app
   - Try to purchase
   - Sign in with sandbox account

### Android Testing

1. **Add Test Account**:
   - Google Play Console → Setup → License testing
   - Add your Gmail account

2. **Test**:
   - Install app from internal test track
   - Attempt purchase
   - It will be free for test accounts

---

## 📱 Key Screens

### Paywall (`/paywall-revenuecat`)
- Displays available subscription packages
- Handles purchases
- Shows pricing and benefits
- Restore purchases option

### Customer Center (`/customer-center`)
- View subscription status
- Manage subscription
- Restore purchases
- View account info

---

## 🔧 Configuration Files

### RevenueCat Service
`services/subscriptions/RevenueCatService.ts`
- Core SDK wrapper
- All RevenueCat methods

### Subscription Context
`contexts/SubscriptionContext.tsx`
- React context with hooks
- Automatic sync with RevenueCat
- Feature gating logic

### API Key Location
`services/subscriptions/RevenueCatService.ts:10`

```typescript
const API_KEY = 'test_UuEBbaCMjdjrwVUWDdquJcjAmkw'; // Replace with production key
```

---

## ⚠️ Before Production

- [ ] Create products in RevenueCat Dashboard
- [ ] Link iOS products (App Store Connect)
- [ ] Link Android products (Google Play Console)
- [ ] Replace TEST API key with PRODUCTION key
- [ ] Test all purchase flows
- [ ] Test restore purchases
- [ ] Submit IAP for review with app

---

## 📊 Monitoring

### RevenueCat Dashboard
- View revenue metrics
- Track active subscriptions
- Monitor churn
- See customer lifetime value

Access: https://app.revenuecat.com/

---

## 🆘 Troubleshooting

### "No products available"
- Wait 15-30 minutes after creating products
- Check offering is set as "current"
- Verify products are linked in RevenueCat

### "Purchase failed"
- Using correct sandbox account?
- Product IDs match exactly?
- Check RevenueCat Dashboard logs

### "Restore finds nothing"
- Using same Apple ID / Google account?
- Previous purchase was successful?
- Check RevenueCat customer history

---

## 📚 Full Documentation

For complete details, see: `docs/REVENUECAT_INTEGRATION.md`

---

## 🎯 Next Steps

1. **Now**: Test with sandbox accounts
2. **Before Launch**: Configure real products
3. **After Launch**: Monitor RevenueCat Dashboard

**Questions?** Check the full integration guide or RevenueCat docs.
