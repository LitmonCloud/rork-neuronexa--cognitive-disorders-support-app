# NeuroNexa Rebrand - Complete Next Steps

**Date:** November 12, 2025
**Status:** Configuration files updated, awaiting Apple Developer setup

---

## ✅ Completed Updates

### 1. Core Configuration Files
- **app.json**
  - App name: "NeuroNexa: Cognitive Disorders Support"
  - Slug: "neuronexa-cognitive-disorders-support"
  - iOS Bundle ID: `app.rork.neuronexa`
  - Android Package: `app.rork.neuronexa`
  - Removed old EAS project ID (will create new one)

- **package.json**
  - Package name: "neuronexa-app"

- **README.md**
  - Updated title and description

---

## 🔴 Required Steps (In Order)

### Step 1: Register New Bundle ID in Apple Developer Portal ⚠️ CRITICAL

**Why:** The Bundle ID changed from `app.rork.nexa-cognitive-disorders-support-ykokwhv` to `app.rork.neuronexa`

**Instructions:**
1. Go to: https://developer.apple.com/account/resources/identifiers/list
2. Log in with: **litmonbobby@yahoo.com**
3. Click **"+" (Register)** button
4. Select **"App IDs"** → Continue
5. Select **"App"** → Continue
6. Enter Bundle ID information:

```
Description: NeuroNexa Cognitive Support
Bundle ID (Explicit): app.rork.neuronexa
```

7. Enable these capabilities:
   - ✅ **Push Notifications**
   - ✅ **App Groups**
     - Click "Configure"
     - Create new group: `group.app.rork.neuronexa`
     - Description: "NeuroNexa app data sharing"
   - ✅ **Sign In with Apple**
     - Select "Enable as a primary App ID"
   - ✅ **iCloud** (Optional)
     - Select CloudKit
     - Create container: `iCloud.app.rork.neuronexa`

8. Click **"Register"**

---

### Step 2: Create New App in App Store Connect ⚠️ CRITICAL

**Why:** "Nexa" was already taken, need to create new app with "NeuroNexa"

**Instructions:**
1. Go to: https://appstoreconnect.apple.com
2. Log in with: **litmonbobby@yahoo.com**
3. Click **"My Apps"** → **"+" (plus icon)** → **"New App"**
4. Fill in the form:

```
Platform: ☑ iOS
Name: NeuroNexa: Cognitive Disorders Support
Primary Language: English (U.S.)
Bundle ID: app.rork.neuronexa (select from dropdown)
SKU: neuronexa-2025
User Access: Full Access
```

5. Click **"Create"**

6. **IMPORTANT:** After creation, copy the **App ID** (10-digit number)
   - You'll find this in the "App Information" section
   - Example: 1234567890

---

### Step 3: Update eas.json with App Store Connect Info

After you get the App ID from Step 2, update the file:

**File:** `eas.json`

**Find this section:**
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "bobby@rork.com",
      "ascAppId": "placeholder",
      "appleTeamId": "placeholder"
    }
  }
}
```

**Replace with:**
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "bobby@rork.com",
      "ascAppId": "YOUR_10_DIGIT_APP_ID",
      "appleTeamId": "YNSMLADB62"
    }
  }
}
```

---

### Step 4: Initialize New EAS Project

Run in terminal:

```bash
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app
eas init
```

When prompted:
- **"Would you like to create a project for @litmoncloud/neuronexa-cognitive-disorders-support?"**
  - Answer: **Yes**

This will:
- Create a new EAS project ID
- Update app.json automatically
- Link the project to your Expo account

---

### Step 5: Build New App with NeuroNexa Branding

After EAS init completes, build the app:

```bash
eas build --platform ios --profile production
```

This will:
- Generate new certificates for `app.rork.neuronexa`
- Create new provisioning profile with updated capabilities
- Build the app with NeuroNexa branding
- Increment build number to 1 (fresh start)

Expected time: ~7-10 minutes

---

### Step 6: Fill Out App Store Connect Metadata

Go back to App Store Connect and complete the app information:

**URL:** https://appstoreconnect.apple.com

#### Version Information

**Promotional Text** (170 characters):
```
Transform daily challenges into manageable steps. NeuroNexa provides AI-powered support for ADHD, autism, and dementia with compassionate, personalized care.
```

