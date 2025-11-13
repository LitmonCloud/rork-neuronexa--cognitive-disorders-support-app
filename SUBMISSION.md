# Nexa — App Store Submission Guide

**Version:** 1.0.0  
**Last Updated:** 2025-10-02

This guide provides step-by-step instructions for submitting Nexa to the Apple App Store and Google Play Store.

---

## 📋 Pre-Submission Checklist

### Critical Requirements

- [ ] **Legal Documents Live**
  - [ ] Privacy Policy accessible at https://nexa.app/legal/privacy
  - [ ] Terms of Service accessible at https://nexa.app/legal/terms
  - [ ] Support page accessible at https://nexa.app/support

- [ ] **App Store Assets**
  - [ ] App icon (1024×1024, no alpha)
  - [ ] Screenshots for all required device sizes
  - [ ] App preview video (optional but recommended)

- [ ] **In-App Purchases Configured**
  - [ ] RevenueCat account created
  - [ ] Products created in App Store Connect / Google Play Console
  - [ ] Products linked in RevenueCat dashboard
  - [ ] Sandbox testing completed

- [ ] **Testing Complete**
  - [ ] TestFlight build distributed to internal testers
  - [ ] All core features tested on device
  - [ ] IAP purchase and restore tested
  - [ ] Accessibility features tested (VoiceOver/TalkBack)
  - [ ] No critical bugs or crashes

- [ ] **Compliance**
  - [ ] Medical disclaimer visible in app and store listing
  - [ ] Age rating questionnaire completed
  - [ ] Export compliance determined
  - [ ] Content rights verified

---

## 🍎 Apple App Store Submission

### Step 1: Prepare App Store Connect

1. **Create App Listing**
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Click "My Apps" → "+" → "New App"
   - Fill in:
     - Platform: iOS
     - Name: Nexa
     - Primary Language: English (U.S.)
     - Bundle ID: `app.rork.nexa-cognitive-disorders-support-ykokwhv`
     - SKU: `nexa-ios-001`

2. **App Information**
   - **Name:** Nexa
   - **Subtitle:** Cognitive support that adapts to you
   - **Category:** Health & Fitness (Primary), Productivity (Secondary)
   - **Content Rights:** Check "Yes" (you own all rights)

3. **Pricing and Availability**
   - **Price:** Free (with in-app purchases)
   - **Availability:** All countries
   - **Pre-Order:** No

### Step 2: Configure In-App Purchases

1. **Navigate to In-App Purchases**
   - In your app listing, go to "Features" → "In-App Purchases"

2. **Create Products**

   **Premium Monthly:**
   - Type: Auto-Renewable Subscription
   - Reference Name: Premium Monthly
   - Product ID: `nexa_premium_monthly`
   - Subscription Group: Premium Access
   - Subscription Duration: 1 Month
   - Price: $9.99 USD
   - Localized Description: "Unlock unlimited tasks, AI breakdowns, and advanced features"
   - Review Screenshot: Upload screenshot showing premium features

   **Premium Yearly:**
   - Type: Auto-Renewable Subscription
   - Reference Name: Premium Yearly
   - Product ID: `nexa_premium_yearly`
   - Subscription Group: Premium Access
   - Subscription Duration: 1 Year
   - Price: $59.99 USD
   - Localized Description: "Unlock unlimited tasks, AI breakdowns, and advanced features. Save 40%!"
   - Review Screenshot: Upload screenshot showing premium features

   **Lifetime Access:**
   - Type: Non-Consumable
   - Reference Name: Lifetime Access
   - Product ID: `nexa_lifetime`
   - Price: $149.99 USD
   - Localized Description: "One-time purchase for lifetime access to all premium features"
   - Review Screenshot: Upload screenshot showing premium features

3. **Configure Subscription Group**
   - Name: Premium Access
   - Subscription Group Display Name: Nexa Premium
   - Add both monthly and yearly subscriptions to this group

### Step 3: Link Products to RevenueCat

