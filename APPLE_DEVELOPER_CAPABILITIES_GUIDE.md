# Apple Developer Capabilities Configuration Guide

**App:** Nexa Cognitive Disorders Support App
**Bundle ID:** `app.rork.nexa-cognitive-disorders-support-ykokwhv`
**Apple Developer Account:** litmonbobby@yahoo.com
**Team:** BOBBY LITMON (YNSMLADB62)
**Date:** November 12, 2025

---

## Overview

This guide explains how to configure required capabilities for your iOS app in the Apple Developer Portal. Capabilities enable specific features like Push Notifications, Background Location, and iCloud sync.

---

## Required Capabilities Summary

| Capability | Required | Status | Purpose |
|------------|----------|--------|---------|
| Push Notifications | ✅ Yes | ✅ Enabled | Task reminders, caregiver alerts |
| Background Modes | ✅ Yes | ⚠️ Manual setup | Location tracking for caregivers |
| App Groups | ⚠️ Recommended | ❌ Not set | Future widgets/extensions |
| iCloud | ⚠️ Optional | ❌ Not set | Cloud data sync |
| HealthKit | ❌ Optional | ❌ Not set | Health data integration |
| Sign In with Apple | ⚠️ Recommended | ❌ Not set | Privacy-focused auth |

---

## Step-by-Step Configuration

### Step 1: Access Apple Developer Portal

1. **Log in to Apple Developer:**
   - URL: https://developer.apple.com/account
   - Email: litmonbobby@yahoo.com
   - Password: [Your Apple ID password]

2. **Navigate to Certificates, Identifiers & Profiles:**
   - Click "Certificates, Identifiers & Profiles" in the left sidebar
   - Or go directly to: https://developer.apple.com/account/resources/identifiers/list

3. **Find Your Bundle ID:**
   - Click "Identifiers" in the sidebar
   - Search for: `app.rork.nexa-cognitive-disorders-support-ykokwhv`
   - Click on the Bundle ID to open it

---

### Step 2: Configure Push Notifications ✅

**Status:** Already configured by EAS Build

**Verification:**
```
✔ Push Notifications are set up
```

If you need to manually verify or reconfigure:

1. In Bundle ID settings, scroll to "Capabilities"
2. Find "Push Notifications"
3. Ensure the checkbox is **checked** ✅
4. Click "Save" if you made changes

**What this enables:**
- Task reminders and notifications
- Caregiver alert notifications
- System notifications via expo-notifications

---

### Step 3: Configure Background Modes ⚠️

**Status:** Requires manual setup
**Priority:** High (needed for location tracking)

#### 3.1 Enable Background Modes Capability

1. In Bundle ID settings, scroll to "Capabilities"
2. Find "Background Modes"
3. Check the box next to "Background Modes" ✅

#### 3.2 Select Specific Background Modes

After enabling, you'll see a list of background mode options. Enable these:

**Required:**
- ✅ **Location updates** - For caregiver location tracking
- ✅ **Remote notifications** - For push notification handling

**Optional (for future features):**
- ⬜ Audio, AirPlay, and Picture in Picture - Not needed
- ⬜ Voice over IP - Not needed
- ⬜ External accessory communication - Not needed
- ⬜ Uses Bluetooth LE accessories - Not needed
- ⬜ Acts as a Bluetooth LE accessory - Not needed
- ⬜ Background fetch - Optional (for background data sync)
- ⬜ Background processing - Optional (for scheduled tasks)

#### 3.3 Save Configuration

1. Click "Save" at the top right
2. Confirm the changes

**What this enables:**
- Continuous location tracking for patient safety
- Location updates even when app is in background
- Caregiver can monitor patient location in real-time

---

### Step 4: Configure App Groups (Recommended)

**Status:** Not configured
**Priority:** Medium (needed for widgets, extensions)

#### 4.1 Why You Need This

App Groups allow data sharing between:
- Main app and widgets (Today widget, Lock Screen widgets)
- Main app and Watch app (future Apple Watch support)
- Main app and extensions (Share extension, Notification Service Extension)

#### 4.2 Create App Group

1. In Bundle ID settings, scroll to "Capabilities"
2. Find "App Groups"
3. Check the box next to "App Groups" ✅
4. Click "Configure" or "Edit"

