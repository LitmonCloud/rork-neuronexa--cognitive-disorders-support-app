# App Store Connect Setup Guide

**App:** Nexa Cognitive Disorders Support
**Date:** November 12, 2025
**Apple ID:** litmonbobby@yahoo.com

---

## Step 1: Create App in App Store Connect

### Access App Store Connect
1. **URL:** https://appstoreconnect.apple.com
2. **Login:** litmonbobby@yahoo.com
3. **Team:** BOBBY LITMON (YNSMLADB62)

### Create New App

1. Click "My Apps" in top navigation
2. Click "+" (plus icon) next to "Apps"
3. Select "New App"

---

## Step 2: App Information

Fill in these exact values:

### Basic Information

```
Platform(s): ✓ iOS
           ☐ tvOS
           ☐ watchOS
           ☐ visionOS

Name: Nexa: Cognitive Disorders Support

Primary Language: English (U.S.)

Bundle ID: app.rork.nexa-cognitive-disorders-support-ykokwhv

SKU: nexa-cognitive-support-2025

User Access: Full Access
```

### SKU Explanation
- **What it is:** Internal identifier for your records
- **Format:** `nexa-cognitive-support-2025`
- **Purpose:** Tracking and organization (not visible to users)
- **Cannot change:** Once created, SKU is permanent

---

## Step 3: App Details

After creating the app, fill in these sections:

### App Information

**Name:**
```
Nexa: Cognitive Disorders Support
```

**Subtitle (30 characters max):**
```
ADHD, Autism & Cognitive Care
```

**Privacy Policy URL:**
```
https://litmoncloud.github.io/nexa-legal-docs/privacy.html
```

**Category:**
```
Primary: Health & Fitness
Secondary: Medical
```

### Age Rating

Complete the questionnaire honestly:

**Expected Ratings:**
- Unrestricted Web Access: No
- Medical/Treatment Information: Yes (mental health support)
- Made for Kids: No
- Age Rating: 4+ or 12+ (depending on content)

**IMPORTANT:** Since your app handles mental health data for ADHD, autism, and dementia:
- Select "Medical/Treatment Information: Yes"
- Explain: "Provides task management and wellness support for individuals with cognitive disorders"

---

## Step 4: Pricing and Availability

### Pricing

```
Price: Free

In-App Purchases: Yes (if using RevenueCat subscriptions)
```

### Availability

```
Countries/Regions: All territories (or select specific ones)

Pre-Order: No (not needed for first release)
```

---

## Step 5: App Privacy

**Privacy Policy URL:**
```
https://litmoncloud.github.io/nexa-legal-docs/privacy.html
```

### Data Collection Disclosure

You'll need to declare what data you collect. Based on your app:

**Data Types You Collect:**

1. **Contact Info**
   - Email (for account creation)
   - Usage: Account creation, customer support

2. **Health & Fitness**
   - Mood tracking data
   - Task completion data
   - Journal entries
   - Usage: App functionality
   - Linked to User: Yes
   - Used for Tracking: No

3. **Location**
   - Precise location (for caregiver monitoring)
   - Usage: App functionality (patient safety)
   - Linked to User: Yes
   - Used for Tracking: No
   - Optional: Yes (user must enable)

4. **User Content**
   - Photos (for memory exercises)
   - Audio (for voice notes - if implemented)
   - Usage: App functionality
   - Linked to User: Yes

5. **Identifiers**
   - User ID
   - Device ID
   - Usage: Analytics, app functionality
   - Linked to User: Yes

**Privacy Practices:**
- ✓ Data is encrypted in transit
- ✓ Data is encrypted on device
- ✓ User can request data deletion
- ✓ Complies with App Privacy Policy

---

## Step 6: Build Upload (After Creating App)

### Get App-Specific Information

After creating the app, you'll see:

**App Store Connect App ID (ascAppId):**
- Found in App Information section
- Format: 10-digit number (e.g., 1234567890)
- This is what you need for eas.json!

**Example:**
```
App Apple ID: 6738291045
```

### Update eas.json