**Description** (4,000 characters):
```
NeuroNexa: Your Compassionate Cognitive Support Companion

Living with ADHD, autism, dementia, or other cognitive challenges doesn't mean facing daily tasks alone. NeuroNexa is designed specifically for individuals who need extra support breaking down complex activities, managing emotions, and staying connected with loved ones.

🧠 INTELLIGENT TASK BREAKDOWN
Transform overwhelming tasks into simple, achievable steps. Our AI-powered task coach analyzes your to-do list and creates personalized, easy-to-follow action plans.

💙 EMOTIONAL WELLNESS TOOLS
• Mood Tracking with simple emoji ratings
• Guided Breathing Exercises
• Mindful Finger Tracing activities
• Private Daily Journal

👨‍👩‍👧 FAMILY SUPPORT NETWORK
Connect with caregivers who can monitor wellbeing, receive alerts, and celebrate achievements with you.

🎯 DESIGNED FOR ACCESSIBILITY
• Large, clear buttons and text
• High contrast mode
• Screen reader optimization
• Fully customizable interface

🔒 PRIVACY & SECURITY
• HIPAA-compliant encryption
• All data stored locally
• No data sold to third parties
• Full control over sharing

✨ KEY FEATURES

Smart Task Management
• Break complex tasks into simple steps
• Visual progress tracking
• Customizable reminders
• Voice input support

Emotional Support
• Daily mood check-ins
• Guided breathing exercises
• Mindfulness activities
• Personal journal

Caregiver Collaboration
• Secure family connections
• Real-time wellbeing alerts
• Shared calendar
• Celebration moments

Accessibility First
• Adjustable text sizes
• Color blind friendly modes
• Screen reader compatible
• Simple, clear navigation

WHY NEURONEXA?

We understand that cognitive challenges affect more than just memory or focus—they impact daily life, relationships, and emotional wellbeing. NeuroNexa was created with input from healthcare professionals, caregivers, and individuals living with cognitive disorders to provide meaningful, practical support.

Whether you're managing ADHD, supporting someone with dementia, or navigating life on the autism spectrum, NeuroNexa provides the tools and compassionate guidance you need.

Download NeuroNexa today and experience personalized cognitive support. Free to download.
```

**Keywords** (100 characters):
```
ADHD,autism,dementia,cognitive,caregiver,task manager,mental health,memory,anxiety,wellness
```

**Support URL:**
```
https://litmoncloud.github.io/nexa-legal-docs/
```

**Marketing URL** (optional):
```
https://rork.com
```

**Version:**
```
1.0
```

**Copyright:**
```
© 2025 Rork, Inc. All rights reserved.
```

---

### Step 7: Upload Build to App Store Connect

After the build completes (Step 5), submit to App Store:

```bash
eas submit --platform ios
```

Or manually upload:
1. Download .ipa from EAS Dashboard
2. Upload via Transporter app or Xcode

---

### Step 8: Capture Screenshots

**Required Screenshots:**
- Minimum: 3 screenshots
- Recommended: 5-7 screenshots
- Size: 1290×2796px (iPhone 15 Pro Max)

**Screenshot Ideas:**
1. **Task Breakdown** - Show AI breaking down a complex task
2. **Mood Tracking** - Daily mood check-in screen
3. **Caregiver Connection** - Family support dashboard
4. **Breathing Exercise** - Guided breathing animation
5. **Accessibility** - Settings showing customization options

After capturing, upload in App Store Connect:
- App Store → Your App → Screenshots → Upload

---

## 📋 Checklist

Use this checklist to track progress:

- [ ] Step 1: Register new Bundle ID `app.rork.neuronexa` in Apple Developer Portal
  - [ ] Enable Push Notifications
  - [ ] Configure App Groups (`group.app.rork.neuronexa`)
  - [ ] Enable Sign In with Apple
  - [ ] (Optional) Configure iCloud

- [ ] Step 2: Create new app in App Store Connect
  - [ ] App name: "NeuroNexa: Cognitive Disorders Support"
  - [ ] Bundle ID: `app.rork.neuronexa`
  - [ ] SKU: `neuronexa-2025`
  - [ ] Copy App ID (10-digit number)

- [ ] Step 3: Update eas.json with App ID
  - [ ] Replace `ascAppId` placeholder with real App ID

- [ ] Step 4: Run `eas init` to create new project

- [ ] Step 5: Run `eas build --platform ios --profile production`

- [ ] Step 6: Fill out App Store Connect metadata
  - [ ] Promotional Text
  - [ ] Description
  - [ ] Keywords
  - [ ] URLs
  - [ ] Copyright

- [ ] Step 7: Submit build via `eas submit --platform ios`

- [ ] Step 8: Capture and upload screenshots

- [ ] Step 9: Submit app for review

---

## 🆘 Troubleshooting

### Issue: "Bundle ID already exists"
**Solution:** The Bundle ID `app.rork.neuronexa` should be unique. If it says it already exists, you may have created it before. In that case, select it from the list instead of creating a new one.

### Issue: "App name already taken"
**Solution:** Try variations:
- "NeuroNexa"
- "NeuroNexa: Cognitive Support"
- "NeuroNexa - Cognitive Disorders Support"

### Issue: EAS build fails with "No provisioning profile"
**Solution:**
```bash
eas credentials
# Select iOS → Production → Delete all
# Then rebuild: eas build --platform ios --profile production
```

### Issue: "Slug mismatch error"
**Solution:** Already fixed. The app.json slug now matches the project configuration.

---

## 📞 Need Help?

If you encounter issues:
1. Check the EAS Build dashboard: https://expo.dev/accounts/litmoncloud/projects
2. Review build logs for specific errors
3. Consult Apple Developer documentation
4. Contact EAS support for build-related issues

---

**Next Action:** Start with Step 1 - Register the new Bundle ID in Apple Developer Portal