#### 4.3 Register App Group Identifier

1. Click "+" to add a new App Group
2. Enter App Group ID:
   ```
   group.app.rork.nexa
   ```
3. Enter Description:
   ```
   Nexa App Group for widgets and extensions
   ```
4. Click "Continue"
5. Click "Register"

#### 4.4 Assign to Bundle ID

1. Back in your Bundle ID settings
2. Under "App Groups", select the group you just created:
   - ✅ `group.app.rork.nexa`
3. Click "Save"

**What this enables:**
- Share data between app and widgets
- Access shared UserDefaults/Keychain
- Future support for Apple Watch app

---

### Step 5: Configure iCloud (Optional)

**Status:** Not configured
**Priority:** Low (optional cloud sync feature)

#### 5.1 When to Enable

Enable iCloud if you want:
- User data sync across devices
- Automatic backup to iCloud
- CloudKit database integration

#### 5.2 Enable iCloud Capability

1. In Bundle ID settings, scroll to "Capabilities"
2. Find "iCloud"
3. Check the box next to "iCloud" ✅
4. Click "Configure" or "Edit"

#### 5.3 Select iCloud Services

Choose the services you need:

**Recommended:**
- ✅ **CloudKit** - For structured data storage
- ✅ **Key-value storage** - For small settings/preferences

**Optional:**
- ⬜ iCloud Documents - For document-based apps (not needed)

#### 5.4 Configure CloudKit Container

1. Click "+" to create a new CloudKit Container
2. Enter Container ID:
   ```
   iCloud.app.rork.nexa
   ```
3. Click "Continue"
4. Click "Register"

#### 5.5 Assign to Bundle ID

1. Back in Bundle ID settings
2. Under "iCloud", select:
   - ✅ CloudKit
   - ✅ Key-value storage
   - Container: `iCloud.app.rork.nexa`
3. Click "Save"

**What this enables:**
- Sync user data across iOS devices
- Backup task data, moods, journal entries
- Seamless multi-device experience

---

### Step 6: Configure Sign In with Apple (Recommended)

**Status:** Not configured
**Priority:** Medium (required if using social logins)

#### 6.1 Why You Should Enable This

Apple's App Store Review Guidelines **require** Sign In with Apple if you offer:
- Google Sign In
- Facebook Login
- Any other third-party authentication

Even if you're only using email/password, adding Sign In with Apple provides:
- Enhanced user privacy
- No need to remember passwords
- Two-factor authentication built-in
- Improved App Store review likelihood

#### 6.2 Enable Sign In with Apple

1. In Bundle ID settings, scroll to "Capabilities"
2. Find "Sign In with Apple"
3. Check the box next to "Sign In with Apple" ✅
4. Select configuration:
   - ⦿ **Enable as a primary App ID** (recommended)
5. Click "Save"

**What this enables:**
- Native Apple authentication
- Privacy-focused login (hide email option)
- Fast authentication via Face ID/Touch ID

---

### Step 7: Configure HealthKit (Optional)

**Status:** Not configured
**Priority:** Low (only if integrating health data)

#### 7.1 When to Enable

Only enable if your app will:
- Read health data from Apple Health
- Write health data to Apple Health
- Track physical activity, sleep, heart rate, etc.

**Note:** Requires additional privacy policy disclosures and App Store approval process.

#### 7.2 Enable HealthKit Capability

1. In Bundle ID settings, scroll to "Capabilities"
2. Find "HealthKit"
3. Check the box next to "HealthKit" ✅
4. Click "Save"

**App Store Requirements:**
- Must provide detailed privacy policy
- Must explain exactly what health data is used
- Apple reviews HealthKit apps more strictly
- Cannot monetize or sell health data

---

## After Configuration: Regenerate Provisioning Profile

After enabling any new capabilities, you **must** regenerate your provisioning profile.

### Option 1: Automatic Regeneration (Recommended)

Let EAS handle it automatically on your next build:

```bash
# Rebuild to automatically regenerate provisioning profile
eas build --platform ios --profile production
```

EAS will detect the capability changes and regenerate the profile.

### Option 2: Manual Regeneration