Replace placeholder in eas.json:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "bobby@rork.com",
        "ascAppId": "6738291045",  // ← Replace with your actual App ID
        "appleTeamId": "YNSMLADB62"
      }
    }
  }
}
```

---

## Step 7: App Review Information

### Contact Information

```
First Name: Bobby
Last Name: Litmon
Email: bobby@rork.com (or litmonbobby@yahoo.com)
Phone: [Your phone number]
```

### Demo Account (If Login Required)

If your app requires login to review features:

```
Username: reviewer@nexa-demo.com
Password: [Create a test account password]

Notes:
"Demo account has sample data including:
- 5 completed tasks
- Mood tracking history
- Sample journal entries
- Caregiver connection (optional feature)
All features are accessible without payment."
```

### Notes for Review

```
Nexa is a cognitive support app for individuals with ADHD, autism,
and dementia. The app helps users:
- Break down complex tasks into manageable steps
- Track moods and emotional wellbeing
- Practice breathing exercises for anxiety management
- Connect with caregivers for additional support (optional)

IMPORTANT NOTES:
- Location tracking is OPTIONAL and only used with explicit user permission
- All health data is encrypted and stored locally
- Caregiver features require mutual consent
- App is HIPAA-compliant for mental health data
```

---

## Step 8: Screenshots

You need screenshots for each device size:

**Required Sizes:**
- iPhone 6.7" (1290×2796) - iPhone 15 Pro Max, 14 Pro Max
- iPhone 6.5" (1284×2778) - iPhone 14 Plus, 13 Pro Max, 12 Pro Max

**Minimum Required:** 3 screenshots per size
**Maximum Allowed:** 10 screenshots per size
**Recommended:** 5-7 screenshots showing key features

**See:** PHASE_4_SCREENSHOT_GUIDE.md for capture instructions

---

## Step 9: App Preview/Video (Optional)

You can upload app preview videos:
- Duration: 15-30 seconds
- Shows key features in action
- Format: .mov, .m4v, or .mp4
- Not required but improves conversion

---

## Step 10: Submit for Review

### Pre-Submission Checklist

Before clicking "Submit for Review":

- [ ] All required fields completed
- [ ] Screenshots uploaded (all sizes)
- [ ] Privacy Policy URL working
- [ ] Terms of Service URL working (if applicable)
- [ ] Age rating completed
- [ ] Export Compliance answered
- [ ] Content Rights verified
- [ ] Build uploaded and processed

### Export Compliance

You'll be asked about encryption:

**Question:** "Is your app designed to use cryptography or does it contain or incorporate cryptography?"

**Answer for Nexa:**
```
No - The app uses standard iOS encryption (HTTPS, data protection)
but does not implement custom cryptography.
```

This matches your app.json setting:
```json
"ITSAppUsesNonExemptEncryption": false
```

---

## Quick Reference: Key Values

**For eas.json:**
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "bobby@rork.com",
        "ascAppId": "1234567890",  // From App Store Connect
        "appleTeamId": "YNSMLADB62"
      }
    }
  }
}
```

**App Details:**
- Name: Nexa: Cognitive Disorders Support
- SKU: nexa-cognitive-support-2025
- Bundle ID: app.rork.nexa-cognitive-disorders-support-ykokwhv
- Categories: Health & Fitness, Medical
- Price: Free
- Privacy URL: https://litmoncloud.github.io/nexa-legal-docs/privacy.html

---

## Troubleshooting

### "Bundle ID not found"
- Ensure Bundle ID is registered in Certificates, Identifiers & Profiles
- Check spelling matches exactly: app.rork.nexa-cognitive-disorders-support-ykokwhv

### "SKU already exists"
- SKUs must be unique across all your apps
- Try different SKU like: nexa-cognitive-2025-v2

### "App name not available"
- App names must be unique
- Try variations: "Nexa - Cognitive Support" or "Nexa: ADHD & Cognitive Care"

### "Build not available"
- Wait 5-10 minutes after build completes for processing
- Build must show "Ready for Submission" status in TestFlight

---

**Last Updated:** November 12, 2025
**Status:** Ready for app creation in App Store Connect