1. **Log in to RevenueCat Dashboard**
   - Go to [app.revenuecat.com](https://app.revenuecat.com/)

2. **Create Entitlement**
   - Navigate to "Entitlements"
   - Create entitlement: `premium`

3. **Add Products**
   - Go to "Products"
   - Add iOS products:
     - `nexa_premium_monthly` → Link to `premium` entitlement
     - `nexa_premium_yearly` → Link to `premium` entitlement
     - `nexa_lifetime` → Link to `premium` entitlement

4. **Get API Keys**
   - Go to "API Keys"
   - Copy "Apple App Store" key
   - Add to `.env`: `EXPO_PUBLIC_RC_API_KEY=<your_key>`

### Step 4: Upload Build via EAS

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build for iOS Production**
   ```bash
   eas build --platform ios --profile production
   ```

5. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

   Or manually:
   - Download the `.ipa` file from EAS dashboard
   - Use Transporter app to upload to App Store Connect

### Step 5: Complete App Store Listing

1. **App Store Information**
   - Copy content from `store/ios-metadata.md`
   - Paste into App Store Connect fields:
     - Description
     - Keywords
     - Support URL
     - Marketing URL
     - Privacy Policy URL

2. **Upload Screenshots**
   - iPhone 6.7" (Pro Max): 7 screenshots
   - iPhone 6.1" (Pro): 7 screenshots
   - iPad Pro 12.9": 7 screenshots (optional)

3. **Upload App Preview Video** (Optional)
   - 15-30 second video
   - Show key features: Nexa, tasks, breathing, accessibility

4. **App Review Information**
   - Contact: support@nexa.app
   - Phone: +1 (555) 123-4567
   - Demo Account: reviewer@nexa.app / ReviewAccess2025!
   - Notes: Copy from `store/ios-metadata.md` → "Notes for Reviewer"

5. **Version Information**
   - Version: 1.0.0
   - Copyright: © 2025 Nexa
   - What's New: Copy from `store/ios-metadata.md`

6. **Age Rating**
   - Complete questionnaire (see `store/ios-metadata.md`)
   - Expected rating: 4+

### Step 6: Submit for Review

1. **Final Checks**
   - [ ] All required fields filled
   - [ ] Screenshots uploaded
   - [ ] Build selected
   - [ ] IAP products configured
   - [ ] Legal URLs accessible

2. **Submit**
   - Click "Add for Review"
   - Click "Submit to App Review"

3. **Wait for Review**
   - Typical review time: 24-48 hours
   - Monitor status in App Store Connect
   - Respond promptly to any reviewer questions

---

## 🤖 Google Play Store Submission

### Step 1: Prepare Google Play Console

1. **Create App Listing**
   - Go to [Google Play Console](https://play.google.com/console/)
   - Click "Create app"
   - Fill in:
     - App name: Nexa
     - Default language: English (United States)
     - App or game: App
     - Free or paid: Free
     - Declarations: Check all required boxes

2. **Store Presence → Main Store Listing**
   - Copy content from `store/android-metadata.md`
   - Fill in:
     - Short description (80 chars)
     - Full description (4000 chars)
     - App icon (512×512)
     - Feature graphic (1024×500)
     - Phone screenshots (minimum 2)
     - Tablet screenshots (optional)

3. **Store Settings**
   - **Category:** Health & Fitness
   - **Tags:** ADHD, autism, cognitive support, task management, breathing, accessibility
   - **Contact details:**
     - Email: support@nexa.app
     - Website: https://nexa.app
     - Phone: +1 (555) 123-4567
   - **Privacy Policy:** https://nexa.app/legal/privacy

### Step 2: Configure In-App Products

1. **Navigate to Monetization → Products**

2. **Create Subscriptions**

   **Premium Monthly:**
   - Product ID: `nexa_premium_monthly`
   - Name: Premium Monthly
   - Description: "Unlock unlimited tasks, AI breakdowns, and advanced features"
   - Billing period: 1 month
   - Price: $9.99 USD
   - Free trial: 7 days

   **Premium Yearly:**
   - Product ID: `nexa_premium_yearly`
   - Name: Premium Yearly
   - Description: "Unlock unlimited tasks, AI breakdowns, and advanced features. Save 40%!"
   - Billing period: 1 year
   - Price: $59.99 USD
   - Free trial: 7 days

3. **Create In-App Product**

   **Lifetime Access:**
   - Product ID: `nexa_lifetime`
   - Name: Lifetime Access
   - Description: "One-time purchase for lifetime access to all premium features"
   - Price: $149.99 USD

### Step 3: Link Products to RevenueCat

1. **Add Android Products in RevenueCat**
   - Go to RevenueCat Dashboard → "Products"
   - Add Google Play products:
     - `nexa_premium_monthly` → Link to `premium` entitlement
     - `nexa_premium_yearly` → Link to `premium` entitlement
     - `nexa_lifetime` → Link to `premium` entitlement

2. **Configure Google Play Service Credentials**
   - Follow RevenueCat's guide to link Google Play
   - Upload service account JSON

### Step 4: Upload Build via EAS

1. **Build for Android Production**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Google Play**
   ```bash
   eas submit --platform android
   ```

   Or manually:
   - Download the `.aab` file from EAS dashboard
   - Upload to Google Play Console → "Release" → "Production"

### Step 5: Complete Content Rating

1. **Navigate to Content Rating**
   - Answer questionnaire honestly
   - Key answers:
     - Violence: No
     - Sexual content: No
     - Profanity: No
     - Drugs: No (mental health resources only)
     - Gambling: No
     - User interaction: No
   - Expected rating: Everyone

### Step 6: Complete Data Safety

1. **Navigate to Data Safety**
   - Answer questions about data collection
   - Key points:
     - No personal data collected by default
     - All data stored locally
     - Optional cloud sync (future)
     - No data sold to third parties
     - No data used for advertising

2. **Privacy Policy**
   - Link: https://nexa.app/legal/privacy

### Step 7: Submit for Review

1. **Create Release**
   - Go to "Release" → "Production"
   - Click "Create new release"
   - Upload `.aab` file
   - Release name: 1.0.0
   - Release notes: Copy from `store/android-metadata.md`

2. **Review and Rollout**
   - Review all sections (green checkmarks)
   - Click "Review release"
   - Click "Start rollout to Production"

3. **Wait for Review**
   - Typical review time: 1-7 days
   - Monitor status in Google Play Console
   - Respond promptly to any reviewer questions

---

## 🔄 Post-Submission

### Monitor Review Status

**Apple:**
- Check App Store Connect daily
- Enable email notifications
- Respond to reviewer questions within 24 hours

**Google:**
- Check Google Play Console daily
- Enable email notifications
- Respond to reviewer questions within 24 hours

### Common Rejection Reasons

1. **Missing Privacy Policy**
   - Ensure URL is accessible and complete

2. **Medical Claims**
   - Ensure medical disclaimer is prominent
   - Avoid claims of diagnosis or treatment

3. **Incomplete Metadata**
   - Double-check all required fields
   - Ensure screenshots show actual app content

4. **IAP Issues**
   - Test purchases in sandbox
   - Ensure restore purchases works

5. **Crashes or Bugs**
   - Test thoroughly before submission
   - Fix critical bugs immediately

### If Rejected

1. **Read Rejection Reason Carefully**
   - Apple provides detailed feedback
   - Google may be less specific

2. **Fix Issues**
   - Address all concerns raised
   - Test fixes thoroughly

3. **Respond or Resubmit**
   - If you disagree, use "Appeal" or "Reply"
   - If you agree, fix and resubmit

4. **Resubmit**
   - Upload new build if code changes required
   - Update metadata if content changes required
   - Resubmit for review

---

## 🎉 After Approval

### Launch Checklist

- [ ] Verify app is live in stores
- [ ] Test download and installation
- [ ] Test IAP purchases in production
- [ ] Monitor crash reports (Sentry)
- [ ] Monitor analytics (PostHog)
- [ ] Respond to user reviews
- [ ] Announce launch on social media
- [ ] Send press release (if applicable)

### Ongoing Maintenance

1. **Monitor Reviews**
   - Respond to user feedback
   - Address common issues in updates

2. **Track Metrics**
   - Downloads and installs
   - Active users (DAU/MAU)
   - Subscription conversion rate
   - Retention rates
   - Crash-free rate

3. **Plan Updates**
   - Bug fixes: Release as needed
   - Minor features: Monthly updates
   - Major features: Quarterly updates

4. **Compliance**
   - Keep legal docs updated
   - Respond to privacy requests
   - Monitor regulatory changes

---

## 📞 Support

If you encounter issues during submission:

**Expo/EAS Support:**
- Docs: https://docs.expo.dev/
- Forums: https://forums.expo.dev/
- Discord: https://chat.expo.dev/

**RevenueCat Support:**
- Docs: https://docs.revenuecat.com/
- Support: support@revenuecat.com

**App Store Connect:**
- Support: https://developer.apple.com/contact/

**Google Play Console:**
- Support: https://support.google.com/googleplay/android-developer/

**Nexa Team:**
- Email: support@nexa.app

---

**Good luck with your submission! 🚀**

*Simplify. Scaffold. Support independence.*