1. Go to "Profiles" in Apple Developer Portal
2. Find your profile: `AT66534L96` or search for Bundle ID
3. Click "Edit"
4. Click "Generate"
5. Download the new profile (optional - EAS manages this)

---

## Verify Configuration

### Check via EAS CLI

```bash
# View current iOS credentials and capabilities
eas credentials -p ios

# This will show:
# - Distribution Certificate
# - Provisioning Profile
# - Enabled capabilities
```

### Check in Apple Developer Portal

1. Go to: https://developer.apple.com/account/resources/identifiers/bundleId/edit/app.rork.nexa-cognitive-disorders-support-ykokwhv
2. Scroll to "Capabilities" section
3. Verify all required capabilities are checked:
   - ✅ Push Notifications
   - ✅ Background Modes
   - ✅ App Groups (if configured)
   - ✅ iCloud (if configured)
   - ✅ Sign In with Apple (if configured)

### Test in Xcode (Optional)

If you have Xcode installed:

1. Open your project in Xcode
2. Select your target
3. Go to "Signing & Capabilities" tab
4. Verify all capabilities appear with no errors

---

## Capability Configuration Matrix

### Current Configuration

| Capability | Enabled | Configured | Next Steps |
|------------|---------|------------|------------|
| Push Notifications | ✅ Yes | ✅ Complete | None - working |
| Background Modes | ❌ No | ❌ Pending | Enable manually |
| App Groups | ❌ No | ❌ Pending | Create `group.app.rork.nexa` |
| iCloud | ❌ No | ❌ Pending | Optional - create container |
| Sign In with Apple | ❌ No | ❌ Pending | Recommended before App Store |
| HealthKit | ❌ No | ❌ Pending | Only if using health data |

### Recommended Priority Order

**Phase 1: Before App Store Submission (This Week)**
1. ✅ Push Notifications - Already done
2. ⚠️ Background Modes - Enable "Location updates"
3. ⚠️ Sign In with Apple - Enable if using any social logins

**Phase 2: Before Public Release (Next 2 Weeks)**
4. ⚠️ App Groups - Enable for widgets/extensions
5. ⚠️ iCloud - Enable if you want cloud sync

**Phase 3: Future Enhancements (Post-Launch)**
6. ❌ HealthKit - Only if adding health tracking features

---

## Troubleshooting

### "Capability not available" Error

**Problem:** Capability shows as unavailable or grayed out

**Solutions:**
1. Verify your Apple Developer Program membership is active
2. Check if capability requires paid developer account (all above do)
3. Ensure you're logged in with correct Team ID (YNSMLADB62)
4. Contact Apple Developer Support if persists

### "Provisioning Profile Invalid" Error

**Problem:** Build fails with provisioning profile error

**Solutions:**
1. Regenerate provisioning profile (see "After Configuration" section)
2. Delete old profile and create new one
3. Run `eas build:configure` to refresh EAS credentials
4. Clear Xcode derived data and re-download profiles

### "Capability Mismatch" Warning

**Problem:** Xcode shows capability mismatch warning

**Solutions:**
1. Ensure Info.plist matches enabled capabilities
2. Sync entitlements with Bundle ID settings
3. Clean build folder in Xcode
4. Regenerate provisioning profile

### EAS Build Not Detecting Changes

**Problem:** New capabilities not appearing in build

**Solutions:**
```bash
# Clear EAS credentials cache
eas credentials -p ios --clear-provisioning-profile

# Rebuild with fresh credentials
eas build --platform ios --profile production --clear-cache
```

---

## Code Changes Required

After enabling capabilities, you may need to update your app code:

### Background Modes - Location Updates

Update `app.json` to include background modes:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": [
          "location",
          "remote-notification"
        ]
      }
    }
  }
}
```

Already configured ✅ (see lines 26-30 in app.json)

### App Groups

Add entitlement to share data with widgets:

```typescript
// In your app code
import * as SharedStorage from 'expo-shared-preferences';

// Access shared data
const appGroupIdentifier = 'group.app.rork.nexa';
```

### iCloud/CloudKit

Configure CloudKit container:

```typescript
// In your app code
import { CloudKit } from 'react-native-cloudkit';

const containerIdentifier = 'iCloud.app.rork.nexa';
```

---

## Security & Privacy Considerations

### Data Protection

All capabilities enabled must comply with:
- **Apple's App Store Review Guidelines**
- **GDPR** (EU users)
- **COPPA** (users under 13)
- **HIPAA** (health data - your app handles mental health data)

### Required Privacy Disclosures

Update your App Store listing and Privacy Policy to disclose:

**Push Notifications:**
- "We send notifications for task reminders and caregiver alerts"

**Location Services:**
- "We use location to help caregivers monitor patient safety"
- "Location is only collected with explicit user permission"

**iCloud (if enabled):**
- "We sync your data across devices using iCloud"
- "Data is encrypted in transit and at rest"

### Privacy Policy URLs

Ensure these are set in App Store Connect:
- **Privacy Policy:** https://litmoncloud.github.io/nexa-legal-docs/privacy.html
- **Terms of Service:** https://litmoncloud.github.io/nexa-legal-docs/terms.html

---

## Quick Reference Commands

### View Current Capabilities
```bash
# Via EAS
eas credentials -p ios

# Via web
open https://developer.apple.com/account/resources/identifiers/bundleId/edit/app.rork.nexa-cognitive-disorders-support-ykokwhv
```

### Regenerate Provisioning Profile
```bash
# Automatic via rebuild
eas build --platform ios --profile production

# Manual clear and rebuild
eas credentials -p ios --clear-provisioning-profile
eas build --platform ios --profile production
```

### Check Build Capabilities
```bash
# View latest build details
eas build:view bc5518aa-5408-4c17-8ccc-a5ca8051c172

# List all builds
eas build:list --limit 5
```

---

## Checklist: Before App Store Submission

Use this checklist to ensure all capabilities are properly configured:

### Essential Capabilities
- [x] **Push Notifications** - Enabled and tested
- [ ] **Background Modes** - Enable "Location updates"
- [ ] **Background Modes** - Enable "Remote notifications"

### Recommended Capabilities
- [ ] **Sign In with Apple** - Required if using social logins
- [ ] **App Groups** - For widgets and extensions

### Optional Capabilities
- [ ] **iCloud** - For cloud sync
- [ ] **HealthKit** - Only if tracking health data

### Verification Steps
- [ ] All capabilities enabled in Bundle ID settings
- [ ] Provisioning profile regenerated
- [ ] New build created with updated capabilities
- [ ] Build tested on physical device
- [ ] Privacy Policy updated with capability disclosures
- [ ] App Store listing updated with permissions

---

## Next Steps

1. **Enable Background Modes:**
   - Go to Apple Developer Portal
   - Edit Bundle ID
   - Enable "Background Modes" → "Location updates"
   - Save changes

2. **Rebuild iOS App:**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Test Location Features:**
   - Install new build on physical device
   - Test location tracking in background
   - Verify caregiver monitoring works

4. **Prepare for App Store:**
   - Enable Sign In with Apple (if needed)
   - Update Privacy Policy
   - Complete App Store listing

---

## Support Resources

### Apple Documentation
- **Capabilities Overview:** https://developer.apple.com/documentation/xcode/capabilities
- **Background Modes:** https://developer.apple.com/documentation/xcode/configuring-background-execution-modes
- **App Groups:** https://developer.apple.com/documentation/xcode/configuring-app-groups
- **CloudKit:** https://developer.apple.com/documentation/cloudkit
- **Sign In with Apple:** https://developer.apple.com/sign-in-with-apple/

### Expo/EAS Documentation
- **iOS Capabilities:** https://docs.expo.dev/build-reference/ios-capabilities/
- **EAS Credentials:** https://docs.expo.dev/app-signing/app-credentials/
- **Background Tasks:** https://docs.expo.dev/versions/latest/sdk/task-manager/

### Contact Support
- **Apple Developer Support:** https://developer.apple.com/support/
- **Expo Support:** https://forums.expo.dev/
- **Your Developer Account:** https://developer.apple.com/account

---

**Document Version:** 1.0
**Last Updated:** November 12, 2025
**Bundle ID:** app.rork.nexa-cognitive-disorders-support-ykokwhv
**Team:** BOBBY LITMON (YNSMLADB62)
